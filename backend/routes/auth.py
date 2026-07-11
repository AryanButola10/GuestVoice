"""
Auth routes for GuestVoice.

Endpoints:
  POST /api/auth/register       — Register new user (bcrypt hashed password)
  POST /api/auth/login          — Login, returns JWT
  GET  /api/auth/me             — Get current user info (protected)
  GET  /api/auth/google         — Redirect to Google OAuth
  GET  /api/auth/google/callback — Handle Google OAuth callback, return JWT
"""

import os
import bcrypt
from datetime import datetime

from fastapi import APIRouter, HTTPException, Depends, Request, status
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth, OAuthError
from slowapi import Limiter
from slowapi.util import get_remote_address

from database import get_users_collection
from models.user import UserRegister, UserLogin, UserResponse, Token
from auth.jwt_handler import create_access_token
from auth.dependencies import get_current_user

# ---------------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------------
router = APIRouter()
limiter = Limiter(key_func=get_remote_address)

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# ---------------------------------------------------------------------------
# Google OAuth setup using Authlib
# ---------------------------------------------------------------------------
oauth = OAuth()
oauth.register(
    name="google",
    client_id=os.getenv("GOOGLE_CLIENT_ID"),
    client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)


# ---------------------------------------------------------------------------
# Password helpers
# ---------------------------------------------------------------------------
def hash_password(password: str) -> str:
    """Hash password using bcrypt with 12 salt rounds."""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=12)).decode('utf-8')


def verify_password(plain: str, hashed: str) -> bool:
    """Verify a plain password against its bcrypt hash."""
    return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))


# ---------------------------------------------------------------------------
# POST /api/auth/register — Create new user
# Rate limit: 5 requests per 15 minutes
# ---------------------------------------------------------------------------
@router.post("/register", response_model=Token, status_code=201)
@limiter.limit("5/15minutes")
async def register(request: Request, payload: UserRegister):
    """
    Register a new user.
    - Validates email format and password length (Pydantic)
    - Hashes password with bcrypt (never stores plain text)
    - Returns 400 if email already registered
    - Returns JWT on success
    """
    collection = get_users_collection()

    # Check for duplicate email
    existing = await collection.find_one({"email": payload.email})
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    # Hash the password — NEVER store plain text
    hashed = hash_password(payload.password)

    # Store the new user
    user_doc = {
        "name": payload.name,
        "email": payload.email,
        "hashed_password": hashed,
        "provider": "local",
        "created_at": datetime.utcnow().isoformat(),
    }
    result = await collection.insert_one(user_doc)
    user_id = str(result.inserted_id)

    # Generate JWT
    token = create_access_token({
        "sub": user_id,
        "email": payload.email,
        "name": payload.name,
    })

    print(f"✅ New user registered: {payload.email}")
    return Token(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user_id,
            email=payload.email,
            name=payload.name,
            provider="local",
        ),
    )


# ---------------------------------------------------------------------------
# POST /api/auth/login — Authenticate user
# Rate limit: 5 requests per 15 minutes
# ---------------------------------------------------------------------------
@router.post("/login", response_model=Token, status_code=200)
@limiter.limit("5/15minutes")
async def login(request: Request, payload: UserLogin):
    """
    Login with email + password.
    - Returns 401 if credentials are wrong (vague message for security)
    - Returns JWT on success
    """
    collection = get_users_collection()

    # Find user by email (local accounts only)
    user = await collection.find_one({"email": payload.email, "provider": "local"})

    # Verify credentials — same error for both wrong email and wrong password
    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    user_id = str(user["_id"])
    token = create_access_token({
        "sub": user_id,
        "email": user["email"],
        "name": user["name"],
    })

    print(f"🔐 User logged in: {user['email']}")
    return Token(
        access_token=token,
        token_type="bearer",
        user=UserResponse(
            id=user_id,
            email=user["email"],
            name=user["name"],
            provider="local",
        ),
    )


# ---------------------------------------------------------------------------
# GET /api/auth/me — Get current logged-in user info
# Protected — requires valid JWT
# ---------------------------------------------------------------------------
@router.get("/me", response_model=UserResponse)
async def get_me(current_user: dict = Depends(get_current_user)):
    """Return the currently authenticated user's info from the JWT payload."""
    return UserResponse(
        id=current_user["sub"],
        email=current_user["email"],
        name=current_user["name"],
        provider=current_user.get("provider", "local"),
    )


# ---------------------------------------------------------------------------
# GET /api/auth/google — Redirect to Google consent screen
# ---------------------------------------------------------------------------
@router.get("/google")
async def google_login(request: Request):
    """Redirect the user to Google's OAuth consent screen."""
    redirect_uri = "http://localhost:8000/api/auth/google/callback"
    return await oauth.google.authorize_redirect(request, redirect_uri)


# ---------------------------------------------------------------------------
# GET /api/auth/google/callback — Handle Google OAuth callback
# ---------------------------------------------------------------------------
@router.get("/google/callback")
async def google_callback(request: Request):
    """
    Handle Google OAuth callback.
    - Exchanges auth code for user info
    - Creates user in DB if first time login
    - Returns JWT via redirect to frontend
    """
    try:
        token = await oauth.google.authorize_access_token(request)
    except OAuthError as e:
        raise HTTPException(status_code=400, detail=f"OAuth error: {str(e)}")

    user_info = token.get("userinfo")
    if not user_info:
        raise HTTPException(status_code=400, detail="Failed to get user info from Google.")

    email = user_info["email"]
    name = user_info.get("name", email.split("@")[0])

    collection = get_users_collection()

    # Find or create user
    user = await collection.find_one({"email": email})
    if not user:
        user_doc = {
            "name": name,
            "email": email,
            "hashed_password": None,
            "provider": "google",
            "created_at": datetime.utcnow().isoformat(),
        }
        result = await collection.insert_one(user_doc)
        user_id = str(result.inserted_id)
        print(f"✅ New Google user: {email}")
    else:
        user_id = str(user["_id"])
        name = user.get("name", name)
        print(f"🔐 Google login: {email}")

    # Create JWT
    jwt_token = create_access_token({
        "sub": user_id,
        "email": email,
        "name": name,
        "provider": "google",
    })

    # Redirect to frontend with token in query param
    return RedirectResponse(
        url=f"{FRONTEND_URL}/auth/callback?token={jwt_token}"
    )

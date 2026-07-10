"""
FastAPI dependency — extracts and validates the JWT from the
Authorization: Bearer <token> header.

Usage:
    @router.post("/reviews")
    async def create_review(current_user: dict = Depends(get_current_user)):
        ...
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from auth.jwt_handler import verify_access_token


# Tells FastAPI where the token comes from (used in Swagger UI)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """
    Validates the JWT from the Authorization header.
    Returns the decoded user payload if valid.
    Raises HTTP 401 if token is missing, expired, or invalid.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Not authenticated. Please log in.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = verify_access_token(token)
    if payload is None:
        raise credentials_exception

    # Ensure required fields exist in the token payload
    if not payload.get("sub") or not payload.get("email"):
        raise credentials_exception

    return payload

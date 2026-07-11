"""
GuestVoice — FastAPI Backend Entry Point
Runs on: http://localhost:8000
API docs: http://localhost:8000/docs
"""

import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.sessions import SessionMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv

# ---------------------------------------------------------------------------
# Load .env FIRST — before importing routers that read env vars at module level
# ---------------------------------------------------------------------------
load_dotenv()

from database import connect_to_mongo, close_mongo_connection
from routes.reviews import router as reviews_router
from routes.auth import router as auth_router

PORT = int(os.getenv("PORT", 8000))


# ---------------------------------------------------------------------------
# Lifespan — connect to MongoDB on startup, disconnect on shutdown
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_mongo()   # startup
    yield
    await close_mongo_connection()  # shutdown


# ---------------------------------------------------------------------------
# Rate limiter — used by auth routes (5 req / 15 min)
# ---------------------------------------------------------------------------
limiter = Limiter(key_func=get_remote_address)


# ---------------------------------------------------------------------------
# Initialise FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(
    title="GuestVoice API",
    description="REST API for AI-powered guest review analysis for homestay businesses.",
    version="3.0.0",
    lifespan=lifespan,
)

# Attach rate limiter to app state
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ---------------------------------------------------------------------------
# Session middleware — required for Google OAuth state management (Authlib)
# ---------------------------------------------------------------------------
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("JWT_SECRET", "fallback_session_secret"),
)

# ---------------------------------------------------------------------------
# CORS — allow requests from the React frontend (http://localhost:5173)
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Global error handler — catches unhandled 500 errors
# ---------------------------------------------------------------------------
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again later."},
    )

# ---------------------------------------------------------------------------
# Root health-check endpoint
# ---------------------------------------------------------------------------
@app.get("/", tags=["Health"])
async def root():
    """Health check — confirms the API is running."""
    return {"status": "ok", "message": "GuestVoice API is running 🚀 (MongoDB + Auth ready)"}

# ---------------------------------------------------------------------------
# Register routers
# ---------------------------------------------------------------------------
app.include_router(reviews_router, prefix="/api", tags=["Reviews"])
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])

"""
GuestVoice — FastAPI Backend Entry Point
Runs on: http://localhost:8000
API docs: http://localhost:8000/docs
"""

import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

from routes.reviews import router as reviews_router

# ---------------------------------------------------------------------------
# Load environment variables from .env
# ---------------------------------------------------------------------------
load_dotenv()
PORT = int(os.getenv("PORT", 8000))

# ---------------------------------------------------------------------------
# Initialise FastAPI app
# ---------------------------------------------------------------------------
app = FastAPI(
    title="GuestVoice API",
    description="REST API for AI-powered guest review analysis for homestay businesses.",
    version="1.0.0",
)

# ---------------------------------------------------------------------------
# CORS — allow requests from the React frontend (http://localhost:5173)
# ---------------------------------------------------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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
def root():
    """Health check — confirms the API is running."""
    return {"status": "ok", "message": "GuestVoice API is running 🚀"}

# ---------------------------------------------------------------------------
# Register routers
# ---------------------------------------------------------------------------
app.include_router(reviews_router, prefix="/api", tags=["Reviews"])

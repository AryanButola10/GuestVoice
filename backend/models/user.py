"""
Pydantic schemas for user authentication in GuestVoice.
"""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserRegister(BaseModel):
    """Schema for user registration request body."""
    name: str = Field(..., min_length=1, max_length=100, description="Full name")
    email: EmailStr = Field(..., description="Valid email address")
    password: str = Field(..., min_length=8, description="Password (min 8 characters)")


class UserLogin(BaseModel):
    """Schema for user login request body."""
    email: EmailStr = Field(..., description="Registered email address")
    password: str = Field(..., min_length=1, description="Account password")


class UserResponse(BaseModel):
    """Safe user object returned in API responses — never includes password."""
    id: str
    name: str
    email: str
    provider: str  # "local" | "google"


class Token(BaseModel):
    """JWT token response returned after successful login or register."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

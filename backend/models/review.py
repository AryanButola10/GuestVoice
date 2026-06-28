"""
Pydantic models (schemas) for GuestVoice review endpoints.

ReviewCreate  — body expected on POST /api/reviews
ReviewUpdate  — body expected on PUT /api/reviews/{id}
ReviewResponse — shape of every review returned to the client
"""

from pydantic import BaseModel, Field
from typing import Optional


class ReviewCreate(BaseModel):
    """Schema for creating a new review (POST body)."""

    guest_name: str = Field(..., min_length=1, max_length=100, description="Full name of the guest")
    property: str = Field(..., min_length=1, max_length=150, description="Name of the property/homestay")
    rating: int = Field(..., ge=1, le=5, description="Rating from 1 (worst) to 5 (best)")
    review_text: str = Field(..., min_length=10, description="The guest review text")


class ReviewUpdate(BaseModel):
    """Schema for updating an existing review (PUT body). All fields optional."""

    guest_name: Optional[str] = Field(None, min_length=1, max_length=100)
    property: Optional[str] = Field(None, min_length=1, max_length=150)
    rating: Optional[int] = Field(None, ge=1, le=5)
    review_text: Optional[str] = Field(None, min_length=10)


class ReviewResponse(BaseModel):
    """Schema for a review object returned in API responses."""

    id: str
    guest_name: str
    property: str
    rating: int
    review_text: str
    sentiment: str
    themes: list[str]
    created_at: str

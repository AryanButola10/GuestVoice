"""
AI analysis endpoint for GuestVoice.
Uses Google Gemini REST API directly via httpx to analyse guest reviews and generate:
  - AI sentiment + confidence score
  - Smart theme detection
  - One-sentence summary
  - Suggested management response
  - Improvement suggestions

Endpoint:
  POST /api/ai/analyze  — protected (requires JWT)
"""

import os
import json
import re
import httpx
from fastapi import APIRouter, HTTPException, Depends, status
from pydantic import BaseModel, Field

from auth.dependencies import get_current_user

# ---------------------------------------------------------------------------
# Setup
# ---------------------------------------------------------------------------
router = APIRouter()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Models available with this API key — lite models have free tier quota
GEMINI_URLS = [
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent",
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent",
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent",
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-001:generateContent",
]


# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------
class ReviewAnalysisRequest(BaseModel):
    review_text: str = Field(..., min_length=10, description="The guest review text to analyse")
    guest_name: str = Field(..., min_length=1)
    property: str = Field(..., min_length=1)
    rating: int = Field(..., ge=1, le=5)


class ReviewAnalysisResponse(BaseModel):
    ai_sentiment: str
    confidence: int
    ai_themes: list[str]
    summary: str
    management_response: str
    improvement_suggestions: list[str]


# ---------------------------------------------------------------------------
# Prompt builder — Version 3 (best performing, documented in PROMPTS.md)
# ---------------------------------------------------------------------------
def build_prompt(review_text: str, guest_name: str, property: str, rating: int) -> str:
    return f"""You are an expert hospitality analytics AI for GuestVoice, a platform that helps homestay \
property owners understand and respond to guest reviews professionally.

Analyse the following guest review and return ONLY a valid JSON object with exactly these fields:
- "ai_sentiment": one of "positive", "neutral", or "negative"
- "confidence": integer 0-100 representing how confident you are in the sentiment
- "ai_themes": array of strings from this list only: ["cleanliness", "location", "hospitality", "food", "value", "connectivity", "comfort", "amenities", "general"]
- "summary": one clear sentence summarising the guest experience
- "management_response": a professional, warm, personalised 2-3 sentence reply the property owner can send to the guest. Address them by first name.
- "improvement_suggestions": array of 1-3 specific, actionable improvements for the property owner (empty array [] if the review is fully positive with rating 5)

Guest Review Details:
- Guest Name: {guest_name}
- Property: {property}
- Rating: {rating}/5 stars
- Review: "{review_text}"

Rules:
- Return ONLY the JSON object. No markdown, no code blocks, no explanation.
- Be empathetic and professional in the management_response.
- Base sentiment strictly on the review text, not just the rating.
- Keep improvement_suggestions concise and specific."""


# ---------------------------------------------------------------------------
# Helper: extract JSON from Gemini response (handles markdown code blocks)
# ---------------------------------------------------------------------------
def extract_json(text: str) -> dict:
    text = text.strip()
    text = re.sub(r'^```(?:json)?\s*', '', text)
    text = re.sub(r'\s*```$', '', text)
    return json.loads(text)


# ---------------------------------------------------------------------------
# Helper: call Gemini REST API directly via httpx (tries multiple endpoints)
# ---------------------------------------------------------------------------
async def call_gemini(prompt: str) -> str:
    """Call Gemini API via REST, trying multiple endpoint versions."""
    request_body = {
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.3,
            "maxOutputTokens": 512,
        }
    }

    last_error = None
    async with httpx.AsyncClient(timeout=30.0) as http:
        for url in GEMINI_URLS:
            try:
                print(f"🤖 Trying Gemini endpoint: {url}")
                resp = await http.post(
                    url,
                    params={"key": GEMINI_API_KEY},
                    json=request_body,
                    headers={"Content-Type": "application/json"},
                )

                if resp.status_code == 200:
                    data = resp.json()
                    text = data["candidates"][0]["content"]["parts"][0]["text"]
                    print(f"✅ Gemini responded successfully via {url}")
                    return text

                error_data = resp.json()
                error_msg = error_data.get("error", {}).get("message", str(resp.status_code))
                print(f"⚠️  Endpoint {url} returned {resp.status_code}: {error_msg[:80]}")
                last_error = (resp.status_code, error_msg)

            except httpx.TimeoutException:
                last_error = (504, "timeout")
                print(f"⚠️  Timeout on {url}")

    # All endpoints failed
    code, msg = last_error or (503, "unknown error")
    raise Exception(f"{code}: {msg}")


# ---------------------------------------------------------------------------
# POST /api/ai/analyze — Analyse a review using Gemini AI
# Protected — requires valid JWT
# ---------------------------------------------------------------------------
@router.post("/analyze", response_model=ReviewAnalysisResponse, status_code=200)
async def analyze_review(
    payload: ReviewAnalysisRequest,
    current_user: dict = Depends(get_current_user)
):
    """
    Analyse a guest review using Google Gemini AI.
    Returns structured sentiment, themes, summary, management response, and suggestions.
    Requires authentication to prevent API abuse.
    """
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI service is not configured. Contact administrator."
        )

    try:
        prompt = build_prompt(
            review_text=payload.review_text,
            guest_name=payload.guest_name,
            property=payload.property,
            rating=payload.rating,
        )

        raw_text = await call_gemini(prompt)
        result = extract_json(raw_text)

        # Validate required fields
        required = ["ai_sentiment", "confidence", "ai_themes", "summary",
                    "management_response", "improvement_suggestions"]
        for field in required:
            if field not in result:
                raise ValueError(f"Missing field in AI response: {field}")

        # Normalise values
        result["ai_sentiment"] = result["ai_sentiment"].lower()
        result["confidence"] = max(0, min(100, int(result["confidence"])))

        print(f"✅ AI analysis complete for review by {payload.guest_name} at {payload.property}")
        return ReviewAnalysisResponse(**result)

    except json.JSONDecodeError as e:
        print(f"❌ JSON parse error from Gemini: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI returned an unexpected format. Please try again."
        )
    except Exception as e:
        error_str = str(e)
        error_msg = error_str.lower()
        print(f"❌ Gemini error: {error_str}")

        if any(k in error_msg for k in ["quota", "resource_exhausted", "429"]):
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="AI rate limit reached. Please wait a moment and try again."
            )
        if any(k in error_msg for k in ["timeout", "504"]):
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="AI service timed out. Please try again."
            )

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"AI service error: {error_str[:150]}"
        )

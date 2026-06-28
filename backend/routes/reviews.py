"""
All review-related REST API endpoints for GuestVoice.

Endpoints:
  GET    /api/reviews              — list all reviews
  GET    /api/reviews/search       — search reviews by keyword
  GET    /api/reviews/{id}         — get a single review
  POST   /api/reviews              — create a new review
  PUT    /api/reviews/{id}         — update a review
  DELETE /api/reviews/{id}         — delete a review
  GET    /api/stats                — get review statistics
"""

from fastapi import APIRouter, HTTPException, Query
from datetime import datetime

from data.store import reviews_db, get_next_id
from models.review import ReviewCreate, ReviewUpdate, ReviewResponse

router = APIRouter()


# ---------------------------------------------------------------------------
# Helper: derive sentiment from rating (simple rule — AI comes in Week 5)
# ---------------------------------------------------------------------------
def _get_sentiment(rating: int) -> str:
    if rating >= 4:
        return "positive"
    elif rating == 3:
        return "neutral"
    return "negative"


# ---------------------------------------------------------------------------
# Helper: extract themes from review text via keyword matching
# ---------------------------------------------------------------------------
THEME_KEYWORDS = {
    "cleanliness": ["clean", "dirty", "dust", "spotless", "messy", "hygiene"],
    "location":    ["location", "view", "area", "nearby", "accessible", "central"],
    "hospitality": ["host", "staff", "friendly", "welcoming", "responsive", "helpful"],
    "connectivity": ["wifi", "internet", "connection", "signal", "slow"],
    "food":        ["food", "breakfast", "meal", "dining", "delicious", "taste"],
    "value":       ["price", "value", "expensive", "affordable", "worth", "cost"],
}

def _extract_themes(text: str) -> list[str]:
    text_lower = text.lower()
    found = []
    for theme, keywords in THEME_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            found.append(theme)
    return found if found else ["general"]


# ---------------------------------------------------------------------------
# GET /api/reviews — list all reviews
# ---------------------------------------------------------------------------
@router.get("/reviews", response_model=list[ReviewResponse], status_code=200)
def get_all_reviews():
    """Return the full list of reviews."""
    return reviews_db


# ---------------------------------------------------------------------------
# GET /api/reviews/search?q=keyword — search reviews
# NOTE: This route MUST be defined before /reviews/{id} to avoid conflicts
# ---------------------------------------------------------------------------
@router.get("/reviews/search", response_model=list[ReviewResponse], status_code=200)
def search_reviews(q: str = Query(..., min_length=1, description="Search keyword")):
    """Search reviews by guest name, property, or review text."""
    keyword = q.lower()
    results = [
        r for r in reviews_db
        if keyword in r["review_text"].lower()
        or keyword in r["guest_name"].lower()
        or keyword in r["property"].lower()
    ]
    return results


# ---------------------------------------------------------------------------
# GET /api/reviews/{id} — get a single review
# ---------------------------------------------------------------------------
@router.get("/reviews/{review_id}", response_model=ReviewResponse, status_code=200)
def get_review(review_id: str):
    """Return a single review by ID. Returns 404 if not found."""
    review = next((r for r in reviews_db if r["id"] == review_id), None)
    if not review:
        raise HTTPException(status_code=404, detail=f"Review with id '{review_id}' not found.")
    return review


# ---------------------------------------------------------------------------
# POST /api/reviews — create a new review
# ---------------------------------------------------------------------------
@router.post("/reviews", response_model=ReviewResponse, status_code=201)
def create_review(payload: ReviewCreate):
    """Submit a new guest review. Automatically assigns sentiment and themes."""
    new_review = {
        "id": get_next_id(),
        "guest_name": payload.guest_name,
        "property": payload.property,
        "rating": payload.rating,
        "review_text": payload.review_text,
        "sentiment": _get_sentiment(payload.rating),
        "themes": _extract_themes(payload.review_text),
        "created_at": datetime.utcnow().isoformat(),
    }
    reviews_db.append(new_review)
    return new_review


# ---------------------------------------------------------------------------
# PUT /api/reviews/{id} — update a review
# ---------------------------------------------------------------------------
@router.put("/reviews/{review_id}", response_model=ReviewResponse, status_code=200)
def update_review(review_id: str, payload: ReviewUpdate):
    """Update an existing review's fields. Returns 404 if not found."""
    review = next((r for r in reviews_db if r["id"] == review_id), None)
    if not review:
        raise HTTPException(status_code=404, detail=f"Review with id '{review_id}' not found.")

    if payload.guest_name is not None:
        review["guest_name"] = payload.guest_name
    if payload.property is not None:
        review["property"] = payload.property
    if payload.rating is not None:
        review["rating"] = payload.rating
        review["sentiment"] = _get_sentiment(payload.rating)
    if payload.review_text is not None:
        review["review_text"] = payload.review_text
        review["themes"] = _extract_themes(payload.review_text)

    return review


# ---------------------------------------------------------------------------
# DELETE /api/reviews/{id} — delete a review
# ---------------------------------------------------------------------------
@router.delete("/reviews/{review_id}", status_code=204)
def delete_review(review_id: str):
    """Delete a review by ID. Returns 404 if not found, 204 on success."""
    review = next((r for r in reviews_db if r["id"] == review_id), None)
    if not review:
        raise HTTPException(status_code=404, detail=f"Review with id '{review_id}' not found.")
    reviews_db.remove(review)
    return None


# ---------------------------------------------------------------------------
# GET /api/stats — review statistics
# ---------------------------------------------------------------------------
@router.get("/stats", status_code=200)
def get_stats():
    """Return summary statistics: total count, sentiment breakdown, top theme."""
    total = len(reviews_db)

    if total == 0:
        return {
            "total_reviews": 0,
            "positive_percent": 0,
            "neutral_percent": 0,
            "negative_percent": 0,
            "top_theme": "—",
            "average_rating": 0,
        }

    positive = sum(1 for r in reviews_db if r["sentiment"] == "positive")
    neutral   = sum(1 for r in reviews_db if r["sentiment"] == "neutral")
    negative  = sum(1 for r in reviews_db if r["sentiment"] == "negative")
    avg_rating = round(sum(r["rating"] for r in reviews_db) / total, 1)

    # Flatten all themes and count frequency
    all_themes: list[str] = []
    for r in reviews_db:
        all_themes.extend(r["themes"])
    top_theme = max(set(all_themes), key=all_themes.count) if all_themes else "—"

    return {
        "total_reviews": total,
        "positive_percent": round(positive / total * 100),
        "neutral_percent":  round(neutral  / total * 100),
        "negative_percent": round(negative / total * 100),
        "top_theme": top_theme,
        "average_rating": avg_rating,
    }

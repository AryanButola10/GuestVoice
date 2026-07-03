"""
All review-related REST API endpoints for GuestVoice.
Now using MongoDB Atlas via Motor (async) instead of in-memory store.

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
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime

from database import get_reviews_collection
from models.review import ReviewCreate, ReviewUpdate, ReviewResponse

router = APIRouter()


# ---------------------------------------------------------------------------
# Helper: convert MongoDB _id (ObjectId) → string id for API responses
# ---------------------------------------------------------------------------
def _doc_to_dict(doc: dict) -> dict:
    """Convert a MongoDB document to a plain dict with string id."""
    doc["id"] = str(doc.pop("_id"))
    return doc


def _parse_object_id(review_id: str) -> ObjectId:
    """Parse a string to ObjectId, raise 400 if invalid format."""
    try:
        return ObjectId(review_id)
    except (InvalidId, Exception):
        raise HTTPException(status_code=400, detail=f"Invalid review ID format: '{review_id}'")


# ---------------------------------------------------------------------------
# Helper: derive sentiment from rating
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
    found = [theme for theme, kws in THEME_KEYWORDS.items() if any(kw in text_lower for kw in kws)]
    return found if found else ["general"]


# ---------------------------------------------------------------------------
# GET /api/reviews — list all reviews
# ---------------------------------------------------------------------------
@router.get("/reviews", response_model=list[ReviewResponse], status_code=200)
async def get_all_reviews():
    """Return the full list of reviews from MongoDB."""
    collection = get_reviews_collection()
    cursor = collection.find().sort("created_at", -1)
    reviews = await cursor.to_list(length=1000)
    return [_doc_to_dict(r) for r in reviews]


# ---------------------------------------------------------------------------
# GET /api/reviews/search?q=keyword — search reviews
# NOTE: Must be defined BEFORE /reviews/{id} to avoid route conflicts
# ---------------------------------------------------------------------------
@router.get("/reviews/search", response_model=list[ReviewResponse], status_code=200)
async def search_reviews(q: str = Query(..., min_length=1, description="Search keyword")):
    """Search reviews by guest name, property name, or review text (case-insensitive)."""
    collection = get_reviews_collection()
    regex = {"$regex": q, "$options": "i"}
    cursor = collection.find({
        "$or": [
            {"review_text": regex},
            {"guest_name": regex},
            {"property": regex},
        ]
    })
    results = await cursor.to_list(length=1000)
    return [_doc_to_dict(r) for r in results]


# ---------------------------------------------------------------------------
# GET /api/reviews/{id} — get a single review
# ---------------------------------------------------------------------------
@router.get("/reviews/{review_id}", response_model=ReviewResponse, status_code=200)
async def get_review(review_id: str):
    """Return a single review by MongoDB ObjectId. Returns 404 if not found."""
    collection = get_reviews_collection()
    obj_id = _parse_object_id(review_id)
    doc = await collection.find_one({"_id": obj_id})
    if not doc:
        raise HTTPException(status_code=404, detail=f"Review with id '{review_id}' not found.")
    return _doc_to_dict(doc)


# ---------------------------------------------------------------------------
# POST /api/reviews — create a new review
# ---------------------------------------------------------------------------
@router.post("/reviews", response_model=ReviewResponse, status_code=201)
async def create_review(payload: ReviewCreate):
    """Submit a new guest review. Sentiment and themes are auto-assigned."""
    collection = get_reviews_collection()
    new_review = {
        "guest_name":  payload.guest_name,
        "property":    payload.property,
        "rating":      payload.rating,
        "review_text": payload.review_text,
        "sentiment":   _get_sentiment(payload.rating),
        "themes":      _extract_themes(payload.review_text),
        "created_at":  datetime.utcnow().isoformat(),
    }
    result = await collection.insert_one(new_review)
    new_review["_id"] = result.inserted_id
    return _doc_to_dict(new_review)


# ---------------------------------------------------------------------------
# PUT /api/reviews/{id} — update a review
# ---------------------------------------------------------------------------
@router.put("/reviews/{review_id}", response_model=ReviewResponse, status_code=200)
async def update_review(review_id: str, payload: ReviewUpdate):
    """Update an existing review. Returns 404 if not found."""
    collection = get_reviews_collection()
    obj_id = _parse_object_id(review_id)

    # Build update fields from only the provided values
    updates: dict = {}
    if payload.guest_name is not None:
        updates["guest_name"] = payload.guest_name
    if payload.property is not None:
        updates["property"] = payload.property
    if payload.rating is not None:
        updates["rating"] = payload.rating
        updates["sentiment"] = _get_sentiment(payload.rating)
    if payload.review_text is not None:
        updates["review_text"] = payload.review_text
        updates["themes"] = _extract_themes(payload.review_text)

    if not updates:
        raise HTTPException(status_code=400, detail="No fields provided to update.")

    result = await collection.find_one_and_update(
        {"_id": obj_id},
        {"$set": updates},
        return_document=True,
    )
    if not result:
        raise HTTPException(status_code=404, detail=f"Review with id '{review_id}' not found.")
    return _doc_to_dict(result)


# ---------------------------------------------------------------------------
# DELETE /api/reviews/{id} — delete a review
# ---------------------------------------------------------------------------
@router.delete("/reviews/{review_id}", status_code=204)
async def delete_review(review_id: str):
    """Delete a review by ID. Returns 204 on success, 404 if not found."""
    collection = get_reviews_collection()
    obj_id = _parse_object_id(review_id)
    result = await collection.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail=f"Review with id '{review_id}' not found.")
    return None


# ---------------------------------------------------------------------------
# GET /api/stats — review statistics
# ---------------------------------------------------------------------------
@router.get("/stats", status_code=200)
async def get_stats():
    """Return summary statistics: total count, sentiment breakdown, top theme, avg rating."""
    collection = get_reviews_collection()
    reviews = await collection.find().to_list(length=10000)
    total = len(reviews)

    if total == 0:
        return {
            "total_reviews":    0,
            "positive_percent": 0,
            "neutral_percent":  0,
            "negative_percent": 0,
            "top_theme":        "—",
            "average_rating":   0,
        }

    positive = sum(1 for r in reviews if r.get("sentiment") == "positive")
    neutral   = sum(1 for r in reviews if r.get("sentiment") == "neutral")
    negative  = sum(1 for r in reviews if r.get("sentiment") == "negative")
    avg_rating = round(sum(r.get("rating", 0) for r in reviews) / total, 1)

    all_themes: list[str] = []
    for r in reviews:
        all_themes.extend(r.get("themes", []))
    top_theme = max(set(all_themes), key=all_themes.count) if all_themes else "—"

    return {
        "total_reviews":    total,
        "positive_percent": round(positive / total * 100),
        "neutral_percent":  round(neutral  / total * 100),
        "negative_percent": round(negative / total * 100),
        "top_theme":        top_theme,
        "average_rating":   avg_rating,
    }

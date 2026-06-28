"""
In-memory data store for GuestVoice reviews.
Acts as the database for Week 4 (no real DB yet — that's Week 5).
"""

from datetime import datetime

# ---------------------------------------------------------------------------
# Pre-seeded sample reviews so the frontend has real data to display
# ---------------------------------------------------------------------------
reviews_db: list[dict] = [
    {
        "id": "1",
        "guest_name": "Sarah Mitchell",
        "property": "Mountain View Cottage",
        "rating": 5,
        "review_text": "Absolutely wonderful stay! The cottage was spotless, the views were breathtaking, and the host was incredibly warm and welcoming. Will definitely come back.",
        "sentiment": "positive",
        "themes": ["cleanliness", "location", "hospitality"],
        "created_at": "2024-05-10T09:15:00",
    },
    {
        "id": "2",
        "guest_name": "Rahul Verma",
        "property": "Riverside Retreat",
        "rating": 4,
        "review_text": "Great location near the river. The room was clean and comfortable. The wifi was a bit slow at times but overall a lovely experience.",
        "sentiment": "positive",
        "themes": ["location", "cleanliness", "connectivity"],
        "created_at": "2024-05-18T14:30:00",
    },
    {
        "id": "3",
        "guest_name": "Emily Carter",
        "property": "Forest Hideaway",
        "rating": 2,
        "review_text": "Disappointed with the stay. The room was dusty and not well maintained. Staff was unresponsive to our requests. Would not recommend.",
        "sentiment": "negative",
        "themes": ["cleanliness", "hospitality"],
        "created_at": "2024-06-01T11:00:00",
    },
    {
        "id": "4",
        "guest_name": "James Patel",
        "property": "Sunset Bungalow",
        "rating": 3,
        "review_text": "Average experience. The property was okay, nothing spectacular. Breakfast was decent. Location was convenient but the price felt a bit high for what was offered.",
        "sentiment": "neutral",
        "themes": ["food", "location", "value"],
        "created_at": "2024-06-12T08:45:00",
    },
    {
        "id": "5",
        "guest_name": "Priya Sharma",
        "property": "Hilltop Haven",
        "rating": 5,
        "review_text": "One of the best homestays I have ever visited! The host went above and beyond. The food was homemade and delicious. Stunning location and super clean.",
        "sentiment": "positive",
        "themes": ["food", "hospitality", "cleanliness", "location"],
        "created_at": "2024-06-20T17:00:00",
    },
]

# ---------------------------------------------------------------------------
# ID counter — increments with each new review created via POST
# ---------------------------------------------------------------------------
_id_counter: int = 6


def get_next_id() -> str:
    global _id_counter
    current = str(_id_counter)
    _id_counter += 1
    return current

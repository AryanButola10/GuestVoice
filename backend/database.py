"""
MongoDB connection setup for GuestVoice using Motor (async driver).
Motor is the official async MongoDB driver — built for FastAPI.
"""

import os
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime

# ---------------------------------------------------------------------------
# Module-level references — set during app startup via lifespan
# ---------------------------------------------------------------------------
_client: AsyncIOMotorClient = None
_db = None


async def connect_to_mongo():
    """Open connection to MongoDB Atlas. Called on app startup."""
    global _client, _db
    mongo_uri = os.getenv("MONGO_URI")
    if not mongo_uri:
        raise RuntimeError("MONGO_URI is not set in .env file!")
    _client = AsyncIOMotorClient(mongo_uri)
    _db = _client.get_default_database()
    print(f"✅ Connected to MongoDB: {_db.name}")
    await seed_initial_data()


async def close_mongo_connection():
    """Close MongoDB connection. Called on app shutdown."""
    global _client
    if _client:
        _client.close()
        print("🔌 MongoDB connection closed.")


def get_reviews_collection():
    """Return the reviews collection. Used by route handlers."""
    return _db["reviews"]


# ---------------------------------------------------------------------------
# Seed 5 sample reviews if the collection is empty (first run only)
# ---------------------------------------------------------------------------
SAMPLE_REVIEWS = [
    {
        "guest_name": "Sarah Mitchell",
        "property": "Mountain View Cottage",
        "rating": 5,
        "review_text": "Absolutely wonderful stay! The cottage was spotless, the views were breathtaking, and the host was incredibly warm and welcoming. Will definitely come back.",
        "sentiment": "positive",
        "themes": ["cleanliness", "location", "hospitality"],
        "created_at": datetime(2024, 5, 10, 9, 15).isoformat(),
    },
    {
        "guest_name": "Rahul Verma",
        "property": "Riverside Retreat",
        "rating": 4,
        "review_text": "Great location near the river. The room was clean and comfortable. The wifi was a bit slow at times but overall a lovely experience.",
        "sentiment": "positive",
        "themes": ["location", "cleanliness", "connectivity"],
        "created_at": datetime(2024, 5, 18, 14, 30).isoformat(),
    },
    {
        "guest_name": "Emily Carter",
        "property": "Forest Hideaway",
        "rating": 2,
        "review_text": "Disappointed with the stay. The room was dusty and not well maintained. Staff was unresponsive to our requests. Would not recommend.",
        "sentiment": "negative",
        "themes": ["cleanliness", "hospitality"],
        "created_at": datetime(2024, 6, 1, 11, 0).isoformat(),
    },
    {
        "guest_name": "James Patel",
        "property": "Sunset Bungalow",
        "rating": 3,
        "review_text": "Average experience. The property was okay, nothing spectacular. Breakfast was decent. Location was convenient but the price felt a bit high for what was offered.",
        "sentiment": "neutral",
        "themes": ["food", "location", "value"],
        "created_at": datetime(2024, 6, 12, 8, 45).isoformat(),
    },
    {
        "guest_name": "Priya Sharma",
        "property": "Hilltop Haven",
        "rating": 5,
        "review_text": "One of the best homestays I have ever visited! The host went above and beyond. The food was homemade and delicious. Stunning location and super clean.",
        "sentiment": "positive",
        "themes": ["food", "hospitality", "cleanliness", "location"],
        "created_at": datetime(2024, 6, 20, 17, 0).isoformat(),
    },
]


async def seed_initial_data():
    """Insert sample reviews only if the collection is empty."""
    collection = get_reviews_collection()
    count = await collection.count_documents({})
    if count == 0:
        await collection.insert_many(SAMPLE_REVIEWS)
        print(f" Seeded {len(SAMPLE_REVIEWS)} sample reviews into MongoDB.")
    else:
        print(f" Found {count} existing reviews in MongoDB — skipping seed.")

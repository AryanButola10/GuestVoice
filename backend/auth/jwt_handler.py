"""
JWT utility — create and verify access tokens for GuestVoice.
Uses python-jose with HS256 algorithm.
"""

import os
from datetime import datetime, timedelta
from jose import JWTError, jwt


JWT_SECRET = os.getenv("JWT_SECRET", "fallback_dev_secret_change_in_production")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
JWT_EXPIRE_DAYS = int(os.getenv("JWT_EXPIRE_DAYS", "7"))


def create_access_token(data: dict) -> str:
    """
    Create a signed JWT token with the given payload.
    Automatically adds expiry (default: 7 days).
    """
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=JWT_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_access_token(token: str) -> dict | None:
    """
    Decode and validate a JWT token.
    Returns the payload dict if valid, None if expired or invalid.
    """
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except JWTError:
        return None

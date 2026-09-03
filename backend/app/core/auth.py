"""
Authentication - JWT Token Verification
Simple JWT decoder for FastAPI
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from typing import Optional, Dict
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

security = HTTPBearer()


def decode_access_token(token: str) -> Optional[Dict]:
    """
    Decode JWT access token
    
    Args:
        token: JWT token string
        
    Returns:
        Dict with token payload or None if invalid
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError as e:
        logger.error(f"JWT decode error: {e}")
        return None


def get_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    """
    Extract user ID from JWT token
    
    Args:
        credentials: HTTP Bearer token
        
    Returns:
        User ID from token
        
    Raises:
        HTTPException: If token is invalid
    """
    token = credentials.credentials
    payload = decode_access_token(token)
    
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user_id


def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False)),
) -> Optional[Dict]:
    """
    Optional user extraction (doesn't fail if no token)
    
    Args:
        credentials: Optional HTTP Bearer token
        
    Returns:
        Token payload or None
    """
    if not credentials:
        return None
    
    token = credentials.credentials
    return decode_access_token(token)


def get_current_user(
    user_id: str = Depends(get_user_id),
) -> Dict:
    """
    Get current authenticated user
    
    Args:
        user_id: User ID from token
        
    Returns:
        User dict with ID
    """
    return {"id": user_id}

"""
Authentication Test Endpoints
Test Supabase JWT token verification
"""
from fastapi import APIRouter, Depends
from typing import Dict
from app.core.auth import get_current_user, get_optional_user, get_user_id

router = APIRouter()


@router.get("/me")
async def get_current_user_info(user: Dict = Depends(get_current_user)):
    """
    Get current authenticated user information
    
    Requires: Valid Supabase JWT token in Authorization header
    """
    return {
        "success": True,
        "user": {
            "id": user["user_id"],
            "email": user["email"],
            "role": user["role"]
        },
        "message": "Authentication successful"
    }


@router.get("/me/id")
async def get_my_id(user_id: str = Depends(get_user_id)):
    """
    Get just the user ID (simpler)
    """
    return {
        "success": True,
        "user_id": user_id
    }


@router.get("/public")
async def public_endpoint(user: Dict = Depends(get_optional_user)):
    """
    Public endpoint - shows different content for logged-in users
    """
    if user:
        return {
            "success": True,
            "message": f"Hello, {user['email']}!",
            "authenticated": True,
            "user_id": user["user_id"]
        }
    else:
        return {
            "success": True,
            "message": "Hello, guest!",
            "authenticated": False
        }


@router.get("/protected")
async def protected_endpoint(user: Dict = Depends(get_current_user)):
    """
    Protected endpoint - requires authentication
    """
    return {
        "success": True,
        "message": "This is a protected resource",
        "user_id": user["user_id"],
        "user_email": user["email"]
    }

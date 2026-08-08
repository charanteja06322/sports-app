"""
Authentication Schemas
Pydantic models for request/response validation - Supabase Version
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ===== Request Schemas =====

class UserSignupRequest(BaseModel):
    """Schema for user registration"""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=100)
    full_name: str = Field(..., min_length=2, max_length=255)
    phone: Optional[str] = Field(None, max_length=20)


class UserLoginRequest(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


# ===== Response Schemas =====

class UserResponse(BaseModel):
    """Schema for user data in responses - Supabase version"""
    id: str  # Supabase uses UUID strings
    email: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    """Schema for authentication token response"""
    access_token: str
    token_type: str = "bearer"


class AuthResponse(BaseModel):
    """Schema for complete authentication response"""
    user: UserResponse
    access_token: Optional[str] = None  # May be None if email confirmation required
    token_type: str = "bearer"

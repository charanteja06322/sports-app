"""
Team Schemas
Pydantic models for team request/response validation
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime
from ..models.team import SportType, TeamRole
import re


# ===== Request Schemas =====

class TeamCreateRequest(BaseModel):
    """Schema for creating a new team"""
    name: str = Field(..., min_length=3, max_length=255)
    sport_type: SportType
    description: Optional[str] = Field(None, max_length=2000)
    city: Optional[str] = Field(None, max_length=100)
    country: Optional[str] = Field(None, max_length=100)
    max_members: int = Field(default=25, ge=2, le=100)
    is_public: bool = Field(default=True)
    
    @validator('name')
    def validate_name(cls, v):
        """Validate team name"""
        if not v.strip():
            raise ValueError('Team name cannot be empty')
        return v.strip()


class TeamUpdateRequest(BaseModel):
    """Schema for updating team information"""
    name: Optional[str] = Field(None, min_length=3, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    city: Optional[str] = Field(None, max_length=100)
    country: Optional[str] = Field(None, max_length=100)
    max_members: Optional[int] = Field(None, ge=2, le=100)
    is_public: Optional[bool] = None
    logo_url: Optional[str] = Field(None, max_length=500)


# ===== Response Schemas =====

class TeamMemberResponse(BaseModel):
    """Schema for team member information"""
    id: int
    email: str
    full_name: str
    role: TeamRole
    joined_at: datetime
    
    class Config:
        from_attributes = True


class TeamOwnerResponse(BaseModel):
    """Schema for team owner information"""
    id: int
    email: str
    full_name: str
    
    class Config:
        from_attributes = True


class TeamResponse(BaseModel):
    """Schema for team data in responses"""
    id: int
    name: str
    slug: str
    sport_type: SportType
    description: Optional[str]
    logo_url: Optional[str]
    city: Optional[str]
    country: Optional[str]
    max_members: int
    is_public: bool
    owner_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class TeamDetailResponse(TeamResponse):
    """Schema for detailed team information including owner and member count"""
    owner: TeamOwnerResponse
    member_count: int = 0
    
    class Config:
        from_attributes = True


class TeamListResponse(BaseModel):
    """Schema for paginated team list"""
    teams: List[TeamResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

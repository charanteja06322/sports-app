"""
Tournament Schemas
Pydantic models for tournament request/response validation
"""
from pydantic import BaseModel, Field, validator
from typing import Optional, List
from datetime import datetime, date
from ..models.tournament import TournamentStatus, TournamentFormat, RegistrationStatus


# ===== Request Schemas =====

class TournamentCreateRequest(BaseModel):
    """Schema for creating a tournament"""
    name: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = Field(None, max_length=5000)
    sport_type: str = Field(..., min_length=3, max_length=50)
    format: TournamentFormat
    max_teams: int = Field(default=16, ge=4, le=128)
    min_teams: int = Field(default=4, ge=2, le=64)
    registration_start: datetime
    registration_end: datetime
    start_date: date
    end_date: Optional[date] = None
    venue: Optional[str] = Field(None, max_length=255)
    city: Optional[str] = Field(None, max_length=100)
    country: Optional[str] = Field(None, max_length=100)
    prize_pool: Optional[str] = Field(None, max_length=100)
    entry_fee: Optional[str] = Field(None, max_length=100)
    rules: Optional[str] = Field(None, max_length=10000)
    
    @validator('registration_end')
    def validate_registration_dates(cls, v, values):
        if 'registration_start' in values and v <= values['registration_start']:
            raise ValueError('registration_end must be after registration_start')
        return v
    
    @validator('end_date')
    def validate_tournament_dates(cls, v, values):
        if 'start_date' in values and v and v < values['start_date']:
            raise ValueError('end_date must be after start_date')
        return v
    
    @validator('min_teams')
    def validate_min_max_teams(cls, v, values):
        if 'max_teams' in values and v > values['max_teams']:
            raise ValueError('min_teams cannot be greater than max_teams')
        return v


class TournamentUpdateRequest(BaseModel):
    """Schema for updating tournament"""
    name: Optional[str] = Field(None, min_length=3, max_length=255)
    description: Optional[str] = Field(None, max_length=5000)
    status: Optional[TournamentStatus] = None
    max_teams: Optional[int] = Field(None, ge=4, le=128)
    registration_start: Optional[datetime] = None
    registration_end: Optional[datetime] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    venue: Optional[str] = Field(None, max_length=255)
    city: Optional[str] = Field(None, max_length=100)
    country: Optional[str] = Field(None, max_length=100)
    prize_pool: Optional[str] = Field(None, max_length=100)
    entry_fee: Optional[str] = Field(None, max_length=100)
    rules: Optional[str] = Field(None, max_length=10000)
    banner_url: Optional[str] = Field(None, max_length=500)


class TeamRegistrationRequest(BaseModel):
    """Schema for team registration in tournament"""
    team_id: int
    notes: Optional[str] = Field(None, max_length=1000)


# ===== Response Schemas =====

class TournamentOrganizerResponse(BaseModel):
    """Schema for tournament organizer info"""
    id: int
    email: str
    full_name: str
    
    class Config:
        from_attributes = True


class TournamentResponse(BaseModel):
    """Schema for tournament data"""
    id: int
    name: str
    slug: str
    description: Optional[str]
    sport_type: str
    format: TournamentFormat
    status: TournamentStatus
    max_teams: int
    min_teams: int
    registration_start: datetime
    registration_end: datetime
    start_date: date
    end_date: Optional[date]
    venue: Optional[str]
    city: Optional[str]
    country: Optional[str]
    prize_pool: Optional[str]
    entry_fee: Optional[str]
    banner_url: Optional[str]
    organizer_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class TournamentDetailResponse(TournamentResponse):
    """Schema for detailed tournament info"""
    organizer: TournamentOrganizerResponse
    registered_teams_count: int = 0
    rules: Optional[str] = None
    
    class Config:
        from_attributes = True


class RegisteredTeamResponse(BaseModel):
    """Schema for registered team info"""
    id: int
    name: str
    sport_type: str
    
    class Config:
        from_attributes = True


class TournamentRegistrationResponse(BaseModel):
    """Schema for tournament registration"""
    id: int
    tournament_id: int
    team_id: int
    status: RegistrationStatus
    notes: Optional[str]
    registered_at: datetime
    team: RegisteredTeamResponse
    
    class Config:
        from_attributes = True


class TournamentListResponse(BaseModel):
    """Schema for paginated tournament list"""
    tournaments: List[TournamentResponse]
    total: int
    page: int
    page_size: int
    total_pages: int

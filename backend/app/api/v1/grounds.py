"""
GROUNDS API - Master Architecture

Grounds as important discovery entity

GROUND ARCHITECTURE:
├── Search ├── Nearby ├── Popular └── Ground Profile

GROUND PROFILE:
├── Name ├── Location ├── Photos ├── Facilities ├── Match History
├── Upcoming Matches ├── Teams ├── Events ├── Reviews └── Directions

Ground relationships: GROUND ├── MATCHES ├── EVENTS └── TEAMS
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

class GroundReviewRequest(BaseModel):
    rating: int  # 1-5
    comment: str
    facilities_rating: int
    pitch_rating: int

@router.get("/search")
async def search_grounds(
    q: str,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Search cricket grounds - DISCOVER screen"""
    return {
        "status": "success",
        "data": [
            {
                "id": 1,
                "name": "Wankhede Stadium",
                "location": "Mumbai, Maharashtra",
                "distance": 2.5 if latitude else None,
                "facilities": ["Floodlights", "Pavilion", "Parking"],
                "rating": 4.8,
                "capacity": 33000,
                "pitch_type": "Red soil"
            },
            {
                "id": 2,
                "name": "Local Cricket Ground",
                "location": "Hyderabad, Telangana", 
                "distance": 0.8 if latitude else None,
                "facilities": ["Basic pavilion", "Parking"],
                "rating": 4.2,
                "capacity": 500,
                "pitch_type": "Turf"
            }
        ],
        "pagination": {
            "page": page,
            "limit": limit,
            "total": 15,
            "has_next": False
        }
    }

@router.get("/nearby")
async def get_nearby_grounds(
    latitude: float,
    longitude: float,
    radius: int = 10,  # km
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get grounds near user location - DISCOVER screen"""
    return {
        "status": "success",
        "data": [
            {
                "id": 2,
                "name": "Local Cricket Ground",
                "distance": 0.8,
                "location": "Banjara Hills, Hyderabad",
                "rating": 4.2,
                "upcoming_matches": 3,
                "facilities": ["Basic pavilion", "Parking"]
            },
            {
                "id": 3,
                "name": "Sports Complex Ground", 
                "distance": 1.5,
                "location": "Jubilee Hills, Hyderabad",
                "rating": 4.5,
                "upcoming_matches": 5,
                "facilities": ["Floodlights", "Pavilion", "Parking"]
            }
        ]
    }

@router.get("/popular")
async def get_popular_grounds(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get popular cricket grounds - DISCOVER screen"""
    return {
        "status": "success",
        "data": [
            {
                "id": 1,
                "name": "Wankhede Stadium",
                "location": "Mumbai, Maharashtra",
                "rating": 4.8,
                "matches_played": 245,
                "famous_for": "IPL Finals",
                "image_url": None
            },
            {
                "id": 4,
                "name": "Eden Gardens", 
                "location": "Kolkata, West Bengal",
                "rating": 4.9,
                "matches_played": 180,
                "famous_for": "Historic venue",
                "image_url": None
            }
        ]
    }

@router.get("/{ground_id}")
async def get_ground_profile(
    ground_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get detailed ground information"""
    return {
        "status": "success",
        "data": {
            "id": ground_id,
            "name": "Wankhede Stadium",
            "location": {
                "address": "Churchgate, Mumbai, Maharashtra 400020",
                "latitude": 18.9388,
                "longitude": 72.8258,
                "city": "Mumbai",
                "state": "Maharashtra"
            },
            "details": {
                "capacity": 33000,
                "pitch_type": "Red soil",
                "boundary_dimensions": "Short square boundaries",
                "established": 1974,
                "owned_by": "Mumbai Cricket Association"
            },
            "facilities": [
                {"name": "Floodlights", "available": True},
                {"name": "Pavilion", "available": True},
                {"name": "Parking", "available": True, "spaces": 500},
                {"name": "Food Courts", "available": True},
                {"name": "Practice Nets", "available": True, "count": 4}
            ],
            "statistics": {
                "matches_hosted": 245,
                "average_rating": 4.8,
                "total_reviews": 156,
                "active_teams": 12
            },
            "upcoming_matches": [
                {
                    "id": 1,
                    "teams": "Mumbai Indians vs Chennai Super Kings",
                    "date": "2024-01-20",
                    "time": "19:30",
                    "tournament": "IPL 2024"
                }
            ],
            "recent_matches": [
                {
                    "id": 2,
                    "teams": "India vs Australia", 
                    "date": "2024-01-15",
                    "result": "India won by 6 wickets"
                }
            ],
            "teams": [
                {
                    "id": 1,
                    "name": "Mumbai Indians",
                    "home_ground": True
                }
            ]
        }
    }

@router.get("/{ground_id}/matches")
async def get_ground_matches(
    ground_id: int,
    status: str = "all",  # all, upcoming, completed
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get matches at this ground"""
    return {
        "status": "success",
        "data": [
            {
                "id": 1,
                "team_a": "Mumbai Indians",
                "team_b": "Chennai Super Kings",
                "date": "2024-01-20",
                "time": "19:30",
                "tournament": "IPL 2024",
                "status": "upcoming"
            }
        ],
        "pagination": {
            "page": page,
            "limit": limit,
            "has_next": False
        }
    }

@router.get("/{ground_id}/reviews")
async def get_ground_reviews(
    ground_id: int,
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get ground reviews"""
    return {
        "status": "success",
        "data": [
            {
                "id": 1,
                "user": {
                    "name": "John Doe",
                    "username": "@johndoe"
                },
                "rating": 5,
                "comment": "Amazing stadium! Great atmosphere for cricket.",
                "facilities_rating": 5,
                "pitch_rating": 4,
                "created_at": "2024-01-10T15:30:00Z"
            }
        ],
        "summary": {
            "average_rating": 4.8,
            "total_reviews": 156,
            "rating_distribution": {
                "5": 89,
                "4": 45, 
                "3": 15,
                "2": 5,
                "1": 2
            }
        }
    }

@router.post("/{ground_id}/reviews")
async def create_ground_review(
    ground_id: int,
    review_data: GroundReviewRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Add review for a ground"""
    return {
        "status": "success",
        "data": {
            "id": 123,
            "ground_id": ground_id,
            "user_id": current_user.id,
            "rating": review_data.rating,
            "comment": review_data.comment,
            "created_at": "2024-01-15T10:00:00Z"
        },
        "message": "Review added successfully"
    }

@router.get("/{ground_id}/directions")
async def get_ground_directions(
    ground_id: int,
    from_latitude: float,
    from_longitude: float,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get directions to ground"""
    return {
        "status": "success",
        "data": {
            "distance": "2.5 km",
            "estimated_time": "8 minutes",
            "transport_modes": {
                "driving": "8 mins",
                "walking": "32 mins", 
                "public_transport": "15 mins"
            },
            "nearest_landmarks": [
                "Churchgate Railway Station (500m)",
                "Marine Drive (1.2km)"
            ]
        }
    }
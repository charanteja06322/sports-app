"""
PLAYERS API - Master Architecture

Player profiles are a major product pillar

PLAYER PROFILE ARCHITECTURE:
├── Profile Header (Photo, Name, Username, Location, Playing Role)
├── Cricket Identity (Batting/Bowling Style, Experience, Specializations)  
├── Statistics (Batting, Bowling, Fielding)
├── Recent Performance ├── Match History ├── Teams ├── Tournaments
├── Posts ├── Achievements ├── Followers ├── Following
└── Actions (Message, Follow, Share)
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

class UpdateProfileRequest(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    playing_role: Optional[str] = None
    batting_style: Optional[str] = None
    bowling_style: Optional[str] = None
    experience_years: Optional[int] = None

@router.get("/search")
async def search_players(
    q: str,
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Search for players - Used in DISCOVER screen"""
    return {
        "status": "success",
        "data": [
            {
                "id": 1,
                "name": "Virat Kohli",
                "username": "@virat.kohli", 
                "location": "Delhi, India",
                "playing_role": "Batsman",
                "avatar": None,
                "stats": {
                    "matches": 254,
                    "runs": 12169,
                    "average": 59.07
                }
            },
            {
                "id": 2,
                "name": "Rohit Sharma",
                "username": "@rohitsharma45",
                "location": "Mumbai, India", 
                "playing_role": "Batsman",
                "avatar": None,
                "stats": {
                    "matches": 227,
                    "runs": 9205,
                    "average": 48.96
                }
            }
        ],
        "pagination": {
            "page": page,
            "limit": limit,
            "total": 50,
            "has_next": True
        }
    }

@router.get("/rankings")
async def get_player_rankings(
    category: str = "batting",  # batting, bowling, all_rounder, fielding
    period: str = "overall",    # overall, season, month
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get player rankings - Used in DISCOVER screen"""
    rankings_data = {
        "batting": [
            {"rank": 1, "player": "Rohit Sharma", "stat": "892 runs", "average": 59.47},
            {"rank": 2, "player": "Virat Kohli", "stat": "876 runs", "average": 58.40}, 
            {"rank": 3, "player": "KL Rahul", "stat": "854 runs", "average": 56.93}
        ],
        "bowling": [
            {"rank": 1, "player": "Jasprit Bumrah", "stat": "45 wickets", "average": 18.52},
            {"rank": 2, "player": "Rashid Khan", "stat": "42 wickets", "average": 19.21},
            {"rank": 3, "player": "Yuzvendra Chahal", "stat": "38 wickets", "average": 22.15}
        ]
    }
    
    return {
        "status": "success",
        "data": rankings_data.get(category, []),
        "category": category,
        "period": period
    }

@router.get("/nearby")
async def get_nearby_players(
    latitude: float,
    longitude: float,
    radius: int = 10,  # km
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get players near a location - Used for Play Now feature"""
    return {
        "status": "success", 
        "data": [
            {
                "id": 10,
                "name": "Local Player 1",
                "username": "@localplayer1",
                "distance": 2.5,
                "playing_role": "All-rounder",
                "availability": "Available"
            }
        ]
    }

@router.get("/{player_id}")
async def get_player_profile(
    player_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get complete player profile - PROFILE screen data"""
    return {
        "status": "success",
        "data": {
            "id": player_id,
            "profile": {
                "name": "Charan Teja",
                "username": "@charanteja",
                "bio": "Cricket enthusiast and all-rounder",
                "location": "Hyderabad, India",
                "avatar": None
            },
            "cricket_identity": {
                "playing_role": "All-rounder", 
                "batting_style": "Right-handed",
                "bowling_style": "Right-arm Medium",
                "experience_years": 5,
                "specializations": ["Lower order batting", "Death bowling"]
            },
            "statistics": {
                "batting": {
                    "matches": 45,
                    "runs": 1250,
                    "average": 32.5,
                    "strike_rate": 145.2,
                    "highest_score": 86
                },
                "bowling": {
                    "matches": 45,
                    "wickets": 35,
                    "average": 24.8,
                    "economy": 7.2,
                    "best_figures": "4/25"
                },
                "fielding": {
                    "catches": 18,
                    "run_outs": 5,
                    "stumpings": 0
                }
            },
            "social": {
                "followers_count": 245,
                "following_count": 180,
                "posts_count": 12
            },
            "recent_performance": [
                {
                    "match": "Thunder CC vs Royal Strikers",
                    "performance": "86* (52)",
                    "result": "Player of the Match"
                }
            ],
            "teams": [
                {
                    "id": 1,
                    "name": "Mumbai Warriors",
                    "role": "Captain"
                },
                {
                    "id": 2, 
                    "name": "Corporate League XI",
                    "role": "Player"
                }
            ],
            "achievements": [
                {
                    "title": "Century Maker",
                    "description": "Scored 100+ runs in a match",
                    "icon": "🏆",
                    "achieved_at": "2024-01-10"
                }
            ]
        }
    }

@router.put("/{player_id}")
async def update_player_profile(
    player_id: int,
    profile_data: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update player profile"""
    # TODO: Verify player_id matches current_user.id or has permission
    return {
        "status": "success",
        "message": "Profile updated successfully"
    }

@router.get("/{player_id}/match-history")
async def get_player_match_history(
    player_id: int,
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get player's match history"""
    return {
        "status": "success",
        "data": [
            {
                "match_id": 1,
                "match": "Thunder CC vs Royal Strikers",
                "date": "2024-01-14",
                "performance": {
                    "batting": {"runs": 86, "balls": 52, "not_out": True},
                    "bowling": {"overs": 3, "runs": 24, "wickets": 1}
                },
                "result": "Won by 3 runs",
                "awards": ["Player of the Match"]
            }
        ],
        "pagination": {
            "page": page,
            "limit": limit,
            "total": 45,
            "has_next": True
        }
    }

@router.get("/{player_id}/posts")
async def get_player_posts(
    player_id: int,
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get player's social posts"""
    return {
        "status": "success",
        "data": [
            {
                "id": 1,
                "content": "Great match today! Team effort at its best 💪",
                "type": "text",
                "created_at": "2024-01-15T10:00:00Z",
                "interactions": {
                    "likes": 25,
                    "comments": 5,
                    "shares": 2
                }
            }
        ],
        "pagination": {
            "page": page,
            "limit": limit,
            "has_next": False
        }
    }
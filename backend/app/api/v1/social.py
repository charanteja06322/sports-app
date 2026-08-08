"""
SOCIAL API - Master Architecture

Platform-wide social layer

SOCIAL ARCHITECTURE:
├── FEED (Social activity)
├── POSTS (Content creation)
│   ├── Text ├── Photo ├── Video ├── Match Activity
│   ├── Performance └── Achievement
├── INTERACTIONS (Like, Comment, Share, Save)
├── FOLLOW (Followers, Following)
└── MESSAGING (Direct, Group, Team, Match, Tournament)
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.models.user import User

router = APIRouter()

class CreatePostRequest(BaseModel):
    content: str
    post_type: str = "text"  # text, photo, video, match_activity, performance, achievement
    match_id: Optional[int] = None
    image_url: Optional[str] = None

class CommentRequest(BaseModel):
    content: str

@router.get("/feed")
async def get_social_feed(
    page: int = 1,
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get personalized social feed - Home screen content"""
    # This feeds into HOME screen feed
    return {
        "status": "success",
        "data": [
            {
                "id": 1,
                "type": "player_performance",
                "user": {
                    "id": 2,
                    "name": "Arjun Reddy", 
                    "username": "@arjun_reddy",
                    "avatar": None
                },
                "content": "What a chase! 💪 Great team effort. Proud of the boys!",
                "match_performance": {
                    "player": "Rahul Kumar",
                    "score": "86*",
                    "balls": 52,
                    "match": "Thunder CC vs Royal Strikers"
                },
                "timestamp": "2h",
                "interactions": {
                    "likes": 128,
                    "comments": 24,
                    "shares": 8
                }
            },
            {
                "id": 2,
                "type": "match_result",
                "content": "Falcons CC defeated Warriors XI by 6 wickets",
                "match": {
                    "team_a": "Falcons CC",
                    "team_b": "Warriors XI",
                    "score_a": "192/8",
                    "score_b": "186/9", 
                    "result": "Won by 6 wickets"
                },
                "timestamp": "Yesterday",
                "interactions": {
                    "likes": 45,
                    "comments": 12,
                    "shares": 3
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

@router.post("/posts")
async def create_post(
    post_data: CreatePostRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new social post"""
    # TODO: Implement post creation logic
    return {
        "status": "success",
        "data": {
            "id": 123,
            "content": post_data.content,
            "type": post_data.post_type,
            "user_id": current_user.id,
            "created_at": "2024-01-15T10:00:00Z"
        },
        "message": "Post created successfully"
    }

@router.get("/posts/{post_id}")
async def get_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get specific post details"""
    return {
        "status": "success",
        "data": {
            "id": post_id,
            "content": "Sample post content",
            "user": {
                "id": 1,
                "name": "Test User",
                "username": "@testuser"
            },
            "interactions": {
                "likes": 50,
                "comments": 10,
                "shares": 5
            }
        }
    }

@router.post("/posts/{post_id}/like")
async def like_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Like a post"""
    return {
        "status": "success",
        "message": "Post liked successfully"
    }

@router.delete("/posts/{post_id}/like")
async def unlike_post(
    post_id: int,
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """Unlike a post"""
    return {
        "status": "success",
        "message": "Post unliked successfully"
    }

@router.post("/posts/{post_id}/comments")
async def comment_on_post(
    post_id: int,
    comment_data: CommentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Comment on a post"""
    return {
        "status": "success",
        "data": {
            "id": 456,
            "content": comment_data.content,
            "user_id": current_user.id,
            "post_id": post_id,
            "created_at": "2024-01-15T10:00:00Z"
        },
        "message": "Comment added successfully"
    }

@router.get("/posts/{post_id}/comments")
async def get_post_comments(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get comments for a post"""
    return {
        "status": "success",
        "data": [
            {
                "id": 1,
                "content": "Great performance!",
                "user": {
                    "id": 2,
                    "name": "John Doe",
                    "username": "@johndoe"
                },
                "created_at": "2024-01-15T09:00:00Z"
            }
        ]
    }

@router.post("/users/{user_id}/follow")
async def follow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Follow another user"""
    return {
        "status": "success",
        "message": "User followed successfully"
    }

@router.delete("/users/{user_id}/follow")
async def unfollow_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Unfollow a user"""
    return {
        "status": "success", 
        "message": "User unfollowed successfully"
    }

@router.get("/users/{user_id}/followers")
async def get_user_followers(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get user's followers"""
    return {
        "status": "success",
        "data": [
            {
                "id": 1,
                "name": "John Doe", 
                "username": "@johndoe",
                "avatar": None
            }
        ],
        "count": 245
    }

@router.get("/users/{user_id}/following")
async def get_user_following(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get users that this user follows"""
    return {
        "status": "success",
        "data": [
            {
                "id": 2,
                "name": "Jane Smith",
                "username": "@janesmith", 
                "avatar": None
            }
        ],
        "count": 180
    }
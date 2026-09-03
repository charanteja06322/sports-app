"""
Tournaments API Routes - Neon PostgreSQL Integration
Endpoints for tournament management
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional
from pydantic import BaseModel, Field
from app.core.auth import get_user_id
from app.core.database import Database
from datetime import datetime, date
import uuid

router = APIRouter()


class TournamentCreateRequest(BaseModel):
    """Request schema for creating a tournament"""
    name: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = None
    tournament_type: str = Field(..., description="T20, ODI, Test")
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    prize_pool: Optional[float] = None


@router.get("")
async def list_tournaments(
    skip: int = Query(0, ge=0),
    limit: int = Query(40, ge=1, le=100),
    status_filter: Optional[str] = None
):
    """
    **List All Tournaments**
    
    Get paginated list of tournaments.
    """
    try:
        query = "SELECT * FROM public.tournaments WHERE 1=1"
        params = []
        
        if status_filter:
            query += f" AND status = ${len(params)+1}"
            params.append(status_filter)
        
        query += f" ORDER BY created_at DESC LIMIT ${len(params)+1} OFFSET ${len(params)+2}"
        params.extend([limit, skip])
        
        tournaments = await Database.fetch_all(query, *params)
        
        return {
            "success": True,
            "tournaments": tournaments,
            "count": len(tournaments),
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching tournaments: {str(e)}"
        )


@router.get("/upcoming")
async def list_upcoming_tournaments():
    """
    **Get Upcoming Tournaments**
    
    Get all tournaments with upcoming status.
    """
    try:
        query = "SELECT * FROM public.tournaments WHERE status = $1 ORDER BY start_date ASC"
        tournaments = await Database.fetch_all(query, 'upcoming')
        
        return {
            "success": True,
            "tournaments": tournaments,
            "count": len(tournaments)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching upcoming tournaments: {str(e)}"
        )


@router.get("/{tournament_id}")
async def get_tournament(tournament_id: str):
    """
    **Get Tournament Details**
    
    Get detailed information about a specific tournament.
    """
    try:
        query = "SELECT * FROM public.tournaments WHERE id = $1"
        tournament = await Database.fetch_one(query, tournament_id)
        
        if not tournament:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )
        
        # Get tournament matches
        matches_query = "SELECT * FROM public.matches WHERE tournament_id = $1"
        matches = await Database.fetch_all(matches_query, tournament_id)
        
        return {
            "success": True,
            "tournament": tournament,
            "matches": matches
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching tournament: {str(e)}"
        )


@router.post("")
async def create_tournament(
    tournament_data: TournamentCreateRequest,
    user_id: str = Depends(get_user_id)
):
    """
    **Create New Tournament**
    
    Creates a new cricket tournament.
    """
    try:
        tournament_id = str(uuid.uuid4())
        
        query = """
            INSERT INTO public.tournaments 
            (id, name, description, tournament_type, start_date, end_date, prize_pool, created_by, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
            RETURNING *
        """
        
        tournament = await Database.fetch_one(
            query,
            tournament_id,
            tournament_data.name,
            tournament_data.description,
            tournament_data.tournament_type,
            tournament_data.start_date,
            tournament_data.end_date,
            tournament_data.prize_pool,
            user_id
        )
        
        return {
            "success": True,
            "tournament": tournament,
            "message": "Tournament created successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating tournament: {str(e)}"
        )

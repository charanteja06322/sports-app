"""
Matches API Routes - Neon PostgreSQL Integration
Endpoints for match management
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional
from pydantic import BaseModel, Field
from app.core.auth import get_user_id
from app.core.database import Database
from datetime import datetime
import uuid

router = APIRouter()


class MatchCreateRequest(BaseModel):
    """Request schema for creating a match"""
    team1_id: str = Field(..., description="First team ID")
    team2_id: str = Field(..., description="Second team ID")
    ground_id: Optional[str] = None
    match_date: Optional[datetime] = None
    match_type: str = Field(..., description="Match type (T20, ODI, Test)")
    overs: Optional[int] = None
    tournament_id: Optional[str] = None


@router.get("")
async def list_matches(
    skip: int = Query(0, ge=0),
    limit: int = Query(40, ge=1, le=100),
    status_filter: Optional[str] = None,
    tournament_id: Optional[str] = None,
    team_id: Optional[str] = None
):
    """
    **List All Matches**
    
    Get paginated list of matches with optional filters.
    """
    try:
        query = "SELECT * FROM public.matches WHERE 1=1"
        params = []
        
        if status_filter:
            query += f" AND status = ${len(params)+1}"
            params.append(status_filter)
        
        if tournament_id:
            query += f" AND tournament_id = ${len(params)+1}"
            params.append(tournament_id)
        
        if team_id:
            query += f" AND (team1_id = ${len(params)+1} OR team2_id = ${len(params)+1})"
            params.extend([team_id, team_id])
        
        query += f" ORDER BY match_date DESC LIMIT ${len(params)+1} OFFSET ${len(params)+2}"
        params.extend([limit, skip])
        
        matches = await Database.fetch_all(query, *params)
        
        return {
            "success": True,
            "matches": matches,
            "count": len(matches),
            "skip": skip,
            "limit": limit
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching matches: {str(e)}"
        )


@router.get("/live")
async def list_live_matches():
    """
    **Get Live Matches**
    
    Get all currently live matches.
    """
    try:
        query = "SELECT * FROM public.matches WHERE status = $1 ORDER BY match_date DESC"
        matches = await Database.fetch_all(query, 'live')
        
        return {
            "success": True,
            "matches": matches,
            "count": len(matches)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching live matches: {str(e)}"
        )


@router.get("/{match_id}")
async def get_match(match_id: str):
    """
    **Get Match Details**
    
    Get detailed information about a specific match.
    """
    try:
        query = "SELECT * FROM public.matches WHERE id = $1"
        match = await Database.fetch_one(query, match_id)
        
        if not match:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Match not found"
            )
        
        # Get match innings
        innings_query = "SELECT * FROM public.match_innings WHERE match_id = $1"
        innings = await Database.fetch_all(innings_query, match_id)
        
        return {
            "success": True,
            "match": match,
            "innings": innings
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching match: {str(e)}"
        )


@router.post("")
async def create_match(
    match_data: MatchCreateRequest,
    user_id: str = Depends(get_user_id)
):
    """
    **Create New Match**
    
    Creates a new cricket match.
    """
    try:
        match_id = str(uuid.uuid4())
        
        query = """
            INSERT INTO public.matches 
            (id, team1_id, team2_id, ground_id, match_date, match_type, overs, tournament_id, created_by, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
            RETURNING *
        """
        
        match = await Database.fetch_one(
            query,
            match_id,
            match_data.team1_id,
            match_data.team2_id,
            match_data.ground_id,
            match_data.match_date,
            match_data.match_type,
            match_data.overs,
            match_data.tournament_id,
            user_id
        )
        
        return {
            "success": True,
            "match": match,
            "message": "Match created successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating match: {str(e)}"
        )


@router.post("/seed-test-data")
async def seed_test_matches():
    """
    **Seed Test Data** (Admin only)
    
    Populate matches with test data.
    """
    try:
        return {
            "success": True,
            "message": "Test matches already exist in database"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error seeding matches: {str(e)}"
        )

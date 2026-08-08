"""
Matches API Routes - Supabase Integration
Endpoints for match management and viewing
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from app.core.auth import get_current_user, get_user_id, get_optional_user
from app.core.supabase_client import get_supabase
from datetime import datetime, date

router = APIRouter()


# ============================================================================
# REQUEST/RESPONSE SCHEMAS
# ============================================================================

class MatchCreateRequest(BaseModel):
    """Request schema for creating a match"""
    tournament_id: Optional[str] = Field(None, description="Tournament ID (if part of tournament)")
    team1_id: str = Field(..., description="First team ID")
    team2_id: str = Field(..., description="Second team ID")
    match_date: datetime = Field(..., description="Match date and time")
    venue: str = Field(..., max_length=255, description="Match venue")
    match_type: str = Field(..., description="Match type (T20, ODI, Test)")
    status: Optional[str] = Field("scheduled", description="Match status")


# ============================================================================
# MATCHES ENDPOINTS
# ============================================================================

@router.get("")
async def list_matches(
    skip: int = Query(0, ge=0, description="Pagination offset"),
    limit: int = Query(20, ge=1, le=100, description="Results per page"),
    status_filter: Optional[str] = Query(None, description="Filter by status (scheduled/live/completed)"),
    tournament_id: Optional[str] = Query(None, description="Filter by tournament"),
    team_id: Optional[str] = Query(None, description="Filter by team"),
    user: Optional[Dict] = Depends(get_optional_user)
):
    """
    **List Matches**
    
    Get paginated list of matches with optional filters.
    
    Query parameters:
    - **skip**: Pagination offset
    - **limit**: Results per page (max 100)
    - **status_filter**: Filter by status (scheduled/live/completed/cancelled)
    - **tournament_id**: Show only matches from specific tournament
    - **team_id**: Show only matches involving specific team
    
    Returns: List of matches
    """
    supabase = get_supabase()
    
    try:
        # Build query
        query = supabase.table('matches').select('*')
        
        # Apply filters
        if status_filter:
            query = query.eq('status', status_filter)
        
        if tournament_id:
            query = query.eq('tournament_id', tournament_id)
        
        if team_id:
            # Match where team is either team1 or team2
            query = query.or_(f'team1_id.eq.{team_id},team2_id.eq.{team_id}')
        
        # Apply pagination
        query = query.range(skip, skip + limit - 1)
        query = query.order('match_date', desc=True)
        
        response = query.execute()
        
        return {
            "success": True,
            "matches": response.data,
            "count": len(response.data),
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
    supabase = get_supabase()
    
    try:
        response = supabase.table('matches')\
            .select('*')\
            .eq('status', 'live')\
            .order('match_date', desc=True)\
            .execute()
        
        return {
            "success": True,
            "matches": response.data,
            "count": len(response.data)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching live matches: {str(e)}"
        )


@router.get("/upcoming")
async def list_upcoming_matches(
    limit: int = Query(10, ge=1, le=50, description="Number of matches to return")
):
    """
    **Get Upcoming Matches**
    
    Get next scheduled matches.
    """
    supabase = get_supabase()
    
    try:
        response = supabase.table('matches')\
            .select('*')\
            .eq('status', 'scheduled')\
            .gte('match_date', datetime.now().isoformat())\
            .order('match_date')\
            .limit(limit)\
            .execute()
        
        return {
            "success": True,
            "matches": response.data,
            "count": len(response.data)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching upcoming matches: {str(e)}"
        )


@router.get("/completed")
async def list_completed_matches(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100)
):
    """
    **Get Completed Matches**
    
    Get recently completed matches.
    """
    supabase = get_supabase()
    
    try:
        response = supabase.table('matches')\
            .select('*')\
            .eq('status', 'completed')\
            .order('match_date', desc=True)\
            .range(skip, skip + limit - 1)\
            .execute()
        
        return {
            "success": True,
            "matches": response.data,
            "count": len(response.data),
            "skip": skip,
            "limit": limit
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching completed matches: {str(e)}"
        )


@router.get("/{match_id}")
async def get_match(match_id: str):
    """
    **Get Match Details**
    
    Get detailed information about a specific match.
    
    Returns:
    - Match information
    - Team details
    - Score (if available)
    - Status
    """
    supabase = get_supabase()
    
    try:
        # Get match
        match_response = supabase.table('matches')\
            .select('*')\
            .eq('id', match_id)\
            .single()\
            .execute()
        
        if not match_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Match not found"
            )
        
        match = match_response.data
        
        # Get team details
        if match.get('team1_id'):
            team1 = supabase.table('teams')\
                .select('id, name, short_name')\
                .eq('id', match['team1_id'])\
                .single()\
                .execute()
            match['team1'] = team1.data if team1.data else None
        
        if match.get('team2_id'):
            team2 = supabase.table('teams')\
                .select('id, name, short_name')\
                .eq('id', match['team2_id'])\
                .single()\
                .execute()
            match['team2'] = team2.data if team2.data else None
        
        return {
            "success": True,
            "match": match
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching match: {str(e)}"
        )


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_match(
    match_data: MatchCreateRequest,
    user_id: str = Depends(get_user_id)
):
    """
    **Create Match**
    
    Create a new match. User must be owner of at least one participating team.
    """
    supabase = get_supabase()
    
    try:
        # Validate teams exist
        team1 = supabase.table('teams').select('created_by').eq('id', match_data.team1_id).single().execute()
        team2 = supabase.table('teams').select('created_by').eq('id', match_data.team2_id).single().execute()
        
        if not team1.data or not team2.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="One or both teams not found"
            )
        
        # Check if user is owner of at least one team
        is_team1_owner = team1.data['created_by'] == user_id
        is_team2_owner = team2.data['created_by'] == user_id
        
        if not (is_team1_owner or is_team2_owner):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Must be owner of at least one participating team"
            )
        
        # Create match
        match_insert = {
            "tournament_id": match_data.tournament_id,
            "team1_id": match_data.team1_id,
            "team2_id": match_data.team2_id,
            "match_date": match_data.match_date.isoformat(),
            "venue": match_data.venue,
            "match_type": match_data.match_type,
            "status": match_data.status,
            "created_by": user_id
        }
        
        response = supabase.table('matches').insert(match_insert).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create match"
            )
        
        return {
            "success": True,
            "message": "Match created successfully",
            "match": response.data[0]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating match: {str(e)}"
        )


@router.get("/team/{team_id}")
async def get_team_matches(
    team_id: str,
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    limit: int = Query(20, ge=1, le=100)
):
    """
    **Get Team Matches**
    
    Get all matches for a specific team.
    """
    supabase = get_supabase()
    
    try:
        # Build query for matches where team is team1 or team2
        query = supabase.table('matches').select('*')
        
        # Filter by team (team1 or team2)
        query = query.or_(f'team1_id.eq.{team_id},team2_id.eq.{team_id}')
        
        if status_filter:
            query = query.eq('status', status_filter)
        
        query = query.order('match_date', desc=True).limit(limit)
        
        response = query.execute()
        
        return {
            "success": True,
            "matches": response.data,
            "count": len(response.data)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching team matches: {str(e)}"
        )


@router.get("/tournament/{tournament_id}")
async def get_tournament_matches(
    tournament_id: str,
    status_filter: Optional[str] = Query(None, description="Filter by status")
):
    """
    **Get Tournament Matches**
    
    Get all matches in a specific tournament.
    """
    supabase = get_supabase()
    
    try:
        query = supabase.table('matches')\
            .select('*')\
            .eq('tournament_id', tournament_id)
        
        if status_filter:
            query = query.eq('status', status_filter)
        
        query = query.order('match_date')
        
        response = query.execute()
        
        return {
            "success": True,
            "matches": response.data,
            "count": len(response.data)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching tournament matches: {str(e)}"
        )

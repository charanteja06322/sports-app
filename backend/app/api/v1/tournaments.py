"""
Tournaments API Routes - Supabase Integration
Endpoints for tournament management using Supabase backend
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from app.core.auth import get_current_user, get_user_id
from app.core.supabase_client import get_supabase
from datetime import datetime, date

router = APIRouter()


# ============================================================================
# REQUEST/RESPONSE SCHEMAS
# ============================================================================

class TournamentCreateRequest(BaseModel):
    """Request schema for creating a tournament"""
    name: str = Field(..., min_length=3, max_length=255, description="Tournament name")
    tournament_type: str = Field(..., description="Tournament type (league, knockout, round_robin)")
    start_date: date = Field(..., description="Tournament start date")
    end_date: date = Field(..., description="Tournament end date")
    prize_pool: Optional[float] = Field(None, ge=0, description="Prize pool amount")
    max_teams: Optional[int] = Field(None, ge=2, le=100, description="Maximum teams")
    description: Optional[str] = Field(None, max_length=1000, description="Tournament description")
    location: Optional[str] = Field(None, max_length=255, description="Tournament location")


class TournamentUpdateRequest(BaseModel):
    """Request schema for updating a tournament"""
    name: Optional[str] = Field(None, min_length=3, max_length=255)
    tournament_type: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    prize_pool: Optional[float] = Field(None, ge=0)
    max_teams: Optional[int] = Field(None, ge=2, le=100)
    description: Optional[str] = Field(None, max_length=1000)
    location: Optional[str] = Field(None, max_length=255)
    status: Optional[str] = Field(None, description="upcoming, ongoing, completed, cancelled")


# ============================================================================
# TOURNAMENTS CRUD ENDPOINTS
# ============================================================================

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_tournament(
    tournament_data: TournamentCreateRequest,
    user_id: str = Depends(get_user_id)
):
    """
    **Create New Tournament**
    
    Creates a new cricket tournament with the current user as organizer.
    
    - **name**: Tournament name
    - **tournament_type**: Type (league, knockout, round_robin)
    - **start_date**: Tournament start date
    - **end_date**: Tournament end date
    - **prize_pool**: Prize money (optional)
    - **max_teams**: Maximum participating teams
    - **description**: Tournament details
    - **location**: Tournament venue/city
    
    Returns: Created tournament with ID
    """
    supabase = get_supabase()
    
    try:
        # Validate dates
        if tournament_data.end_date < tournament_data.start_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="End date must be after start date"
            )
        
        # Determine status based on dates
        today = date.today()
        if tournament_data.start_date > today:
            tournament_status = "upcoming"
        elif tournament_data.start_date <= today <= tournament_data.end_date:
            tournament_status = "ongoing"
        else:
            tournament_status = "completed"
        
        # Create tournament
        tournament_insert = {
            "name": tournament_data.name,
            "tournament_type": tournament_data.tournament_type,
            "start_date": tournament_data.start_date.isoformat(),
            "end_date": tournament_data.end_date.isoformat(),
            "prize_pool": tournament_data.prize_pool,
            "max_teams": tournament_data.max_teams,
            "description": tournament_data.description,
            "location": tournament_data.location,
            "status": tournament_status,
            "created_by": user_id
        }
        
        response = supabase.table('tournaments').insert(tournament_insert).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create tournament"
            )
        
        return {
            "success": True,
            "message": "Tournament created successfully",
            "tournament": response.data[0]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating tournament: {str(e)}"
        )


@router.get("")
async def list_tournaments(
    skip: int = Query(0, ge=0, description="Pagination offset"),
    limit: int = Query(20, ge=1, le=100, description="Results per page"),
    status_filter: Optional[str] = Query(None, description="Filter by status"),
    tournament_type: Optional[str] = Query(None, description="Filter by type"),
    search: Optional[str] = Query(None, description="Search tournament names")
):
    """
    **List All Tournaments**
    
    Get paginated list of tournaments with optional filters.
    
    Query parameters:
    - **skip**: Number of records to skip (pagination)
    - **limit**: Number of records to return (max 100)
    - **status_filter**: Filter by status (upcoming/ongoing/completed/cancelled)
    - **tournament_type**: Filter by type (league/knockout/round_robin)
    - **search**: Search term for tournament names
    
    Returns: List of tournaments with metadata
    """
    supabase = get_supabase()
    
    try:
        # Build query
        query = supabase.table('tournaments').select('*')
        
        # Apply filters
        if status_filter:
            query = query.eq('status', status_filter)
        
        if tournament_type:
            query = query.eq('tournament_type', tournament_type)
        
        if search:
            query = query.ilike('name', f'%{search}%')
        
        # Apply pagination and ordering
        query = query.range(skip, skip + limit - 1)
        query = query.order('start_date', desc=True)
        
        response = query.execute()
        
        return {
            "success": True,
            "tournaments": response.data,
            "count": len(response.data),
            "skip": skip,
            "limit": limit
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching tournaments: {str(e)}"
        )


@router.get("/{tournament_id}")
async def get_tournament(tournament_id: str):
    """
    **Get Tournament Details**
    
    Get detailed information about a specific tournament.
    
    Returns:
    - Tournament information
    - Participating teams count
    - Organizer info
    """
    supabase = get_supabase()
    
    try:
        # Get tournament
        tournament_response = supabase.table('tournaments')\
            .select('*')\
            .eq('id', tournament_id)\
            .single()\
            .execute()
        
        if not tournament_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )
        
        # Get participating teams count
        teams_response = supabase.table('tournament_teams')\
            .select('id')\
            .eq('tournament_id', tournament_id)\
            .execute()
        
        tournament = tournament_response.data
        tournament['teams_count'] = len(teams_response.data)
        
        return {
            "success": True,
            "tournament": tournament
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching tournament: {str(e)}"
        )


@router.put("/{tournament_id}")
async def update_tournament(
    tournament_id: str,
    tournament_data: TournamentUpdateRequest,
    user_id: str = Depends(get_user_id)
):
    """
    **Update Tournament**
    
    Update tournament information. Only tournament organizer can update.
    
    Updatable fields:
    - name
    - tournament_type
    - start_date
    - end_date
    - prize_pool
    - max_teams
    - description
    - location
    - status
    """
    supabase = get_supabase()
    
    try:
        # Check if tournament exists and user is organizer
        tournament_response = supabase.table('tournaments')\
            .select('*')\
            .eq('id', tournament_id)\
            .single()\
            .execute()
        
        if not tournament_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )
        
        tournament = tournament_response.data
        
        # Verify user is organizer
        if tournament['created_by'] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only tournament organizer can update"
            )
        
        # Prepare update data
        update_data = tournament_data.model_dump(exclude_unset=True)
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields to update"
            )
        
        # Convert dates to ISO format if present
        if 'start_date' in update_data:
            update_data['start_date'] = update_data['start_date'].isoformat()
        if 'end_date' in update_data:
            update_data['end_date'] = update_data['end_date'].isoformat()
        
        # Update tournament
        update_response = supabase.table('tournaments')\
            .update(update_data)\
            .eq('id', tournament_id)\
            .execute()
        
        return {
            "success": True,
            "message": "Tournament updated successfully",
            "tournament": update_response.data[0]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating tournament: {str(e)}"
        )


@router.delete("/{tournament_id}")
async def delete_tournament(
    tournament_id: str,
    user_id: str = Depends(get_user_id)
):
    """
    **Delete Tournament**
    
    Delete a tournament. Only tournament organizer can delete.
    
    This will also remove all participating teams and matches.
    """
    supabase = get_supabase()
    
    try:
        # Check if tournament exists and user is organizer
        tournament_response = supabase.table('tournaments')\
            .select('*')\
            .eq('id', tournament_id)\
            .single()\
            .execute()
        
        if not tournament_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )
        
        tournament = tournament_response.data
        
        # Verify user is organizer
        if tournament['created_by'] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only tournament organizer can delete"
            )
        
        # Delete tournament (CASCADE will handle related records)
        supabase.table('tournaments').delete().eq('id', tournament_id).execute()
        
        return {
            "success": True,
            "message": "Tournament deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting tournament: {str(e)}"
        )


# ============================================================================
# TOURNAMENT TEAMS ENDPOINTS
# ============================================================================

@router.post("/{tournament_id}/teams/{team_id}")
async def add_team_to_tournament(
    tournament_id: str,
    team_id: str,
    user_id: str = Depends(get_user_id)
):
    """
    **Add Team to Tournament**
    
    Register a team for a tournament. User must be team owner.
    """
    supabase = get_supabase()
    
    try:
        # Check if tournament exists
        tournament = supabase.table('tournaments')\
            .select('*')\
            .eq('id', tournament_id)\
            .single()\
            .execute()
        
        if not tournament.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )
        
        # Check if team exists and user is owner
        team = supabase.table('teams')\
            .select('*')\
            .eq('id', team_id)\
            .single()\
            .execute()
        
        if not team.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        if team.data['created_by'] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only team owner can register team"
            )
        
        # Check if already registered
        existing = supabase.table('tournament_teams')\
            .select('id')\
            .eq('tournament_id', tournament_id)\
            .eq('team_id', team_id)\
            .execute()
        
        if existing.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Team already registered for this tournament"
            )
        
        # Check max teams limit
        if tournament.data.get('max_teams'):
            teams_count = len(supabase.table('tournament_teams')\
                .select('id')\
                .eq('tournament_id', tournament_id)\
                .execute().data)
            
            if teams_count >= tournament.data['max_teams']:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Tournament is full"
                )
        
        # Register team
        registration = {
            "tournament_id": tournament_id,
            "team_id": team_id
        }
        
        supabase.table('tournament_teams').insert(registration).execute()
        
        return {
            "success": True,
            "message": "Team registered successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error registering team: {str(e)}"
        )


@router.delete("/{tournament_id}/teams/{team_id}")
async def remove_team_from_tournament(
    tournament_id: str,
    team_id: str,
    user_id: str = Depends(get_user_id)
):
    """
    **Remove Team from Tournament**
    
    Unregister a team from tournament. User must be team owner or tournament organizer.
    """
    supabase = get_supabase()
    
    try:
        # Get tournament and team
        tournament = supabase.table('tournaments')\
            .select('created_by')\
            .eq('id', tournament_id)\
            .single()\
            .execute()
        
        team = supabase.table('teams')\
            .select('created_by')\
            .eq('id', team_id)\
            .single()\
            .execute()
        
        if not tournament.data or not team.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament or team not found"
            )
        
        # Check permissions (team owner or tournament organizer)
        is_team_owner = team.data['created_by'] == user_id
        is_tournament_organizer = tournament.data['created_by'] == user_id
        
        if not (is_team_owner or is_tournament_organizer):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only team owner or tournament organizer can remove team"
            )
        
        # Remove team
        supabase.table('tournament_teams')\
            .delete()\
            .eq('tournament_id', tournament_id)\
            .eq('team_id', team_id)\
            .execute()
        
        return {
            "success": True,
            "message": "Team removed from tournament"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error removing team: {str(e)}"
        )


@router.get("/{tournament_id}/teams")
async def get_tournament_teams(tournament_id: str):
    """
    **Get Tournament Teams**
    
    Get list of all teams participating in a tournament.
    """
    supabase = get_supabase()
    
    try:
        # Get team IDs
        registrations = supabase.table('tournament_teams')\
            .select('team_id, created_at')\
            .eq('tournament_id', tournament_id)\
            .execute()
        
        if not registrations.data:
            return {
                "success": True,
                "teams": [],
                "count": 0
            }
        
        # Get team details
        team_ids = [r['team_id'] for r in registrations.data]
        teams = supabase.table('teams')\
            .select('*')\
            .in_('id', team_ids)\
            .execute()
        
        return {
            "success": True,
            "teams": teams.data,
            "count": len(teams.data)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching tournament teams: {str(e)}"
        )


@router.get("/user/my-tournaments")
async def get_my_tournaments(user_id: str = Depends(get_user_id)):
    """
    **Get My Tournaments**
    
    Get all tournaments created by the current user.
    """
    supabase = get_supabase()
    
    try:
        tournaments = supabase.table('tournaments')\
            .select('*')\
            .eq('created_by', user_id)\
            .order('start_date', desc=True)\
            .execute()
        
        return {
            "success": True,
            "tournaments": tournaments.data,
            "count": len(tournaments.data)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching user tournaments: {str(e)}"
        )

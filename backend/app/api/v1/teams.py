"""
Teams API Routes - Supabase Integration
Endpoints for team management using Supabase backend
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from app.core.auth import get_current_user, get_user_id
from app.core.supabase_client import get_supabase
from datetime import datetime

router = APIRouter()


# ============================================================================
# REQUEST/RESPONSE SCHEMAS
# ============================================================================

class TeamCreateRequest(BaseModel):
    """Request schema for creating a team"""
    name: str = Field(..., min_length=3, max_length=255, description="Team name")
    short_name: str = Field(..., min_length=2, max_length=10, description="Team abbreviation")
    home_ground: Optional[str] = Field(None, max_length=255, description="Home ground/stadium")
    founded_year: Optional[int] = Field(None, ge=1800, le=2100, description="Year founded")
    description: Optional[str] = Field(None, max_length=1000, description="Team description")


class TeamUpdateRequest(BaseModel):
    """Request schema for updating a team"""
    name: Optional[str] = Field(None, min_length=3, max_length=255)
    short_name: Optional[str] = Field(None, min_length=2, max_length=10)
    home_ground: Optional[str] = Field(None, max_length=255)
    founded_year: Optional[int] = Field(None, ge=1800, le=2100)
    description: Optional[str] = Field(None, max_length=1000)


# ============================================================================
# TEAMS CRUD ENDPOINTS
# ============================================================================

@router.post("", status_code=status.HTTP_201_CREATED)
async def create_team(
    team_data: TeamCreateRequest,
    user_id: str = Depends(get_user_id)
):
    """
    **Create New Team**
    
    Creates a new cricket team with the current user as owner.
    
    - **name**: Full team name
    - **short_name**: Team abbreviation (e.g., "MI" for Mumbai Indians)
    - **home_ground**: Home stadium/ground
    - **founded_year**: Year the team was established
    - **description**: Team description/bio
    
    Returns: Created team with ID
    """
    supabase = get_supabase()
    
    try:
        # Create team
        team_insert = {
            "name": team_data.name,
            "short_name": team_data.short_name,
            "home_ground": team_data.home_ground,
            "founded_year": team_data.founded_year,
            "description": team_data.description,
            "created_by": user_id
        }
        
        response = supabase.table('teams').insert(team_insert).execute()
        
        if not response.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create team"
            )
        
        team = response.data[0]
        
        # Auto-join creator as first member
        member_insert = {
            "team_id": team["id"],
            "user_id": user_id,
            "role": "owner"
        }
        
        supabase.table('team_members').insert(member_insert).execute()
        
        return {
            "success": True,
            "message": "Team created successfully",
            "team": team
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating team: {str(e)}"
        )


@router.get("")
async def list_teams(
    skip: int = Query(0, ge=0, description="Pagination offset"),
    limit: int = Query(20, ge=1, le=100, description="Results per page"),
    search: Optional[str] = Query(None, description="Search team names")
):
    """
    **List All Teams**
    
    Get paginated list of teams with optional search.
    
    Query parameters:
    - **skip**: Number of records to skip (pagination)
    - **limit**: Number of records to return (max 100)
    - **search**: Search term for team names
    
    Returns: List of teams with metadata
    """
    supabase = get_supabase()
    
    try:
        # Build query
        query = supabase.table('teams').select('*')
        
        # Apply search filter
        if search:
            query = query.ilike('name', f'%{search}%')
        
        # Apply pagination
        query = query.range(skip, skip + limit - 1)
        query = query.order('created_at', desc=True)
        
        response = query.execute()
        
        return {
            "success": True,
            "teams": response.data,
            "count": len(response.data),
            "skip": skip,
            "limit": limit
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching teams: {str(e)}"
        )


@router.get("/{team_id}")
async def get_team(team_id: str):
    """
    **Get Team Details**
    
    Get detailed information about a specific team.
    
    Returns:
    - Team information
    - Member count
    - Created by info
    """
    supabase = get_supabase()
    
    try:
        # Get team
        team_response = supabase.table('teams').select('*').eq('id', team_id).single().execute()
        
        if not team_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        # Get member count
        members_response = supabase.table('team_members').select('id').eq('team_id', team_id).execute()
        member_count = len(members_response.data)
        
        team = team_response.data
        team['member_count'] = member_count
        
        return {
            "success": True,
            "team": team
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching team: {str(e)}"
        )


@router.put("/{team_id}")
async def update_team(
    team_id: str,
    team_data: TeamUpdateRequest,
    user_id: str = Depends(get_user_id)
):
    """
    **Update Team**
    
    Update team information. Only team owner/creator can update.
    
    Updatable fields:
    - name
    - short_name
    - home_ground
    - founded_year
    - description
    """
    supabase = get_supabase()
    
    try:
        # Check if team exists and user is owner
        team_response = supabase.table('teams').select('*').eq('id', team_id).single().execute()
        
        if not team_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        team = team_response.data
        
        # Verify user is owner
        if team['created_by'] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only team owner can update team"
            )
        
        # Prepare update data (only include provided fields)
        update_data = team_data.model_dump(exclude_unset=True)
        
        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No fields to update"
            )
        
        # Update team
        update_response = supabase.table('teams').update(update_data).eq('id', team_id).execute()
        
        return {
            "success": True,
            "message": "Team updated successfully",
            "team": update_response.data[0]
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error updating team: {str(e)}"
        )


@router.delete("/{team_id}")
async def delete_team(
    team_id: str,
    user_id: str = Depends(get_user_id)
):
    """
    **Delete Team**
    
    Delete a team. Only team owner/creator can delete.
    
    This will also remove all team members.
    """
    supabase = get_supabase()
    
    try:
        # Check if team exists and user is owner
        team_response = supabase.table('teams').select('*').eq('id', team_id).single().execute()
        
        if not team_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        team = team_response.data
        
        # Verify user is owner
        if team['created_by'] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only team owner can delete team"
            )
        
        # Delete team (CASCADE will delete team_members)
        supabase.table('teams').delete().eq('id', team_id).execute()
        
        return {
            "success": True,
            "message": "Team deleted successfully"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error deleting team: {str(e)}"
        )


# ============================================================================
# TEAM MEMBERSHIP ENDPOINTS
# ============================================================================

@router.post("/{team_id}/join")
async def join_team(
    team_id: str,
    user_id: str = Depends(get_user_id)
):
    """
    **Join Team**
    
    Join a team as a member.
    
    - Cannot join if already a member
    - Automatically assigned 'member' role
    """
    supabase = get_supabase()
    
    try:
        # Check if team exists
        team_response = supabase.table('teams').select('id').eq('id', team_id).single().execute()
        
        if not team_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        # Check if already a member
        existing = supabase.table('team_members')\
            .select('id')\
            .eq('team_id', team_id)\
            .eq('user_id', user_id)\
            .execute()
        
        if existing.data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Already a member of this team"
            )
        
        # Join team
        member_insert = {
            "team_id": team_id,
            "user_id": user_id,
            "role": "member"
        }
        
        supabase.table('team_members').insert(member_insert).execute()
        
        return {
            "success": True,
            "message": "Successfully joined team"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error joining team: {str(e)}"
        )


@router.delete("/{team_id}/leave")
async def leave_team(
    team_id: str,
    user_id: str = Depends(get_user_id)
):
    """
    **Leave Team**
    
    Leave a team. Team owner cannot leave (must delete team).
    """
    supabase = get_supabase()
    
    try:
        # Check if member exists
        member_response = supabase.table('team_members')\
            .select('*')\
            .eq('team_id', team_id)\
            .eq('user_id', user_id)\
            .execute()
        
        if not member_response.data:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Not a member of this team"
            )
        
        member = member_response.data[0]
        
        # Check if owner
        if member['role'] == 'owner':
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Team owner cannot leave. Delete the team instead."
            )
        
        # Leave team
        supabase.table('team_members')\
            .delete()\
            .eq('team_id', team_id)\
            .eq('user_id', user_id)\
            .execute()
        
        return {
            "success": True,
            "message": "Successfully left team"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error leaving team: {str(e)}"
        )


@router.get("/{team_id}/members")
async def get_team_members(team_id: str):
    """
    **Get Team Members**
    
    Get list of all team members with their roles.
    
    Returns:
    - User ID
    - Role (owner/member)
    - Join date
    """
    supabase = get_supabase()
    
    try:
        # Get members
        members_response = supabase.table('team_members')\
            .select('*')\
            .eq('team_id', team_id)\
            .order('created_at')\
            .execute()
        
        return {
            "success": True,
            "members": members_response.data,
            "count": len(members_response.data)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching members: {str(e)}"
        )


@router.get("/user/my-teams")
async def get_my_teams(user_id: str = Depends(get_user_id)):
    """
    **Get My Teams**
    
    Get all teams the current user is a member of.
    """
    supabase = get_supabase()
    
    try:
        # Get user's team memberships
        memberships = supabase.table('team_members')\
            .select('team_id, role')\
            .eq('user_id', user_id)\
            .execute()
        
        if not memberships.data:
            return {
                "success": True,
                "teams": [],
                "count": 0
            }
        
        # Get team details
        team_ids = [m['team_id'] for m in memberships.data]
        teams_response = supabase.table('teams')\
            .select('*')\
            .in_('id', team_ids)\
            .execute()
        
        # Add role to each team
        teams = teams_response.data
        role_map = {m['team_id']: m['role'] for m in memberships.data}
        
        for team in teams:
            team['user_role'] = role_map.get(team['id'])
        
        return {
            "success": True,
            "teams": teams,
            "count": len(teams)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching user teams: {str(e)}"
        )

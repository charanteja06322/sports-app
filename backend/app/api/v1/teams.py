"""
Teams API Routes - Neon PostgreSQL Integration
Endpoints for team management using Neon backend
"""
from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Dict, List, Optional
from pydantic import BaseModel, Field
from app.core.auth import get_user_id
from app.core.database import Database
from datetime import datetime
import uuid

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
    """
    try:
        team_id = str(uuid.uuid4())
        
        # Insert team
        query = """
            INSERT INTO public.teams (id, name, short_name, home_ground, founded_year, description, created_by, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
            RETURNING *
        """
        team = await Database.fetch_one(
            query,
            team_id,
            team_data.name,
            team_data.short_name,
            team_data.home_ground,
            team_data.founded_year,
            team_data.description,
            user_id
        )
        
        # Add creator as team member
        member_query = """
            INSERT INTO public.team_members (id, team_id, user_id, role, joined_at)
            VALUES ($1, $2, $3, $4, NOW())
        """
        await Database.execute(
            member_query,
            str(uuid.uuid4()),
            team_id,
            user_id,
            'captain'
        )
        
        return {
            "success": True,
            "team": team,
            "message": "Team created successfully"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating team: {str(e)}"
        )


@router.get("")
async def list_teams(
    skip: int = Query(0, ge=0, description="Pagination offset"),
    limit: int = Query(40, ge=1, le=100, description="Results per page"),
    search: Optional[str] = Query(None, description="Search team names")
):
    """
    **List All Teams**
    
    Get paginated list of teams with optional search (PUBLIC - no auth required).
    """
    try:
        # Build query
        query = "SELECT * FROM public.teams"
        params = []
        
        # Apply search filter
        if search:
            query += " WHERE name ILIKE $1"
            params.append(f'%{search}%')
        
        # Order and paginate
        offset_num = len(params) + 1
        limit_num = len(params) + 2
        query += f" ORDER BY created_at DESC LIMIT ${limit_num} OFFSET ${offset_num}"
        params.extend([limit, skip])
        
        # Execute query
        teams = await Database.fetch_all(query, *params)
        
        return {
            "success": True,
            "teams": teams,
            "count": len(teams),
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
    """
    try:
        query = "SELECT * FROM public.teams WHERE id = $1"
        team = await Database.fetch_one(query, team_id)
        
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        # Get team members
        members_query = """
            SELECT tm.*, u.full_name, u.email 
            FROM public.team_members tm
            LEFT JOIN public.users u ON tm.user_id = u.id
            WHERE tm.team_id = $1
        """
        members = await Database.fetch_all(members_query, team_id)
        
        return {
            "success": True,
            "team": team,
            "members": members
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
    
    Update team information. Only the owner can update.
    """
    try:
        # Check if team exists and user is owner
        team_query = "SELECT * FROM public.teams WHERE id = $1"
        team = await Database.fetch_one(team_query, team_id)
        
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        if team['created_by'] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the team owner can update the team"
            )
        
        # Prepare update data
        updates = {}
        if team_data.name:
            updates['name'] = team_data.name
        if team_data.short_name:
            updates['short_name'] = team_data.short_name
        if team_data.home_ground is not None:
            updates['home_ground'] = team_data.home_ground
        if team_data.founded_year is not None:
            updates['founded_year'] = team_data.founded_year
        if team_data.description is not None:
            updates['description'] = team_data.description
        
        if not updates:
            return {"success": True, "team": team}
        
        # Build update query
        set_clauses = [f"{k} = ${i+1}" for i, k in enumerate(updates.keys())]
        update_query = f"UPDATE public.teams SET {', '.join(set_clauses)}, updated_at = NOW() WHERE id = ${len(updates)+1} RETURNING *"
        
        updated_team = await Database.fetch_one(
            update_query,
            *list(updates.values()),
            team_id
        )
        
        return {
            "success": True,
            "team": updated_team,
            "message": "Team updated successfully"
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
    
    Delete a team. Only the owner can delete.
    """
    try:
        # Check if team exists and user is owner
        team_query = "SELECT * FROM public.teams WHERE id = $1"
        team = await Database.fetch_one(team_query, team_id)
        
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        if team['created_by'] != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the team owner can delete the team"
            )
        
        # Delete team (cascade deletes members)
        delete_query = "DELETE FROM public.teams WHERE id = $1"
        await Database.execute(delete_query, team_id)
        
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


@router.post("/{team_id}/join")
async def join_team(
    team_id: str,
    user_id: str = Depends(get_user_id)
):
    """
    **Join Team**
    
    Join an existing team.
    """
    try:
        # Check if team exists
        team_query = "SELECT * FROM public.teams WHERE id = $1"
        team = await Database.fetch_one(team_query, team_id)
        
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        # Check if already a member
        check_query = "SELECT * FROM public.team_members WHERE team_id = $1 AND user_id = $2"
        existing = await Database.fetch_one(check_query, team_id, user_id)
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User is already a team member"
            )
        
        # Add user to team
        member_query = """
            INSERT INTO public.team_members (id, team_id, user_id, role, joined_at)
            VALUES ($1, $2, $3, $4, NOW())
            RETURNING *
        """
        member = await Database.fetch_one(
            member_query,
            str(uuid.uuid4()),
            team_id,
            user_id,
            'player'
        )
        
        return {
            "success": True,
            "member": member,
            "message": "Successfully joined team"
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error joining team: {str(e)}"
        )


@router.post("/{team_id}/leave")
async def leave_team(
    team_id: str,
    user_id: str = Depends(get_user_id)
):
    """
    **Leave Team**
    
    Leave a team.
    """
    try:
        # Check if user is a member
        member_query = "SELECT * FROM public.team_members WHERE team_id = $1 AND user_id = $2"
        member = await Database.fetch_one(member_query, team_id, user_id)
        
        if not member:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User is not a team member"
            )
        
        # Remove user from team
        delete_query = "DELETE FROM public.team_members WHERE team_id = $1 AND user_id = $2"
        await Database.execute(delete_query, team_id, user_id)
        
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
    
    Get list of all members in a team.
    """
    try:
        # Check if team exists
        team_query = "SELECT * FROM public.teams WHERE id = $1"
        team = await Database.fetch_one(team_query, team_id)
        
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        # Get team members
        members_query = """
            SELECT tm.*, u.full_name, u.email, u.cricket_role
            FROM public.team_members tm
            LEFT JOIN public.users u ON tm.user_id = u.id
            WHERE tm.team_id = $1
            ORDER BY tm.joined_at ASC
        """
        members = await Database.fetch_all(members_query, team_id)
        
        return {
            "success": True,
            "team_id": team_id,
            "members": members,
            "count": len(members)
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching team members: {str(e)}"
        )


@router.get("/user/my-teams")
async def get_my_teams(user_id: str = Depends(get_user_id)):
    """
    **Get My Teams**
    
    Get all teams the current user is a member of.
    """
    try:
        query = """
            SELECT DISTINCT t.* FROM public.teams t
            INNER JOIN public.team_members tm ON t.id = tm.team_id
            WHERE tm.user_id = $1
            ORDER BY t.created_at DESC
        """
        teams = await Database.fetch_all(query, user_id)
        
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


@router.post("/seed-test-data")
async def seed_test_teams():
    """
    **Seed Test Data** (Admin only)
    
    Populate teams with test data.
    """
    try:
        # Teams already seeded in neon-schema.sql
        return {
            "success": True,
            "message": "Test teams already exist in database"
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error seeding teams: {str(e)}"
        )

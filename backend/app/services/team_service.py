"""
Team Service
Business logic for team management
"""
from sqlalchemy.orm import Session
from sqlalchemy import select, func, and_
from fastapi import HTTPException, status
from typing import List, Optional
import re
from ..models.team import Team, team_members, TeamRole
from ..models.user import User
from ..schemas.team import (
    TeamCreateRequest,
    TeamUpdateRequest,
    TeamResponse,
    TeamDetailResponse,
    TeamListResponse,
    TeamOwnerResponse
)


class TeamService:
    """Service class handling team business logic"""
    
    @staticmethod
    def _generate_slug(name: str) -> str:
        """Generate URL-friendly slug from team name"""
        slug = name.lower()
        slug = re.sub(r'[^a-z0-9\s-]', '', slug)
        slug = re.sub(r'[\s-]+', '-', slug)
        return slug.strip('-')
    
    @staticmethod
    def _ensure_unique_slug(db: Session, slug: str) -> str:
        """Ensure slug is unique by appending number if needed"""
        original_slug = slug
        counter = 1
        
        while db.query(Team).filter(Team.slug == slug).first():
            slug = f"{original_slug}-{counter}"
            counter += 1
        
        return slug
    
    @staticmethod
    def create_team(
        db: Session,
        team_data: TeamCreateRequest,
        owner: User
    ) -> TeamDetailResponse:
        """
        Create a new team
        
        Args:
            db: Database session
            team_data: Team creation data
            owner: User creating the team
            
        Returns:
            TeamDetailResponse with team data
        """
        # Generate unique slug
        slug = TeamService._generate_slug(team_data.name)
        slug = TeamService._ensure_unique_slug(db, slug)
        
        # Create team
        new_team = Team(
            name=team_data.name,
            slug=slug,
            sport_type=team_data.sport_type,
            description=team_data.description,
            city=team_data.city,
            country=team_data.country,
            max_members=team_data.max_members,
            is_public=1 if team_data.is_public else 0,
            owner_id=owner.id
        )
        
        db.add(new_team)
        db.commit()
        db.refresh(new_team)
        
        # Add owner as team member with OWNER role
        stmt = team_members.insert().values(
            team_id=new_team.id,
            user_id=owner.id,
            role=TeamRole.OWNER
        )
        db.execute(stmt)
        db.commit()
        
        # Get member count
        member_count = db.query(func.count(team_members.c.id))\
            .filter(team_members.c.team_id == new_team.id)\
            .scalar()
        
        return TeamDetailResponse(
            **TeamResponse.model_validate(new_team).model_dump(),
            owner=TeamOwnerResponse.model_validate(owner),
            member_count=member_count
        )
    
    @staticmethod
    def get_teams(
        db: Session,
        skip: int = 0,
        limit: int = 20,
        sport_type: Optional[str] = None,
        search: Optional[str] = None
    ) -> TeamListResponse:
        """
        Get list of teams with pagination and filters
        
        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum number of records to return
            sport_type: Filter by sport type
            search: Search term for team name
            
        Returns:
            TeamListResponse with paginated teams
        """
        query = db.query(Team)
        
        # Apply filters
        if sport_type:
            query = query.filter(Team.sport_type == sport_type)
        
        if search:
            query = query.filter(Team.name.ilike(f"%{search}%"))
        
        # Get total count
        total = query.count()
        
        # Get paginated results
        teams = query.order_by(Team.created_at.desc())\
            .offset(skip)\
            .limit(limit)\
            .all()
        
        # Calculate pagination
        page = (skip // limit) + 1 if limit > 0 else 1
        total_pages = (total + limit - 1) // limit if limit > 0 else 1
        
        return TeamListResponse(
            teams=[TeamResponse.model_validate(team) for team in teams],
            total=total,
            page=page,
            page_size=limit,
            total_pages=total_pages
        )
    
    @staticmethod
    def get_team(db: Session, team_id: int) -> TeamDetailResponse:
        """
        Get team by ID with details
        
        Args:
            db: Database session
            team_id: Team ID
            
        Returns:
            TeamDetailResponse
            
        Raises:
            HTTPException: If team not found
        """
        team = db.query(Team).filter(Team.id == team_id).first()
        
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        # Get member count
        member_count = db.query(func.count(team_members.c.id))\
            .filter(team_members.c.team_id == team_id)\
            .scalar()
        
        return TeamDetailResponse(
            **TeamResponse.model_validate(team).model_dump(),
            owner=TeamOwnerResponse.model_validate(team.owner),
            member_count=member_count
        )
    
    @staticmethod
    def update_team(
        db: Session,
        team_id: int,
        team_data: TeamUpdateRequest,
        user: User
    ) -> TeamDetailResponse:
        """
        Update team information
        
        Args:
            db: Database session
            team_id: Team ID
            team_data: Update data
            user: User making the update
            
        Returns:
            TeamDetailResponse
            
        Raises:
            HTTPException: If team not found or user not authorized
        """
        team = db.query(Team).filter(Team.id == team_id).first()
        
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        # Check if user is owner or admin
        member_role = db.query(team_members.c.role)\
            .filter(
                and_(
                    team_members.c.team_id == team_id,
                    team_members.c.user_id == user.id
                )
            ).scalar()
        
        if member_role not in [TeamRole.OWNER, TeamRole.ADMIN]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only team owner or admin can update team"
            )
        
        # Update fields
        update_data = team_data.model_dump(exclude_unset=True)
        
        # If name is being updated, regenerate slug
        if 'name' in update_data:
            slug = TeamService._generate_slug(update_data['name'])
            if slug != team.slug:
                slug = TeamService._ensure_unique_slug(db, slug)
                update_data['slug'] = slug
        
        # Convert boolean to int
        if 'is_public' in update_data:
            update_data['is_public'] = 1 if update_data['is_public'] else 0
        
        for key, value in update_data.items():
            setattr(team, key, value)
        
        db.commit()
        db.refresh(team)
        
        # Get member count
        member_count = db.query(func.count(team_members.c.id))\
            .filter(team_members.c.team_id == team_id)\
            .scalar()
        
        return TeamDetailResponse(
            **TeamResponse.model_validate(team).model_dump(),
            owner=TeamOwnerResponse.model_validate(team.owner),
            member_count=member_count
        )
    
    @staticmethod
    def delete_team(db: Session, team_id: int, user: User) -> dict:
        """
        Delete a team
        
        Args:
            db: Database session
            team_id: Team ID
            user: User requesting deletion
            
        Returns:
            Success message
            
        Raises:
            HTTPException: If team not found or user not owner
        """
        team = db.query(Team).filter(Team.id == team_id).first()
        
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        # Only owner can delete team
        if team.owner_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only team owner can delete team"
            )
        
        db.delete(team)
        db.commit()
        
        return {"message": "Team deleted successfully"}
    
    @staticmethod
    def join_team(db: Session, team_id: int, user: User) -> dict:
        """
        Join a team
        
        Args:
            db: Database session
            team_id: Team ID
            user: User joining the team
            
        Returns:
            Success message
            
        Raises:
            HTTPException: If team not found, full, or user already member
        """
        team = db.query(Team).filter(Team.id == team_id).first()
        
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        # Check if already a member
        existing = db.query(team_members)\
            .filter(
                and_(
                    team_members.c.team_id == team_id,
                    team_members.c.user_id == user.id
                )
            ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Already a member of this team"
            )
        
        # Check if team is full
        member_count = db.query(func.count(team_members.c.id))\
            .filter(team_members.c.team_id == team_id)\
            .scalar()
        
        if member_count >= team.max_members:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Team is full"
            )
        
        # Add member
        stmt = team_members.insert().values(
            team_id=team_id,
            user_id=user.id,
            role=TeamRole.MEMBER
        )
        db.execute(stmt)
        db.commit()
        
        return {"message": "Successfully joined team"}
    
    @staticmethod
    def leave_team(db: Session, team_id: int, user: User) -> dict:
        """
        Leave a team
        
        Args:
            db: Database session
            team_id: Team ID
            user: User leaving the team
            
        Returns:
            Success message
            
        Raises:
            HTTPException: If not a member or is the owner
        """
        team = db.query(Team).filter(Team.id == team_id).first()
        
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        # Check if member
        member = db.query(team_members)\
            .filter(
                and_(
                    team_members.c.team_id == team_id,
                    team_members.c.user_id == user.id
                )
            ).first()
        
        if not member:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Not a member of this team"
            )
        
        # Owner cannot leave (must delete team or transfer ownership)
        if team.owner_id == user.id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Team owner cannot leave. Delete team or transfer ownership first."
            )
        
        # Remove member
        stmt = team_members.delete().where(
            and_(
                team_members.c.team_id == team_id,
                team_members.c.user_id == user.id
            )
        )
        db.execute(stmt)
        db.commit()
        
        return {"message": "Successfully left team"}
    
    @staticmethod
    def get_team_members(db: Session, team_id: int) -> List[dict]:
        """
        Get all members of a team
        
        Args:
            db: Database session
            team_id: Team ID
            
        Returns:
            List of team members with roles
            
        Raises:
            HTTPException: If team not found
        """
        team = db.query(Team).filter(Team.id == team_id).first()
        
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        # Get members with roles
        members = db.query(
            User.id,
            User.email,
            User.full_name,
            team_members.c.role,
            team_members.c.joined_at
        ).join(
            team_members,
            User.id == team_members.c.user_id
        ).filter(
            team_members.c.team_id == team_id
        ).order_by(
            team_members.c.joined_at
        ).all()
        
        return [
            {
                "id": m.id,
                "email": m.email,
                "full_name": m.full_name,
                "role": m.role,
                "joined_at": m.joined_at
            }
            for m in members
        ]

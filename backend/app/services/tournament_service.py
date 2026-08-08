"""
Tournament Service
Business logic for tournament management
"""
from sqlalchemy.orm import Session
from sqlalchemy import and_, func
from fastapi import HTTPException, status
from typing import List, Optional
from datetime import datetime
import re
from ..models.tournament import Tournament, TournamentRegistration, TournamentStatus, RegistrationStatus
from ..models.team import Team
from ..models.user import User
from ..schemas.tournament import (
    TournamentCreateRequest,
    TournamentUpdateRequest,
    TournamentDetailResponse,
    TournamentListResponse,
    TournamentResponse,
    TournamentOrganizerResponse,
    TeamRegistrationRequest,
    TournamentRegistrationResponse,
    RegisteredTeamResponse
)


class TournamentService:
    """Service class for tournament operations"""
    
    @staticmethod
    def _generate_slug(name: str) -> str:
        """Generate URL-friendly slug"""
        slug = name.lower()
        slug = re.sub(r'[^a-z0-9\s-]', '', slug)
        slug = re.sub(r'[\s-]+', '-', slug)
        return slug.strip('-')
    
    @staticmethod
    def _ensure_unique_slug(db: Session, slug: str) -> str:
        """Ensure slug is unique"""
        original_slug = slug
        counter = 1
        
        while db.query(Tournament).filter(Tournament.slug == slug).first():
            slug = f"{original_slug}-{counter}"
            counter += 1
        
        return slug
    
    @staticmethod
    def create_tournament(
        db: Session,
        tournament_data: TournamentCreateRequest,
        organizer: User
    ) -> TournamentDetailResponse:
        """Create new tournament"""
        # Generate unique slug
        slug = TournamentService._generate_slug(tournament_data.name)
        slug = TournamentService._ensure_unique_slug(db, slug)
        
        # Determine initial status
        now = datetime.utcnow()
        if tournament_data.registration_start <= now <= tournament_data.registration_end:
            initial_status = TournamentStatus.REGISTRATION_OPEN
        elif now < tournament_data.registration_start:
            initial_status = TournamentStatus.UPCOMING
        else:
            initial_status = TournamentStatus.REGISTRATION_CLOSED
        
        # Create tournament
        new_tournament = Tournament(
            name=tournament_data.name,
            slug=slug,
            description=tournament_data.description,
            sport_type=tournament_data.sport_type,
            format=tournament_data.format,
            status=initial_status,
            max_teams=tournament_data.max_teams,
            min_teams=tournament_data.min_teams,
            registration_start=tournament_data.registration_start,
            registration_end=tournament_data.registration_end,
            start_date=tournament_data.start_date,
            end_date=tournament_data.end_date,
            venue=tournament_data.venue,
            city=tournament_data.city,
            country=tournament_data.country,
            prize_pool=tournament_data.prize_pool,
            entry_fee=tournament_data.entry_fee,
            rules=tournament_data.rules,
            organizer_id=organizer.id
        )
        
        db.add(new_tournament)
        db.commit()
        db.refresh(new_tournament)
        
        return TournamentDetailResponse(
            **TournamentResponse.model_validate(new_tournament).model_dump(),
            organizer=TournamentOrganizerResponse.model_validate(organizer),
            registered_teams_count=0,
            rules=new_tournament.rules
        )
    
    @staticmethod
    def get_tournaments(
        db: Session,
        skip: int = 0,
        limit: int = 20,
        status: Optional[str] = None,
        sport_type: Optional[str] = None,
        search: Optional[str] = None
    ) -> TournamentListResponse:
        """Get list of tournaments with filters"""
        query = db.query(Tournament)
        
        # Apply filters
        if status:
            query = query.filter(Tournament.status == status)
        
        if sport_type:
            query = query.filter(Tournament.sport_type == sport_type)
        
        if search:
            query = query.filter(Tournament.name.ilike(f"%{search}%"))
        
        # Get total count
        total = query.count()
        
        # Get paginated results
        tournaments = query.order_by(Tournament.start_date.desc())\
            .offset(skip)\
            .limit(limit)\
            .all()
        
        # Calculate pagination
        page = (skip // limit) + 1 if limit > 0 else 1
        total_pages = (total + limit - 1) // limit if limit > 0 else 1
        
        return TournamentListResponse(
            tournaments=[TournamentResponse.model_validate(t) for t in tournaments],
            total=total,
            page=page,
            page_size=limit,
            total_pages=total_pages
        )
    
    @staticmethod
    def get_tournament(db: Session, tournament_id: int) -> TournamentDetailResponse:
        """Get tournament details"""
        tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
        
        if not tournament:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )
        
        # Get registered teams count
        registered_count = db.query(func.count(TournamentRegistration.id))\
            .filter(
                and_(
                    TournamentRegistration.tournament_id == tournament_id,
                    TournamentRegistration.status == RegistrationStatus.APPROVED
                )
            ).scalar()
        
        return TournamentDetailResponse(
            **TournamentResponse.model_validate(tournament).model_dump(),
            organizer=TournamentOrganizerResponse.model_validate(tournament.organizer),
            registered_teams_count=registered_count,
            rules=tournament.rules
        )
    
    @staticmethod
    def update_tournament(
        db: Session,
        tournament_id: int,
        tournament_data: TournamentUpdateRequest,
        user: User
    ) -> TournamentDetailResponse:
        """Update tournament"""
        tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
        
        if not tournament:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )
        
        # Only organizer can update
        if tournament.organizer_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only tournament organizer can update"
            )
        
        # Update fields
        update_data = tournament_data.model_dump(exclude_unset=True)
        
        # If name is being updated, regenerate slug
        if 'name' in update_data:
            slug = TournamentService._generate_slug(update_data['name'])
            if slug != tournament.slug:
                slug = TournamentService._ensure_unique_slug(db, slug)
                update_data['slug'] = slug
        
        for key, value in update_data.items():
            setattr(tournament, key, value)
        
        db.commit()
        db.refresh(tournament)
        
        # Get registered teams count
        registered_count = db.query(func.count(TournamentRegistration.id))\
            .filter(
                and_(
                    TournamentRegistration.tournament_id == tournament_id,
                    TournamentRegistration.status == RegistrationStatus.APPROVED
                )
            ).scalar()
        
        return TournamentDetailResponse(
            **TournamentResponse.model_validate(tournament).model_dump(),
            organizer=TournamentOrganizerResponse.model_validate(tournament.organizer),
            registered_teams_count=registered_count,
            rules=tournament.rules
        )
    
    @staticmethod
    def delete_tournament(db: Session, tournament_id: int, user: User) -> dict:
        """Delete tournament"""
        tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
        
        if not tournament:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )
        
        # Only organizer can delete
        if tournament.organizer_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only tournament organizer can delete"
            )
        
        db.delete(tournament)
        db.commit()
        
        return {"message": "Tournament deleted successfully"}
    
    @staticmethod
    def register_team(
        db: Session,
        tournament_id: int,
        registration_data: TeamRegistrationRequest,
        user: User
    ) -> TournamentRegistrationResponse:
        """Register team for tournament"""
        tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
        
        if not tournament:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )
        
        # Check if registration is open
        if tournament.status != TournamentStatus.REGISTRATION_OPEN:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tournament registration is not open"
            )
        
        # Check if team exists
        team = db.query(Team).filter(Team.id == registration_data.team_id).first()
        
        if not team:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found"
            )
        
        # Check if user is team owner
        if team.owner_id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only team owner can register team"
            )
        
        # Check if already registered
        existing = db.query(TournamentRegistration)\
            .filter(
                and_(
                    TournamentRegistration.tournament_id == tournament_id,
                    TournamentRegistration.team_id == registration_data.team_id
                )
            ).first()
        
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Team already registered for this tournament"
            )
        
        # Check if tournament is full
        registered_count = db.query(func.count(TournamentRegistration.id))\
            .filter(
                and_(
                    TournamentRegistration.tournament_id == tournament_id,
                    TournamentRegistration.status == RegistrationStatus.APPROVED
                )
            ).scalar()
        
        if registered_count >= tournament.max_teams:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Tournament is full"
            )
        
        # Create registration
        new_registration = TournamentRegistration(
            tournament_id=tournament_id,
            team_id=registration_data.team_id,
            status=RegistrationStatus.APPROVED,  # Auto-approve for now
            notes=registration_data.notes
        )
        
        db.add(new_registration)
        db.commit()
        db.refresh(new_registration)
        
        return TournamentRegistrationResponse(
            id=new_registration.id,
            tournament_id=new_registration.tournament_id,
            team_id=new_registration.team_id,
            status=new_registration.status,
            notes=new_registration.notes,
            registered_at=new_registration.registered_at,
            team=RegisteredTeamResponse.model_validate(team)
        )
    
    @staticmethod
    def get_registrations(
        db: Session,
        tournament_id: int
    ) -> List[TournamentRegistrationResponse]:
        """Get all registrations for a tournament"""
        tournament = db.query(Tournament).filter(Tournament.id == tournament_id).first()
        
        if not tournament:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Tournament not found"
            )
        
        registrations = db.query(TournamentRegistration)\
            .filter(TournamentRegistration.tournament_id == tournament_id)\
            .order_by(TournamentRegistration.registered_at)\
            .all()
        
        return [
            TournamentRegistrationResponse(
                id=reg.id,
                tournament_id=reg.tournament_id,
                team_id=reg.team_id,
                status=reg.status,
                notes=reg.notes,
                registered_at=reg.registered_at,
                team=RegisteredTeamResponse.model_validate(reg.team)
            )
            for reg in registrations
        ]

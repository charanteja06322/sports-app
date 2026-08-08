"""
Tournament Database Models
SQLAlchemy models for tournaments and tournament registrations
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum as SQLEnum, Date
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from ..core.database import Base


class TournamentStatus(str, enum.Enum):
    """Tournament status enum"""
    UPCOMING = "upcoming"
    REGISTRATION_OPEN = "registration_open"
    REGISTRATION_CLOSED = "registration_closed"
    ONGOING = "ongoing"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class TournamentFormat(str, enum.Enum):
    """Tournament format enum"""
    KNOCKOUT = "knockout"
    LEAGUE = "league"
    ROUND_ROBIN = "round_robin"
    SWISS = "swiss"


class Tournament(Base):
    """Tournament model"""
    
    __tablename__ = "tournaments"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Tournament Information
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    sport_type = Column(String(50), nullable=False, index=True)
    
    # Tournament Settings
    format = Column(SQLEnum(TournamentFormat), nullable=False)
    status = Column(SQLEnum(TournamentStatus), default=TournamentStatus.UPCOMING, nullable=False, index=True)
    max_teams = Column(Integer, default=16, nullable=False)
    min_teams = Column(Integer, default=4, nullable=False)
    
    # Dates
    registration_start = Column(DateTime(timezone=True), nullable=False)
    registration_end = Column(DateTime(timezone=True), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    
    # Location
    venue = Column(String(255), nullable=True)
    city = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    
    # Prize and Entry
    prize_pool = Column(String(100), nullable=True)
    entry_fee = Column(String(100), nullable=True)
    
    # Rules and Details
    rules = Column(Text, nullable=True)
    banner_url = Column(String(500), nullable=True)
    
    # Organizer
    organizer_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    organizer = relationship("User", back_populates="organized_tournaments")
    registrations = relationship("TournamentRegistration", back_populates="tournament", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Tournament(id={self.id}, name='{self.name}', status='{self.status}')>"


class RegistrationStatus(str, enum.Enum):
    """Registration status enum"""
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"


class TournamentRegistration(Base):
    """Tournament registration model"""
    
    __tablename__ = "tournament_registrations"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Keys
    tournament_id = Column(Integer, ForeignKey('tournaments.id', ondelete='CASCADE'), nullable=False)
    team_id = Column(Integer, ForeignKey('teams.id', ondelete='CASCADE'), nullable=False)
    
    # Registration Details
    status = Column(SQLEnum(RegistrationStatus), default=RegistrationStatus.PENDING, nullable=False, index=True)
    notes = Column(Text, nullable=True)
    
    # Timestamps
    registered_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    tournament = relationship("Tournament", back_populates="registrations")
    team = relationship("Team")
    
    def __repr__(self):
        return f"<TournamentRegistration(id={self.id}, tournament_id={self.tournament_id}, team_id={self.team_id}, status='{self.status}')>"

"""
Match Database Model
SQLAlchemy model for matches
"""
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from ..core.database import Base


class MatchStatus(str, enum.Enum):
    """Match status enum"""
    SCHEDULED = "scheduled"
    LIVE = "live"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    POSTPONED = "postponed"


class Match(Base):
    """Match model"""
    
    __tablename__ = "matches"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Foreign Keys
    tournament_id = Column(Integer, ForeignKey('tournaments.id', ondelete='CASCADE'), nullable=True)
    team1_id = Column(Integer, ForeignKey('teams.id', ondelete='SET NULL'), nullable=True)
    team2_id = Column(Integer, ForeignKey('teams.id', ondelete='SET NULL'), nullable=True)
    winner_id = Column(Integer, ForeignKey('teams.id', ondelete='SET NULL'), nullable=True)
    
    # Match Details
    match_number = Column(String(50), nullable=True)
    round = Column(String(50), nullable=True)
    status = Column(SQLEnum(MatchStatus), default=MatchStatus.SCHEDULED, nullable=False, index=True)
    
    # Schedule
    scheduled_at = Column(DateTime(timezone=True), nullable=False)
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    
    # Venue
    venue = Column(String(255), nullable=True)
    
    # Scores (JSON for flexibility across sports)
    scores = Column(JSON, nullable=True)
    
    # Match Summary
    summary = Column(String(500), nullable=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    tournament = relationship("Tournament")
    team1 = relationship("Team", foreign_keys=[team1_id])
    team2 = relationship("Team", foreign_keys=[team2_id])
    winner = relationship("Team", foreign_keys=[winner_id])
    
    def __repr__(self):
        return f"<Match(id={self.id}, tournament_id={self.tournament_id}, status='{self.status}')>"

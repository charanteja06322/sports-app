"""
Team Database Model
SQLAlchemy model for teams and team membership
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Table, Enum as SQLEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
import enum
from ..core.database import Base


class TeamRole(str, enum.Enum):
    """Enum for team member roles"""
    OWNER = "owner"
    ADMIN = "admin"
    MEMBER = "member"


class SportType(str, enum.Enum):
    """Enum for sport types"""
    CRICKET = "cricket"
    FOOTBALL = "football"
    BASKETBALL = "basketball"
    TENNIS = "tennis"
    BADMINTON = "badminton"
    VOLLEYBALL = "volleyball"
    OTHER = "other"


# Association table for team members with role
team_members = Table(
    'team_members',
    Base.metadata,
    Column('id', Integer, primary_key=True),
    Column('team_id', Integer, ForeignKey('teams.id', ondelete='CASCADE'), nullable=False),
    Column('user_id', Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
    Column('role', SQLEnum(TeamRole), default=TeamRole.MEMBER, nullable=False),
    Column('joined_at', DateTime(timezone=True), server_default=func.now(), nullable=False),
    Column('is_active', Integer, default=1, nullable=False),  # 1 = active, 0 = inactive
)


class Team(Base):
    """Team model for sports teams"""
    
    __tablename__ = "teams"
    
    # Primary Key
    id = Column(Integer, primary_key=True, index=True)
    
    # Team Information
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), unique=True, nullable=False, index=True)
    sport_type = Column(SQLEnum(SportType), nullable=False, index=True)
    description = Column(Text, nullable=True)
    logo_url = Column(String(500), nullable=True)
    
    # Location
    city = Column(String(100), nullable=True)
    country = Column(String(100), nullable=True)
    
    # Team Settings
    max_members = Column(Integer, default=25, nullable=False)
    is_public = Column(Integer, default=1, nullable=False)  # 1 = public, 0 = private
    
    # Owner
    owner_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    
    # Relationships
    owner = relationship("User", back_populates="owned_teams", foreign_keys=[owner_id])
    members = relationship(
        "User",
        secondary=team_members,
        back_populates="teams"
    )
    
    def __repr__(self):
        return f"<Team(id={self.id}, name='{self.name}', sport='{self.sport_type}')>"

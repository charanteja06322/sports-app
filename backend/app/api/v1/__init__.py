"""
API v1 Package - Master Architecture
All API modules following the master architecture specification
"""
from fastapi import APIRouter
from .auth import router as auth_router
from .teams import router as teams_router
from .tournaments import router as tournaments_router
from .matches import router as matches_router

# Main API v1 router
api_router = APIRouter(prefix="/v1")

# Include all route modules - Master Architecture
# auth.py already has prefix="/auth"
api_router.include_router(auth_router, tags=["Authentication"])
# teams, tournaments, matches need prefixes added here
api_router.include_router(teams_router, prefix="/teams", tags=["Teams"])
api_router.include_router(tournaments_router, prefix="/tournaments", tags=["Tournaments"])
api_router.include_router(matches_router, prefix="/matches", tags=["Matches"])

__all__ = ["api_router"]

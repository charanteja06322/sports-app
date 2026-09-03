"""
Sports Platform API - Main Application
FastAPI entry point for Neon PostgreSQL
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.database import Database
from app.api.v1 import api_router
import logging

logger = logging.getLogger(__name__)


# Lifespan context for startup/shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handle app startup and shutdown"""
    # Startup
    logger.info("Starting up...")
    yield
    # Shutdown
    await Database.close_pool()
    logger.info("Shutting down...")


# Initialize FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    description="Production-ready API for Sports Management Platform with Neon PostgreSQL",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
    openapi_tags=[
        {
            "name": "Health",
            "description": "Health check endpoints for monitoring"
        },
        {
            "name": "Authentication",
            "description": "User authentication and JWT verification"
        },
        {
            "name": "Teams",
            "description": "Team management operations"
        },
        {
            "name": "Tournaments",
            "description": "Tournament management operations"
        }
    ]
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api")


@app.get("/", tags=["Health"])
def root():
    """Root endpoint - API health check"""
    return {
        "message": "Sports Platform API is running",
        "version": "1.0.0",
        "status": "healthy",
        "backend": "FastAPI + Supabase",
        "docs": "/docs"
    }


@app.get("/health", tags=["Health"])
def health_check():
    """Health check endpoint for monitoring - no database access"""
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "database": "Neon PostgreSQL",
        "backend": "FastAPI"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=False
    )

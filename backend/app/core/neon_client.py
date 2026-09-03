"""
Neon PostgreSQL Client Configuration
Direct PostgreSQL connection using psycopg2/asyncpg for Neon
"""
import asyncpg
from sqlalchemy import create_engine
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.core.config import settings
from typing import Optional, AsyncGenerator
import logging

logger = logging.getLogger(__name__)


class NeonClient:
    """
    Neon PostgreSQL async client for backend operations
    Uses asyncpg for high-performance async operations
    """
    
    _instance: Optional[AsyncSession] = None
    _engine = None
    _session_factory = None
    
    @classmethod
    async def get_connection(cls):
        """
        Get direct asyncpg connection to Neon
        
        Returns:
            asyncpg.Connection: Direct database connection
        """
        try:
            connection = await asyncpg.connect(settings.DATABASE_URL)
            logger.info("Neon direct connection established")
            return connection
        except Exception as e:
            logger.error(f"Failed to connect to Neon: {e}")
            raise
    
    @classmethod
    def get_engine(cls):
        """
        Get SQLAlchemy async engine for Neon
        
        Returns:
            AsyncEngine: SQLAlchemy async engine
        """
        if cls._engine is None:
            try:
                # Convert postgresql:// to postgresql+asyncpg:// for async
                async_db_url = settings.DATABASE_URL.replace(
                    "postgresql://", 
                    "postgresql+asyncpg://"
                )
                cls._engine = create_async_engine(
                    async_db_url,
                    echo=settings.DEBUG,
                    future=True,
                    pool_pre_ping=True,
                    pool_size=10,
                    max_overflow=20,
                )
                logger.info("Neon async engine created successfully")
            except Exception as e:
                logger.error(f"Failed to create Neon engine: {e}")
                raise
        
        return cls._engine
    
    @classmethod
    def get_session_factory(cls):
        """
        Get SQLAlchemy async session factory
        
        Returns:
            sessionmaker: Session factory for creating sessions
        """
        if cls._session_factory is None:
            engine = cls.get_engine()
            cls._session_factory = sessionmaker(
                engine,
                class_=AsyncSession,
                expire_on_commit=False,
                future=True
            )
        return cls._session_factory


# Dependency for FastAPI
async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI dependency for getting database session
    
    Yields:
        AsyncSession: Database session for request
    """
    session_factory = NeonClient.get_session_factory()
    async with session_factory() as session:
        try:
            yield session
        except Exception as e:
            await session.rollback()
            logger.error(f"Database session error: {e}")
            raise
        finally:
            await session.close()


# Simple query execution function for direct queries
async def execute_query(query: str, params: tuple = ()):
    """
    Execute a raw query against Neon
    
    Args:
        query: SQL query string
        params: Query parameters
        
    Returns:
        Query results
    """
    try:
        connection = await NeonClient.get_connection()
        result = await connection.fetch(query, *params)
        await connection.close()
        return result
    except Exception as e:
        logger.error(f"Query execution error: {e}")
        raise


def get_sync_engine():
    """
    Get synchronous SQLAlchemy engine for initialization
    
    Returns:
        Engine: Synchronous engine
    """
    try:
        engine = create_engine(
            settings.DATABASE_URL,
            echo=settings.DEBUG,
        )
        logger.info("Neon sync engine created")
        return engine
    except Exception as e:
        logger.error(f"Failed to create sync engine: {e}")
        raise

"""
Database Service for Neon PostgreSQL
Provides simple query execution and connection management
"""
import asyncpg
import logging
from app.core.config import settings
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import declarative_base

logger = logging.getLogger(__name__)

# SQLAlchemy Base (for compatibility with models)
Base = declarative_base()


class Database:
    """
    Simple database service for Neon PostgreSQL operations
    Uses asyncpg for direct database queries
    """
    
    _connection_pool = None
    
    @classmethod
    async def get_pool(cls):
        """Get or create connection pool"""
        if cls._connection_pool is None:
            try:
                cls._connection_pool = await asyncpg.create_pool(
                    settings.DATABASE_URL,
                    min_size=2,
                    max_size=10,
                    command_timeout=10,
                )
                logger.info("Database connection pool created")
            except Exception as e:
                logger.error(f"Failed to create connection pool: {e}")
                raise
        return cls._connection_pool
    
    @classmethod
    async def get_connection(cls):
        """Get single connection from pool"""
        try:
            pool = await cls.get_pool()
            return await pool.acquire()
        except Exception as e:
            logger.error(f"Failed to get connection: {e}")
            raise
    
    @classmethod
    async def fetch_all(cls, query: str, *args) -> List[Dict[str, Any]]:
        """Execute SELECT query and fetch all results"""
        conn = None
        try:
            conn = await cls.get_connection()
            results = await conn.fetch(query, *args)
            return [dict(row) for row in results]
        except Exception as e:
            logger.error(f"Query error: {e}")
            raise
        finally:
            if conn:
                await conn.close()
    
    @classmethod
    async def fetch_one(cls, query: str, *args) -> Optional[Dict[str, Any]]:
        """Execute SELECT query and fetch one result"""
        conn = None
        try:
            conn = await cls.get_connection()
            result = await conn.fetchrow(query, *args)
            return dict(result) if result else None
        except Exception as e:
            logger.error(f"Query error: {e}")
            raise
        finally:
            if conn:
                await conn.close()
    
    @classmethod
    async def execute(cls, query: str, *args) -> str:
        """Execute INSERT/UPDATE/DELETE query"""
        conn = None
        try:
            conn = await cls.get_connection()
            return await conn.execute(query, *args)
        except Exception as e:
            logger.error(f"Execution error: {e}")
            raise
        finally:
            if conn:
                await conn.close()
    
    @classmethod
    async def insert(cls, table: str, data: Dict[str, Any]) -> Dict[str, Any]:
        """Insert record and return it"""
        cols = list(data.keys())
        values = list(data.values())
        placeholders = ", ".join([f"${i+1}" for i in range(len(cols))])
        col_names = ", ".join(cols)
        
        query = f"INSERT INTO {table} ({col_names}) VALUES ({placeholders}) RETURNING *"
        
        return await cls.fetch_one(query, *values)
    
    @classmethod
    async def update(cls, table: str, data: Dict[str, Any], where_clause: str, *where_args) -> bool:
        """Update record"""
        set_clause = ", ".join([f"{k} = ${i+1}" for i, k in enumerate(data.keys())])
        values = list(data.values())
        
        # Adjust placeholders for where clause
        where_placeholders = where_clause
        for i, arg in enumerate(where_args, start=len(values)+1):
            where_placeholders = where_placeholders.replace("?", f"${i}", 1)
        
        query = f"UPDATE {table} SET {set_clause} WHERE {where_placeholders}"
        
        await cls.execute(query, *values, *where_args)
        return True
    
    @classmethod
    async def delete(cls, table: str, where_clause: str, *where_args) -> bool:
        """Delete record"""
        # Adjust placeholders
        where_placeholders = where_clause
        for i, arg in enumerate(where_args, start=1):
            where_placeholders = where_placeholders.replace("?", f"${i}", 1)
        
        query = f"DELETE FROM {table} WHERE {where_placeholders}"
        await cls.execute(query, *where_args)
        return True
    
    @classmethod
    async def close_pool(cls):
        """Close connection pool"""
        if cls._connection_pool:
            await cls._connection_pool.close()
            cls._connection_pool = None
            logger.info("Connection pool closed")


# Simple wrapper functions for backward compatibility
async def query(sql: str, *args) -> List[Dict[str, Any]]:
    """Execute query and return results"""
    return await Database.fetch_all(sql, *args)


async def query_one(sql: str, *args) -> Optional[Dict[str, Any]]:
    """Execute query and return one result"""
    return await Database.fetch_one(sql, *args)


async def execute_query(sql: str, *args) -> str:
    """Execute insert/update/delete"""
    return await Database.execute(sql, *args)

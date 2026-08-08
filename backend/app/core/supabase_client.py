"""
Supabase Client Configuration
Initialize and manage Supabase connection for FastAPI backend
"""
from supabase import create_client, Client
from app.core.config import settings
from typing import Optional
import logging

logger = logging.getLogger(__name__)


class SupabaseClient:
    """
    Singleton Supabase client for backend operations
    
    This client uses the anon key for backend operations
    """
    
    _instance: Optional[Client] = None
    
    @classmethod
    def get_client(cls) -> Client:
        """
        Get or create Supabase client instance
        
        Returns:
            Client: Authenticated Supabase client
        """
        if cls._instance is None:
            try:
                # Use simple initialization without extra options
                cls._instance = create_client(
                    settings.SUPABASE_URL,
                    settings.SUPABASE_ANON_KEY
                )
                logger.info("Supabase client initialized successfully")
            except Exception as e:
                logger.error(f"Failed to initialize Supabase client: {e}")
                raise
        
        return cls._instance


# Global instance getter
def get_supabase() -> Client:
    """Get global Supabase client instance"""
    return SupabaseClient.get_client()


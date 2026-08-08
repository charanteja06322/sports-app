"""
Authentication Middleware for Supabase JWT
Verify and extract user information from Supabase tokens
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from typing import Optional, Dict
import httpx
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

# Security scheme
security = HTTPBearer()


class SupabaseAuth:
    """
    Supabase JWT Authentication Handler
    
    Verifies JWT tokens issued by Supabase Auth
    """
    
    def __init__(self):
        self.jwks_uri = f"{settings.SUPABASE_URL}/auth/v1/.well-known/jwks.json"
        self.issuer = f"{settings.SUPABASE_URL}/auth/v1"
        self._jwks_cache: Optional[Dict] = None
    
    async def get_jwks(self) -> Dict:
        """Fetch JWKS (JSON Web Key Set) from Supabase"""
        if self._jwks_cache:
            return self._jwks_cache
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(self.jwks_uri)
                response.raise_for_status()
                self._jwks_cache = response.json()
                return self._jwks_cache
        except Exception as e:
            logger.error(f"Failed to fetch JWKS: {e}")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Authentication service unavailable"
            )
    
    async def verify_token(self, token: str) -> Dict:
        """
        Verify Supabase JWT token
        
        Args:
            token: JWT token from Supabase Auth
            
        Returns:
            Dict: Decoded token payload with user info
            
        Raises:
            HTTPException: If token is invalid
        """
        try:
            # For development: decode without verification
            # In production, you should verify with JWKS
            payload = jwt.decode(
                token,
                settings.SUPABASE_ANON_KEY,  # This is actually the JWT secret
                algorithms=["HS256"],
                options={"verify_aud": False}
            )
            
            # Extract user information
            user_id = payload.get("sub")
            email = payload.get("email")
            
            if not user_id:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token: missing user ID"
                )
            
            return {
                "user_id": user_id,
                "email": email,
                "role": payload.get("role", "authenticated"),
                "full_payload": payload
            }
            
        except JWTError as e:
            logger.error(f"JWT verification failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except Exception as e:
            logger.error(f"Token verification error: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )


# Global auth instance
supabase_auth = SupabaseAuth()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> Dict:
    """
    FastAPI dependency to get current authenticated user
    
    Usage:
        @app.get("/protected")
        async def protected_route(user: Dict = Depends(get_current_user)):
            return {"user_id": user["user_id"]}
    
    Args:
        credentials: Authorization header with Bearer token
        
    Returns:
        Dict: User information from token
        
    Raises:
        HTTPException: If authentication fails
    """
    token = credentials.credentials
    user_info = await supabase_auth.verify_token(token)
    return user_info


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(
        HTTPBearer(auto_error=False)
    )
) -> Optional[Dict]:
    """
    Optional authentication - doesn't fail if no token
    
    Usage for public endpoints that show different content for logged-in users
    """
    if not credentials:
        return None
    
    try:
        return await supabase_auth.verify_token(credentials.credentials)
    except HTTPException:
        return None


def get_user_id(user: Dict = Depends(get_current_user)) -> str:
    """
    Extract just the user ID (convenience function)
    
    Usage:
        @app.get("/me")
        async def get_me(user_id: str = Depends(get_user_id)):
            return {"user_id": user_id}
    """
    return user["user_id"]


def require_role(required_role: str):
    """
    Dependency factory for role-based access control
    
    Usage:
        @app.get("/admin")
        async def admin_only(user: Dict = Depends(require_role("admin"))):
            return {"message": "Admin access granted"}
    """
    async def role_checker(user: Dict = Depends(get_current_user)) -> Dict:
        user_role = user.get("role", "authenticated")
        if user_role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Requires {required_role} role"
            )
        return user
    
    return role_checker

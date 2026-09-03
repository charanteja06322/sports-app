"""
Authentication Service - Supabase Version
Business logic for user authentication using Supabase Auth
"""
from fastapi import HTTPException, status
from ..schemas.auth import UserSignupRequest, UserLoginRequest, AuthResponse, UserResponse
from app.core.db_wrapper import db
from gotrue.errors import AuthApiError


class AuthService:
    """Service class handling authentication business logic using Supabase"""
    
    @staticmethod
    def signup(user_data: UserSignupRequest) -> AuthResponse:
        """
        Register a new user using Supabase Auth
        
        Args:
            user_data: User registration data
            
        Returns:
            AuthResponse with user data and access token
            
        Raises:
            HTTPException: If email already exists or signup fails
        """
        try:
            supabase = get_supabase()
            
            # Sign up user with Supabase Auth
            auth_response = supabase.auth.sign_up({
                "email": user_data.email,
                "password": user_data.password,
                "options": {
                    "data": {
                        "full_name": user_data.full_name,
                        "phone": user_data.phone if user_data.phone else None
                    }
                }
            })
            
            if not auth_response.user:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Failed to create user"
                )
            
            # Return user data and token
            return AuthResponse(
                user=UserResponse(
                    id=auth_response.user.id,
                    email=auth_response.user.email,
                    full_name=user_data.full_name,
                    phone=user_data.phone,
                    created_at=auth_response.user.created_at
                ),
                access_token=auth_response.session.access_token if auth_response.session else None,
                token_type="bearer"
            )
            
        except AuthApiError as e:
            # Supabase auth error
            if "already registered" in str(e).lower() or "already exists" in str(e).lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Email already registered"
                )
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Signup failed: {str(e)}"
            )
    
    @staticmethod
    def login(credentials: UserLoginRequest) -> AuthResponse:
        """
        Authenticate user using Supabase Auth
        
        Args:
            credentials: User login credentials
            
        Returns:
            AuthResponse with user data and access token
            
        Raises:
            HTTPException: If credentials are invalid
        """
        try:
            supabase = get_supabase()
            
            # Sign in with Supabase Auth
            auth_response = supabase.auth.sign_in_with_password({
                "email": credentials.email,
                "password": credentials.password
            })
            
            if not auth_response.user or not auth_response.session:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid email or password"
                )
            
            # Get user profile from profiles table
            profile_response = supabase.table("profiles").select("*").eq("id", auth_response.user.id).execute()
            
            profile_data = profile_response.data[0] if profile_response.data else {}
            
            # Return user data and token
            return AuthResponse(
                user=UserResponse(
                    id=auth_response.user.id,
                    email=auth_response.user.email,
                    full_name=profile_data.get("full_name"),
                    phone=profile_data.get("phone"),
                    avatar_url=profile_data.get("avatar_url"),
                    created_at=auth_response.user.created_at
                ),
                access_token=auth_response.session.access_token,
                token_type="bearer"
            )
            
        except AuthApiError as e:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Login failed: {str(e)}"
            )

"""
Authentication API Routes
Endpoints for user registration and login using Supabase Auth
"""
from fastapi import APIRouter, Depends, status
from ...core.dependencies import get_current_user
from ...schemas.auth import UserSignupRequest, UserLoginRequest, AuthResponse, UserResponse
from ...services.auth_service import AuthService
from ...models.user import User

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/signup",
    response_model=AuthResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
    description="Create a new user account with email and password using Supabase Auth"
)
def signup(user_data: UserSignupRequest):
    """
    **Register New User**
    
    - **email**: Valid email address (will be unique)
    - **password**: Minimum 8 characters
    - **full_name**: User's full name
    - **phone**: Optional phone number
    
    Returns user data and access token for immediate login.
    """
    return AuthService.signup(user_data)


@router.post(
    "/login",
    response_model=AuthResponse,
    status_code=status.HTTP_200_OK,
    summary="Login user",
    description="Authenticate user and generate access token using Supabase Auth"
)
def login(credentials: UserLoginRequest):
    """
    **User Login**
    
    - **email**: Registered email address
    - **password**: User's password
    
    Returns user data and access token for authenticated requests.
    """
    return AuthService.login(credentials)


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current user",
    description="Get the profile of the currently authenticated user"
)
async def get_me(
    current_user: User = Depends(get_current_user)
):
    """
    **Get Current User Profile**
    
    Requires authentication via Bearer token.
    
    Returns the profile information of the currently logged-in user.
    """
    return UserResponse.model_validate(current_user)

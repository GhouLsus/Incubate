from fastapi import APIRouter, Depends, status

from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.services.auth_service import AuthService, get_auth_service


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(
    payload: RegisterRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> TokenResponse:
    return auth_service.register(payload)


@router.post("/login", response_model=TokenResponse)
def login(
    payload: LoginRequest,
    auth_service: AuthService = Depends(get_auth_service),
) -> TokenResponse:
    return auth_service.login(payload)

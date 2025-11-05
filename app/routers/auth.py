from fastapi import APIRouter, Depends, Body
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter()


@router.post("/register", response_model=TokenResponse, response_model_exclude_none=True)
def register(payload: RegisterRequest = Body(...), db: Session = Depends(get_db)):
    svc = AuthService(db)
    svc.register(payload.email, payload.password, payload.full_name)
    return svc.authenticate(payload.email, payload.password)


@router.post("/login", response_model=TokenResponse, response_model_exclude_none=True)
def login(payload: LoginRequest = Body(...), db: Session = Depends(get_db)):
    svc = AuthService(db)
    return svc.authenticate(payload.email, payload.password)

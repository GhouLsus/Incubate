from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status
from jose import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.core.config import Settings, get_access_token_ttl, get_refresh_token_ttl, get_settings
from app.core.database import get_db
from app.models.user import User
from app.schemas.auth import LoginRequest, RegisterRequest, TokenResponse, UserRead


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class AuthService:
    def __init__(self, db: Session, settings: Settings) -> None:
        self.db = db
        self.settings = settings

    def register(self, payload: RegisterRequest) -> TokenResponse:
        existing_user = self.db.query(User).filter(User.email == payload.email).first()
        if existing_user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

        user = User(
            name=payload.name,
            email=str(payload.email),
            password_hash=self._hash_password(payload.password),
            role=payload.role.value,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        return self._build_token_response(user)

    def login(self, payload: LoginRequest) -> TokenResponse:
        user = self.db.query(User).filter(User.email == payload.email).first()
        if not user or not self._verify_password(payload.password, user.password_hash):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

        return self._build_token_response(user)

    def _build_token_response(self, user: User) -> TokenResponse:
        access_token = self._create_token(
            subject=str(user.id),
            secret=self.settings.jwt_secret_key,
            expires_in_seconds=int(get_access_token_ttl(self.settings).total_seconds()),
        )
        refresh_token = self._create_token(
            subject=str(user.id),
            secret=self.settings.jwt_refresh_secret_key,
            expires_in_seconds=int(get_refresh_token_ttl(self.settings).total_seconds()),
        )

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            user=UserRead.model_validate(user, from_attributes=True),
        )

    def _create_token(self, *, subject: str, secret: str, expires_in_seconds: int) -> str:
        now = datetime.now(timezone.utc)
        expires_at = now + timedelta(seconds=expires_in_seconds)
        payload = {
            "sub": subject,
            "iat": int(now.timestamp()),
            "exp": int(expires_at.timestamp()),
        }
        return jwt.encode(payload, secret, algorithm=self.settings.jwt_algorithm)

    @staticmethod
    def _hash_password(password: str) -> str:
        return pwd_context.hash(password)

    @staticmethod
    def _verify_password(password: str, password_hash: str) -> bool:
        return pwd_context.verify(password, password_hash)


def get_auth_service(
    db: Session = Depends(get_db),
    settings: Settings = Depends(get_settings),
) -> AuthService:
    return AuthService(db=db, settings=settings)

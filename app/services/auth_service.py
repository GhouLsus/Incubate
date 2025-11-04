from fastapi import Depends, HTTPException, status
from jose import JWTError
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.schemas.auth import TokenData, TokenResponse
from app.utils.security import create_access_token, decode_token, hash_password, verify_password


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register(self, email: str, password: str, full_name: str | None = None) -> User:
        existing = self.db.query(User).filter(User.email == email).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered",
            )

        user = User(
            email=email,
            full_name=full_name,
            password_hash=hash_password(password),
            role="user",
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user

    def authenticate(self, email: str, password: str) -> TokenResponse:
        user = self.db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        access_token = create_access_token(subject=user.email)
        return TokenResponse(access_token=access_token)

    @staticmethod
    def get_current_user(token: str, db: Session = Depends(get_db)) -> User:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

        email: str | None = None
        token_data: TokenData | None = None
        try:
            payload = decode_token(token)
            email = payload.get("sub")
            if email is None:
                raise credentials_exception
            token_data = TokenData(email=email)
        except JWTError as exc:  # pragma: no cover - jose already raises JWTError
            raise credentials_exception from exc

        if token_data is None:
            raise credentials_exception

        user = db.query(User).filter(User.email == token_data.email).first()
        if user is None:
            raise credentials_exception

        return user

    @staticmethod
    def get_current_admin_user(token: str, db: Session = Depends(get_db)) -> User:
        user = AuthService.get_current_user(token, db)
        if user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required",
            )
        return user

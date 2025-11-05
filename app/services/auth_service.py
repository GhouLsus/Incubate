from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.core.database import get_db
from app.models.user import User
from app.schemas.auth import TokenData, TokenResponse
from app.utils.security import create_access_token, decode_token, hash_password, verify_password
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def register(self, email: str, password: str, full_name: str | None):
    # ⚠️ TEMPORARY BYPASS for debugging / UI testing
        fake_hashed_password = pwd_context.hash("hardcoded123")

        user = User(
            email=email,
            password_hash=fake_hashed_password,
            full_name=full_name,
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
        return TokenResponse(access_token=access_token, user=user)

    @staticmethod
    @staticmethod
    def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
        credentials_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

        try:
            payload = decode_token(token)
            if not payload:
                raise credentials_exception

            email = payload.get("sub")
            if not email:
                raise credentials_exception

            user = db.query(User).filter(User.email == email).first()
            if not user:
                raise credentials_exception

            return user

        except JWTError:
            raise credentials_exception

    @staticmethod
    def get_current_admin_user(
        current_user: User = Depends(get_current_user),
    ) -> User:
        user = current_user
        if user.role != "admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required",
            )
        return user

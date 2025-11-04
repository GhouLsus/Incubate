from datetime import datetime, timedelta
from typing import Optional

from fastapi import HTTPException, status, Depends
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from app.core.database import get_db   # ✅ FIXED
from app.models.user import User
from app.schemas.auth import TokenData
from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def create_token(data: dict, expires_delta: Optional[timedelta] = None, is_refresh: bool = False):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    secret_key = settings.jwt_refresh_secret_key if is_refresh else settings.jwt_secret_key
    token = jwt.encode(to_encode, secret_key, algorithm=settings.jwt_algorithm)
    return token


def authenticate_user(email: str, password: str, db: Session):
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.password):
        return None
    return user


def get_current_user(token: str, db: Session = Depends(get_db)) -> User:
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm]
        )
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        token_data = TokenData(email=email)
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = db.query(User).filter(User.email == token_data.email).first()
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    return user


def get_current_admin_user(token: str, db: Session = Depends(get_db)) -> User:
    user = get_current_user(token, db)
    if not user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return user

from pydantic import BaseModel
from typing import Optional

class TokenData(BaseModel):
    email: Optional[str] = None

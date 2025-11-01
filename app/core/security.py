from typing import Any, Dict

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.core.config import Settings, get_settings
from app.core.database import get_db
from app.models.user import User


http_bearer = HTTPBearer(auto_error=False)


def decode_token(token: str, *, secret: str, algorithm: str) -> Dict[str, Any]:
    try:
        payload = jwt.decode(token, secret, algorithms=[algorithm])
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc

    if "sub" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    return payload


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(http_bearer),
    settings: Settings = Depends(get_settings),
    db: Session = Depends(get_db),
) -> User:
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")

    payload = decode_token(
        credentials.credentials,
        secret=settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm,
    )

    user_id = payload.get("sub")
    user: User | None = db.get(User, user_id)

    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    return user


def get_current_admin(user: User = Depends(get_current_user)) -> User:
    if user.role != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
    return user

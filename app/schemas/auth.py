import enum
import uuid

from pydantic import BaseModel, EmailStr, Field, ConfigDict, constr


class UserRole(str, enum.Enum):
    user = "user"
    admin = "admin"


class RegisterRequest(BaseModel):
    name: constr(strip_whitespace=True, min_length=1)  # type: ignore[type-arg]
    email: EmailStr
    password: constr(min_length=8)  # type: ignore[type-arg]
    role: UserRole = Field(default=UserRole.user)


class LoginRequest(BaseModel):
    email: EmailStr
    password: constr(min_length=8)  # type: ignore[type-arg]


class UserRead(BaseModel):
    id: uuid.UUID
    name: str
    email: EmailStr
    role: UserRole

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserRead

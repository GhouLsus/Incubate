from typing import Optional, Annotated

from pydantic import BaseModel, EmailStr, ConfigDict, constr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: Annotated[str, Field(min_length=8, max_length=72)]
    full_name: str | None = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: Annotated[str, Field(min_length=8, max_length=72)]


class UserRead(BaseModel):
    id: int
    email: EmailStr
    full_name: str | None = None
    role: str

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead


class TokenData(BaseModel):
    email: Optional[str] = None

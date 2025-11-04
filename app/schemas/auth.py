from pydantic import BaseModel, EmailStr, constr


class RegisterRequest(BaseModel):
    email: EmailStr
    password: constr(min_length=8)
    full_name: str | None = None


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

from pydantic import BaseModel
from typing import Optional

class TokenData(BaseModel):
    email: Optional[str] = None

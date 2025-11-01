from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, conint, confloat


class SweetBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    category: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=1000)
    price: confloat(gt=0)  # type: ignore[type-arg]
    quantity: conint(ge=0)  # type: ignore[type-arg]


class SweetCreate(SweetBase):
    pass


class SweetUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    category: Optional[str] = Field(default=None, min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=1000)
    price: Optional[confloat(gt=0)] = None  # type: ignore[type-arg]
    quantity: Optional[conint(ge=0)] = None  # type: ignore[type-arg]


class SweetRead(BaseModel):
    id: str
    name: str
    category: str
    description: Optional[str]
    price: float
    quantity: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SweetRestockRequest(BaseModel):
    quantity: conint(gt=0)  # type: ignore[type-arg]

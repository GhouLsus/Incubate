from pydantic import BaseModel


class SweetCreate(BaseModel):
    name: str
    category: str | None = None
    description: str | None = None
    price: float
    quantity: int


class SweetRead(SweetCreate):
    id: int


class SweetUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    description: str | None = None
    price: float | None = None
    quantity: int | None = None
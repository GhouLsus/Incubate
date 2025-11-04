from pydantic import BaseModel, ConfigDict, conint


class SweetCreate(BaseModel):
    name: str
    category: str | None = None
    description: str | None = None
    price: float
    quantity: int


class SweetRead(SweetCreate):
    id: int

    model_config = ConfigDict(from_attributes=True)


class SweetUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    description: str | None = None
    price: float | None = None
    quantity: int | None = None


class SweetRestock(BaseModel):
    quantity: conint(gt=0)

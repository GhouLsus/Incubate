from sqlalchemy import Column, String, Integer, Float, DateTime
from sqlalchemy.sql import func
from app.models.base import Base


class Sweet(Base):
    __tablename__ = "sweets"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    category = Column(String, nullable=True)
    description = Column(String, nullable=True)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
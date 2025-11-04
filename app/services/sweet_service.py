from sqlalchemy.orm import Session
from app.models.sweet import Sweet
from fastapi import HTTPException, status


class SweetService:
    def __init__(self, db: Session):
        self.db = db


    def create(self, payload):
        sweet = Sweet(**payload.dict())
        self.db.add(sweet)
        self.db.commit()
        self.db.refresh(sweet)
        return sweet


    def list(self):
        return self.db.query(Sweet).order_by(Sweet.created_at.asc()).all()


    def get(self, sweet_id: int):
        sweet = self.db.get(Sweet, sweet_id)
        if not sweet:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sweet not found")
        return sweet


    def update(self, sweet_id: int, payload):
        sweet = self.get(sweet_id)
        for k, v in payload.dict(exclude_unset=True).items():
            setattr(sweet, k, v)
        self.db.add(sweet)
        self.db.commit()
        self.db.refresh(sweet)
        return sweet


    def delete(self, sweet_id: int):
        sweet = self.get(sweet_id)
        self.db.delete(sweet)
        self.db.commit()


    def purchase(self, sweet_id: int):
        sweet = self.get(sweet_id)
        if sweet.quantity < 1:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Out of stock")
        sweet.quantity -= 1
        self.db.add(sweet)
        self.db.commit()
        self.db.refresh(sweet)
        return sweet


    def restock(self, sweet_id: int, qty: int):
        sweet = self.get(sweet_id)
        sweet.quantity += qty
        self.db.add(sweet)
        self.db.commit()
        self.db.refresh(sweet)
        return sweet
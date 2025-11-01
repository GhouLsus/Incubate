from typing import List, Optional

from fastapi import Depends, HTTPException, status
from sqlalchemy import and_, select
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.sweet import Sweet
from app.schemas.sweet import SweetCreate, SweetUpdate


class SweetService:
    def __init__(self, db: Session) -> None:
        self.db = db

    def create(self, payload: SweetCreate) -> Sweet:
        sweet = Sweet(**payload.model_dump())
        self.db.add(sweet)
        self.db.commit()
        self.db.refresh(sweet)
        return sweet

    def list(self) -> List[Sweet]:
        stmt = select(Sweet).order_by(Sweet.created_at.asc())
        return list(self.db.execute(stmt).scalars().all())

    def search(
        self,
        *,
        name: Optional[str] = None,
        category: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
    ) -> List[Sweet]:
        stmt = select(Sweet)

        conditions = []
        if name:
            conditions.append(Sweet.name.ilike(f"%{name}%"))
        if category:
            conditions.append(Sweet.category == category)
        if min_price is not None:
            conditions.append(Sweet.price >= min_price)
        if max_price is not None:
            conditions.append(Sweet.price <= max_price)

        if conditions:
            stmt = stmt.where(and_(*conditions))

        stmt = stmt.order_by(Sweet.created_at.asc())
        return list(self.db.execute(stmt).scalars().all())

    def update(self, sweet_id: str, payload: SweetUpdate) -> Sweet:
        sweet = self._get_or_404(sweet_id)
        update_data = payload.model_dump(exclude_unset=True, exclude_none=True)

        for field, value in update_data.items():
            setattr(sweet, field, value)

        self.db.add(sweet)
        self.db.commit()
        self.db.refresh(sweet)
        return sweet

    def delete(self, sweet_id: str) -> None:
        sweet = self._get_or_404(sweet_id)
        self.db.delete(sweet)
        self.db.commit()

    def _get_or_404(self, sweet_id: str) -> Sweet:
        sweet = self.db.get(Sweet, sweet_id)
        if sweet is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sweet not found")
        return sweet


def get_sweet_service(db: Session = Depends(get_db)) -> SweetService:
    return SweetService(db=db)

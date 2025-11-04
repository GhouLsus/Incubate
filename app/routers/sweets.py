from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.schemas.sweet import SweetCreate, SweetRead, SweetUpdate
from app.services.sweet_service import SweetService

router = APIRouter()

@router.post("/", response_model=SweetRead)
def create_sweet(payload: SweetCreate, db: Session = Depends(get_db)):
    svc = SweetService(db)
    return svc.create(payload)

@router.get("/", response_model=list[SweetRead])
def list_sweets(db: Session = Depends(get_db)):
    svc = SweetService(db)
    return svc.list()

@router.get("/{sweet_id}", response_model=SweetRead)
def get_sweet(sweet_id: int, db: Session = Depends(get_db)):
    svc = SweetService(db)
    return svc.get(sweet_id)

@router.put("/{sweet_id}", response_model=SweetRead)
def update_sweet(sweet_id: int, payload: SweetUpdate, db: Session = Depends(get_db)):
    svc = SweetService(db)
    return svc.update(sweet_id, payload)

@router.delete("/{sweet_id}")
def delete_sweet(sweet_id: int, db: Session = Depends(get_db)):
    svc = SweetService(db)
    return svc.delete(sweet_id)

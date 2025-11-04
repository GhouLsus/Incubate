from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.sweet import SweetCreate, SweetRead, SweetRestock, SweetUpdate
from app.services.auth_service import AuthService
from app.services.sweet_service import SweetService

router = APIRouter()

@router.post("/", response_model=SweetRead)
def create_sweet(
    payload: SweetCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(AuthService.get_current_admin_user),
):
    svc = SweetService(db)
    return svc.create(payload)

@router.get("/", response_model=list[SweetRead])
def list_sweets(db: Session = Depends(get_db)):
    svc = SweetService(db)
    return svc.list()


@router.get("/search", response_model=list[SweetRead])
def search_sweets(
    name: str | None = Query(default=None, description="Filter by sweet name"),
    category: str | None = Query(default=None, description="Filter by category"),
    db: Session = Depends(get_db),
):
    svc = SweetService(db)
    return svc.search(name=name, category=category)

@router.get("/{sweet_id}", response_model=SweetRead)
def get_sweet(sweet_id: int, db: Session = Depends(get_db)):
    svc = SweetService(db)
    return svc.get(sweet_id)


@router.put("/{sweet_id}", response_model=SweetRead)
def update_sweet(
    sweet_id: int,
    payload: SweetUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(AuthService.get_current_admin_user),
):
    svc = SweetService(db)
    return svc.update(sweet_id, payload)


@router.delete("/{sweet_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_sweet(
    sweet_id: int,
    db: Session = Depends(get_db),
    current_admin=Depends(AuthService.get_current_admin_user),
):
    svc = SweetService(db)
    return svc.delete(sweet_id)


@router.post("/{sweet_id}/purchase", response_model=SweetRead)
def purchase_sweet(
    sweet_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(AuthService.get_current_user),
):
    svc = SweetService(db)
    return svc.purchase(sweet_id)


@router.post("/{sweet_id}/restock", response_model=SweetRead)
def restock_sweet(
    sweet_id: int,
    payload: SweetRestock,
    db: Session = Depends(get_db),
    current_admin=Depends(AuthService.get_current_admin_user),
):
    svc = SweetService(db)
    return svc.restock(sweet_id, payload.quantity)


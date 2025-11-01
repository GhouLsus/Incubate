from typing import List, Optional

from fastapi import APIRouter, Depends, Query, Response, status

from app.core.security import get_current_admin
from app.schemas.sweet import SweetCreate, SweetRead, SweetUpdate
from app.services.sweet_service import SweetService, get_sweet_service


router = APIRouter(prefix="/sweets", tags=["sweets"])


@router.post(
    "",
    response_model=SweetRead,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(get_current_admin)],
)
def create_sweet(
    payload: SweetCreate,
    service: SweetService = Depends(get_sweet_service),
) -> SweetRead:
    sweet = service.create(payload)
    return SweetRead.model_validate(sweet, from_attributes=True)


@router.get("", response_model=List[SweetRead])
def list_sweets(
    service: SweetService = Depends(get_sweet_service),
) -> List[SweetRead]:
    sweets = service.list()
    return [SweetRead.model_validate(item, from_attributes=True) for item in sweets]


@router.get("/search", response_model=List[SweetRead])
def search_sweets(
    name: Optional[str] = Query(default=None),
    category: Optional[str] = Query(default=None),
    min_price: Optional[float] = Query(default=None, alias="minPrice"),
    max_price: Optional[float] = Query(default=None, alias="maxPrice"),
    service: SweetService = Depends(get_sweet_service),
) -> List[SweetRead]:
    sweets = service.search(
        name=name,
        category=category,
        min_price=min_price,
        max_price=max_price,
    )
    return [SweetRead.model_validate(item, from_attributes=True) for item in sweets]


@router.put(
    "/{sweet_id}",
    response_model=SweetRead,
    dependencies=[Depends(get_current_admin)],
)
def update_sweet(
    sweet_id: str,
    payload: SweetUpdate,
    service: SweetService = Depends(get_sweet_service),
) -> SweetRead:
    sweet = service.update(sweet_id, payload)
    return SweetRead.model_validate(sweet, from_attributes=True)


@router.delete(
    "/{sweet_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    dependencies=[Depends(get_current_admin)],
)
def delete_sweet(
    sweet_id: str,
    service: SweetService = Depends(get_sweet_service),
) -> Response:
    service.delete(sweet_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)

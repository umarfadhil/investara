from fastapi import APIRouter

from app.repositories.data_store import get_data_repository
from app.schemas.domain import Partner

router = APIRouter()


@router.get("", response_model=list[Partner])
def get_partners(region_id: str | None = None, sector: str | None = None) -> list[Partner]:
    return get_data_repository().list_partners(region_id=region_id, sector=sector)

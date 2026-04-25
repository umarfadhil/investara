from fastapi import APIRouter, HTTPException

from app.repositories.data_store import get_data_repository
from app.schemas.domain import Region

router = APIRouter()


@router.get("/{region_id}", response_model=Region)
def get_region(region_id: str) -> Region:
    region = get_data_repository().get_region(region_id)
    if region is None:
        raise HTTPException(status_code=404, detail="Region not found")
    return region

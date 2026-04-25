from fastapi import APIRouter, HTTPException

from app.core.config import settings
from app.repositories.data_store import get_data_repository

router = APIRouter()


@router.get("/health")
def get_health() -> dict[str, str]:
    return {"status": "ok", "service": "investara-api"}


@router.get("/health/database")
def get_database_health() -> dict[str, str]:
    try:
        get_data_repository().list_regions()
    except Exception as exc:
        raise HTTPException(
            status_code=503,
            detail=f"{settings.data_backend} backend is not ready: {exc}",
        ) from exc

    return {
        "status": "ok",
        "service": "investara-api",
        "data_backend": settings.data_backend,
    }

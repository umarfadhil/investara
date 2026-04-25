from fastapi import APIRouter

from app.api.v1.routes import (
    actions,
    ai,
    auth,
    health,
    investor_profiles,
    partners,
    projects,
    regions,
)

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(regions.router, prefix="/regions", tags=["regions"])
api_router.include_router(investor_profiles.router, prefix="/investor-profiles", tags=["profiles"])
api_router.include_router(ai.router, prefix="/ai", tags=["ai"])
api_router.include_router(partners.router, prefix="/partners", tags=["partners"])
api_router.include_router(actions.router, prefix="/actions", tags=["actions"])


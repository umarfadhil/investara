from fastapi import APIRouter, HTTPException

from app.repositories.data_store import get_data_repository
from app.schemas.domain import InvestorProfileInput, Project, Recommendation
from app.services.recommendation_service import rank_projects

router = APIRouter()


@router.get("", response_model=list[Project])
def get_projects(
    sector: str | None = None,
    region_id: str | None = None,
    readiness_min: int | None = None,
) -> list[Project]:
    return get_data_repository().list_projects(
        sector=sector,
        region_id=region_id,
        readiness_min=readiness_min,
    )


@router.get("/{project_id}", response_model=Project)
def get_project(project_id: str) -> Project:
    project = get_data_repository().get_project(project_id)
    if project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return project


@router.post("/recommendations", response_model=list[Recommendation])
def post_recommendations(payload: InvestorProfileInput) -> list[Recommendation]:
    return rank_projects(payload, projects=get_data_repository().list_projects())

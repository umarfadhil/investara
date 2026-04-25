from fastapi import APIRouter

from app.repositories.data_store import get_data_repository
from app.schemas.domain import InvestorProfile, InvestorProfileInput, Recommendation
from app.services.recommendation_service import rank_projects

router = APIRouter()


@router.post("", response_model=InvestorProfile)
def post_investor_profile(payload: InvestorProfileInput) -> InvestorProfile:
    return get_data_repository().create_investor_profile(payload)


@router.post("/recommendations", response_model=list[Recommendation])
def post_profile_recommendations(payload: InvestorProfileInput) -> list[Recommendation]:
    return rank_projects(payload, projects=get_data_repository().list_projects())

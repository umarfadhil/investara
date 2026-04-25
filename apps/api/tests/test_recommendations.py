from app.schemas.domain import InvestorProfileInput
from app.services.recommendation_service import rank_projects


def test_rank_projects_returns_scored_matches() -> None:
    profile = InvestorProfileInput(
        sector="Renewable Energy",
        investment_size_usd=90000000,
        risk_appetite="medium",
        preferred_regions=["central-java"],
    )

    recommendations = rank_projects(profile)

    assert recommendations
    assert recommendations[0].project.id == "pir-solar-central-java"
    assert recommendations[0].score > recommendations[-1].score


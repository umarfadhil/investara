from app.schemas.domain import InvestorProfileInput
from app.services.recommendation_service import rank_projects


def test_rank_projects_returns_scored_matches() -> None:
    profile = InvestorProfileInput(
        investor_type="strategic_corporate",
        origin_country="Singapore",
        sector="Renewable Energy",
        investment_size_usd=90000000,
        risk_appetite="medium",
        entry_mode="joint_venture",
        target_irr_pct=15,
        minimum_readiness=70,
        preferred_regions=["java"],
        strategic_priorities=["green_transition", "export_platform", "partner_ready"],
    )

    recommendations = rank_projects(profile)

    assert recommendations
    assert recommendations[0].project.source is not None
    assert recommendations[0].score >= recommendations[-1].score
    assert any("Target IRR fit" in reason for reason in recommendations[0].reasons)

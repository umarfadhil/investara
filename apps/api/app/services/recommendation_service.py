from app.repositories.mock_data import PROJECTS
from app.schemas.domain import InvestorProfileInput, Project, Recommendation


def _size_fit(profile_size: float, project_size: float) -> int:
    if profile_size <= 0:
        return 0
    ratio = min(profile_size, project_size) / max(profile_size, project_size)
    return round(ratio * 100)


def _risk_fit(profile_risk: str, project_risk: str) -> int:
    risk_rank = {"low": 1, "medium": 2, "high": 3}
    distance = abs(risk_rank[profile_risk] - risk_rank[project_risk])
    return max(0, 100 - distance * 35)


def rank_projects(
    profile: InvestorProfileInput,
    projects: list[Project] | None = None,
) -> list[Recommendation]:
    recommendations: list[Recommendation] = []
    candidate_projects = projects if projects is not None else PROJECTS
    preferred_regions = {region.lower() for region in profile.preferred_regions}

    for index, project in enumerate(candidate_projects):
        sector_fit = 100 if profile.sector.lower() == project.sector.lower() else 45
        size_fit = _size_fit(profile.investment_size_usd, project.investment_size_usd)
        risk_fit = _risk_fit(profile.risk_appetite, project.risk_level)
        readiness_fit = project.readiness_level
        region_bonus = 8 if project.region_id.lower() in preferred_regions else 0
        collaborative_bonus = 4 if index == 0 else 1

        raw_score = (
            sector_fit * 0.32
            + size_fit * 0.24
            + risk_fit * 0.18
            + readiness_fit * 0.18
            + project.attractiveness_score * 0.08
            + region_bonus
            + collaborative_bonus
        )
        score = min(100, round(raw_score))

        reasons = [
            f"Sector fit contributes {sector_fit}/100.",
            f"Investment size fit contributes {size_fit}/100.",
            f"Risk match contributes {risk_fit}/100.",
            f"Readiness level is {project.readiness_level}/100.",
        ]
        if region_bonus:
            reasons.append("Preferred region match adds ranking weight.")

        recommendations.append(Recommendation(project=project, score=score, reasons=reasons))

    return sorted(recommendations, key=lambda item: item.score, reverse=True)

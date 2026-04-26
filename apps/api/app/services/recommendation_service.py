from app.repositories.mock_data import PROJECTS
from app.schemas.domain import (
    EntryMode,
    InvestorProfileInput,
    Project,
    Recommendation,
    StrategicPriority,
)


def _size_fit(profile_size: float, project_size: float) -> int:
    if profile_size <= 0:
        return 0
    ratio = min(profile_size, project_size) / max(profile_size, project_size)
    return round(ratio * 100)


def _risk_fit(profile_risk: str, project_risk: str) -> int:
    risk_rank = {"low": 1, "medium": 2, "high": 3}
    distance = abs(risk_rank[profile_risk] - risk_rank[project_risk])
    return max(0, 100 - distance * 35)


def _target_irr_fit(target_irr_pct: float, project_irr: float) -> int:
    if target_irr_pct <= 0:
        return 75
    if project_irr >= target_irr_pct:
        return 100
    return max(0, round(100 - (target_irr_pct - project_irr) * 8))


def _readiness_fit(minimum_readiness: int, project_readiness: int) -> int:
    if minimum_readiness <= 0:
        return project_readiness
    if project_readiness >= minimum_readiness:
        return 100
    return max(0, 100 - (minimum_readiness - project_readiness) * 4)


PROJECT_PRIORITY_SIGNALS: dict[str, list[StrategicPriority]] = {
    "pir-solar-central-java": [
        "domestic_market",
        "export_platform",
        "green_transition",
        "partner_ready",
    ],
    "pir-logistics-east-kalimantan": [
        "domestic_market",
        "downstream_resources",
        "infrastructure_corridor",
        "partner_ready",
    ],
}

ENTRY_MODE_SIGNALS: dict[str, list[EntryMode]] = {
    "pir-solar-central-java": ["joint_venture", "greenfield", "project_finance"],
    "pir-logistics-east-kalimantan": ["joint_venture", "project_finance", "minority_stake"],
}

REGION_GROUPS: dict[str, set[str]] = {
    "sumatera": {
        "aceh",
        "sumatera-utara",
        "sumatera-barat",
        "riau",
        "jambi",
        "sumatera-selatan",
        "bengkulu",
        "lampung",
        "kepulauan-bangka-belitung",
        "kepulauan-riau",
    },
    "java": {
        "dki-jakarta",
        "jawa-barat",
        "jawa-tengah",
        "daerah-istimewa-yogyakarta",
        "jawa-timur",
        "banten",
        "central-java",
        "east-java",
        "west-java",
        "jakarta",
        "yogyakarta",
    },
    "kalimantan": {
        "kalimantan-barat",
        "kalimantan-tengah",
        "kalimantan-selatan",
        "kalimantan-timur",
        "kalimantan-utara",
        "east-kalimantan",
        "west-kalimantan",
        "central-kalimantan",
        "south-kalimantan",
        "north-kalimantan",
    },
    "sulawesi": {
        "sulawesi-utara",
        "sulawesi-tengah",
        "sulawesi-selatan",
        "sulawesi-tenggara",
        "gorontalo",
        "sulawesi-barat",
    },
    "bali-nusa-tenggara": {"bali", "nusa-tenggara-barat", "nusa-tenggara-timur"},
    "maluku-papua": {
        "maluku",
        "maluku-utara",
        "papua",
        "papua-barat",
        "papua-selatan",
        "papua-tengah",
        "papua-pegunungan",
        "papua-barat-daya",
    },
}

REGION_GROUP_BY_REGION_ID = {
    region_id: group_id
    for group_id, region_ids in REGION_GROUPS.items()
    for region_id in region_ids
}


def _normalize_region_preferences(regions: list[str]) -> set[str]:
    normalized_regions: set[str] = set()

    for region in regions:
        normalized_region = region.strip().lower()

        if not normalized_region:
            continue

        normalized_regions.add(
            normalized_region
            if normalized_region in REGION_GROUPS
            else REGION_GROUP_BY_REGION_ID.get(normalized_region, normalized_region)
        )

    return normalized_regions


def _region_matches_preference(preferred_regions: set[str], project_region_id: str) -> bool:
    normalized_region_id = project_region_id.lower()
    project_region_group = REGION_GROUP_BY_REGION_ID.get(normalized_region_id)

    return normalized_region_id in preferred_regions or (
        project_region_group is not None and project_region_group in preferred_regions
    )


def _infer_priority_signals(project: Project) -> set[StrategicPriority]:
    text = " ".join(
        [
            project.name,
            project.sector,
            project.overview,
            project.source.opportunity_type if project.source else "",
            project.source.project_status if project.source else "",
            project.source.description if project.source else "",
        ]
    ).lower()
    signals: set[StrategicPriority] = {"domestic_market"}

    if any(
        signal in text
        for signal in ["export", "industrial", "industri", "port", "pelabuhan"]
    ):
        signals.add("export_platform")
    if any(
        signal in text
        for signal in ["hilirisasi", "smelter", "pengolahan", "mining", "natural resources"]
    ):
        signals.add("downstream_resources")
    if any(
        signal in text
        for signal in [
            "renewable",
            "green",
            "eco",
            "battery",
            "baterai",
            "waste",
            "sampah",
        ]
    ):
        signals.add("green_transition")
    if any(
        signal in text
        for signal in ["logistics", "transport", "infrastructure", "kawasan", "hub"]
    ):
        signals.add("infrastructure_corridor")
    if project.source and (project.source.project_status or project.source.contacts):
        signals.add("partner_ready")

    for priority in PROJECT_PRIORITY_SIGNALS.get(project.id, []):
        signals.add(priority)

    return signals


def _infer_entry_mode_signals(project: Project) -> set[EntryMode]:
    signals = set(ENTRY_MODE_SIGNALS.get(project.id, []))
    text = " ".join(
        [
            project.source.opportunity_type if project.source else "",
            project.source.project_status if project.source else "",
            project.sector,
        ]
    ).lower()

    if "ipro" in text or "re/publish" in text:
        signals.add("project_finance")
        signals.add("joint_venture")
    if project.investment_size_usd > 250_000_000:
        signals.add("project_finance")
        signals.add("minority_stake")
    if "industrial" in project.sector.lower():
        signals.add("greenfield")

    return signals


def _strategic_fit(profile_priorities: list[StrategicPriority], project: Project) -> int:
    if not profile_priorities:
        return 70

    project_signals = _infer_priority_signals(project)
    matches = sum(1 for priority in profile_priorities if priority in project_signals)

    return round((matches / len(profile_priorities)) * 100)


def rank_projects(
    profile: InvestorProfileInput,
    projects: list[Project] | None = None,
) -> list[Recommendation]:
    recommendations: list[Recommendation] = []
    candidate_projects = projects if projects is not None else PROJECTS
    preferred_regions = _normalize_region_preferences(profile.preferred_regions)

    for index, project in enumerate(candidate_projects):
        sector_fit = 100 if profile.sector.lower() == project.sector.lower() else 45
        size_fit = _size_fit(profile.investment_size_usd, project.investment_size_usd)
        risk_fit = _risk_fit(profile.risk_appetite, project.risk_level)
        target_irr_fit = _target_irr_fit(profile.target_irr_pct, project.financials.irr)
        readiness_fit = _readiness_fit(profile.minimum_readiness, project.readiness_level)
        strategic_fit = _strategic_fit(profile.strategic_priorities, project)
        region_bonus = (
            6 if _region_matches_preference(preferred_regions, project.region_id) else 0
        )
        entry_mode_bonus = 3 if profile.entry_mode in _infer_entry_mode_signals(project) else 0
        collaborative_bonus = 4 if index == 0 else 1

        raw_score = (
            sector_fit * 0.24
            + size_fit * 0.18
            + risk_fit * 0.14
            + readiness_fit * 0.16
            + target_irr_fit * 0.12
            + strategic_fit * 0.10
            + project.attractiveness_score * 0.06
            + region_bonus
            + entry_mode_bonus
            + collaborative_bonus
        )
        score = min(100, round(raw_score))

        reasons = [
            f"Sector alignment contributes {sector_fit}/100.",
            f"Ticket-size fit contributes {size_fit}/100.",
            f"Risk match contributes {risk_fit}/100.",
            f"Readiness threshold contributes {readiness_fit}/100.",
            f"Target IRR fit contributes {target_irr_fit}/100.",
            f"Strategic priorities contribute {strategic_fit}/100.",
        ]
        if region_bonus:
            reasons.append("Preferred region match adds ranking weight.")
        if entry_mode_bonus:
            reasons.append("Preferred entry mode adds ranking weight.")

        recommendations.append(Recommendation(project=project, score=score, reasons=reasons))

    return sorted(recommendations, key=lambda item: item.score, reverse=True)

import json
from pathlib import Path
from typing import Any

from app.schemas.domain import (
    Ecosystem,
    Financials,
    Infrastructure,
    Partner,
    Project,
    ProjectSource,
    ProjectSourceContact,
    ProjectSourceIncentive,
    Region,
    RegulatoryReadiness,
)

JsonObject = dict[str, Any]

_SNAPSHOT_PATH = Path(__file__).with_name("bkpm_opportunities.generated.json")


def _load_snapshot() -> JsonObject:
    with _SNAPSHOT_PATH.open(encoding="utf-8") as file:
        return json.load(file)


def _region_from_json(row: JsonObject) -> Region:
    return Region(
        id=str(row["id"]),
        name=str(row["name"]),
        country="Indonesia",
        population=int(row["population"]),
        workforce=int(row["workforce"]),
        median_age=float(row["medianAge"]),
        gdp_usd_billion=float(row["gdpUsdBillion"]),
        growth_rate=float(row["growthRate"]),
        minimum_wage_usd=float(row["minimumWageUsd"]),
        sectors=list(row["sectors"]),
    )


def _source_from_json(row: JsonObject | None) -> ProjectSource | None:
    if not row:
        return None

    return ProjectSource(
        provider=str(row["provider"]),
        source_id=str(row["sourceId"]),
        opportunity_type=str(row["opportunityType"]),
        project_status=str(row.get("projectStatus") or ""),
        year=row.get("year"),
        province=str(row.get("province") or ""),
        city=str(row.get("city") or ""),
        location=str(row.get("location") or ""),
        kbli_code=str(row.get("kbliCode") or ""),
        image_url=str(row.get("imageUrl") or ""),
        video_url=str(row.get("videoUrl") or ""),
        source_url=str(row.get("sourceUrl") or ""),
        api_url=str(row.get("apiUrl") or ""),
        investment_value_text=str(row.get("investmentValueText") or ""),
        npv_text=str(row.get("npvText") or ""),
        irr_text=str(row.get("irrText") or ""),
        payback_text=str(row.get("paybackText") or ""),
        description=str(row.get("description") or ""),
        technical_aspect=str(row.get("technicalAspect") or ""),
        market_aspect=str(row.get("marketAspect") or ""),
        incentives=[
            ProjectSourceIncentive(
                name=str(item.get("name") or ""),
                description=str(item.get("description") or ""),
            )
            for item in row.get("incentives", [])
        ],
        contacts=[
            ProjectSourceContact(
                name=str(item.get("name") or ""),
                address=str(item.get("address") or ""),
                phone=str(item.get("phone") or ""),
                email=str(item.get("email") or ""),
                website=str(item.get("website") or ""),
            )
            for item in row.get("contacts", [])
        ],
        gallery=list(row.get("gallery", [])),
        documents=list(row.get("documents", [])),
    )


def _project_from_json(row: JsonObject) -> Project:
    financials = row["financials"]
    infrastructure = row["infrastructure"]
    ecosystem = row["ecosystem"]
    regulatory = row["regulatory"]

    return Project(
        id=str(row["id"]),
        name=str(row["name"]),
        sector=str(row["sector"]),
        region_id=str(row["regionId"]),
        investment_size_usd=float(row["investmentSizeUsd"]),
        readiness_level=int(row["readinessLevel"]),
        risk_level=row["riskLevel"],
        attractiveness_score=int(row["attractivenessScore"]),
        overview=str(row["overview"]),
        coordinates=tuple(row["coordinates"]) if row.get("coordinates") else None,
        financials=Financials(
            irr=float(financials["irr"]),
            npv_usd=float(financials["npvUsd"]),
            payback_years=float(financials["paybackYears"]),
        ),
        region=_region_from_json(row["region"]),
        infrastructure=Infrastructure(
            ports_distance_km=float(infrastructure["portsDistanceKm"]),
            airport_distance_km=float(infrastructure["airportDistanceKm"]),
            road_score=int(infrastructure["roadScore"]),
            electricity_score=int(infrastructure["electricityScore"]),
            internet_score=int(infrastructure["internetScore"]),
        ),
        ecosystem=Ecosystem(
            industries=list(ecosystem["industries"]),
            zones=list(ecosystem["zones"]),
            companies=list(ecosystem["companies"]),
        ),
        regulatory=RegulatoryReadiness(
            permits=list(regulatory["permits"]),
            incentives=list(regulatory["incentives"]),
            complexity_level=regulatory["complexityLevel"],
            government_support=str(regulatory["governmentSupport"]),
        ),
        source=_source_from_json(row.get("source")),
    )


_SNAPSHOT = _load_snapshot()
PROJECTS: list[Project] = [_project_from_json(project) for project in _SNAPSHOT["projects"]]
REGIONS: list[Region] = list({project.region.id: project.region for project in PROJECTS}.values())

PARTNERS: list[Partner] = [
    Partner(
        id="partner-kendal-advisory",
        name="Kendal Industrial Advisory",
        region_id="jawa-tengah",
        sectors=["Renewable Energy", "Manufacturing", "Industrial Estate & Real Estate"],
        capabilities=["Site acquisition", "Permitting", "Industrial estate coordination"],
        match_score=91,
    ),
    Partner(
        id="partner-balikpapan-logistics",
        name="Balikpapan Logistics Consortium",
        region_id="kalimantan-timur",
        sectors=["Transport & Logistics", "Infrastructure", "Fisheries"],
        capabilities=["Cold chain operations", "Port coordination", "Fleet partnerships"],
        match_score=87,
    ),
]

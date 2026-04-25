from app.schemas.domain import (
    Ecosystem,
    Financials,
    Infrastructure,
    Partner,
    Project,
    Region,
    RegulatoryReadiness,
)

REGIONS: list[Region] = [
    Region(
        id="central-java",
        name="Central Java",
        country="Indonesia",
        population=37180000,
        workforce=19900000,
        median_age=31.7,
        gdp_usd_billion=108.4,
        growth_rate=5.1,
        minimum_wage_usd=145,
        sectors=["Manufacturing", "Textiles", "Food Processing", "Renewable Energy"],
    ),
    Region(
        id="east-kalimantan",
        name="East Kalimantan",
        country="Indonesia",
        population=4050000,
        workforce=2130000,
        median_age=29.8,
        gdp_usd_billion=54.2,
        growth_rate=6.3,
        minimum_wage_usd=220,
        sectors=["Energy", "Mining Services", "Logistics", "Construction"],
    ),
]

PROJECTS: list[Project] = [
    Project(
        id="pir-solar-central-java",
        name="Central Java Solar Components Park",
        sector="Renewable Energy",
        region_id="central-java",
        investment_size_usd=85000000,
        readiness_level=82,
        risk_level="medium",
        attractiveness_score=88,
        overview=(
            "Integrated solar panel component manufacturing park near Semarang "
            "industrial corridors."
        ),
        financials=Financials(irr=16.8, npv_usd=22400000, payback_years=6.2),
        region=REGIONS[0],
        infrastructure=Infrastructure(
            ports_distance_km=24,
            airport_distance_km=18,
            road_score=87,
            electricity_score=82,
            internet_score=78,
        ),
        ecosystem=Ecosystem(
            industries=["Electronics", "Glass", "Metal fabrication", "Industrial logistics"],
            zones=["Kendal Industrial Park", "Semarang Industrial Estate"],
            companies=["Polytron", "Djarum Group", "Kendal Eco City tenants"],
        ),
        regulatory=RegulatoryReadiness(
            permits=["Location permit", "Industrial estate approval", "Environmental baseline"],
            incentives=["Tax allowance eligibility", "Import duty facility"],
            complexity_level="medium",
            government_support="Provincial one-stop investment desk assigned.",
        ),
    ),
    Project(
        id="pir-logistics-east-kalimantan",
        name="IKN Regional Cold Chain Hub",
        sector="Logistics",
        region_id="east-kalimantan",
        investment_size_usd=52000000,
        readiness_level=74,
        risk_level="medium",
        attractiveness_score=81,
        overview=(
            "Temperature-controlled logistics hub serving the new capital region "
            "and eastern Indonesia."
        ),
        financials=Financials(irr=14.2, npv_usd=13700000, payback_years=7.1),
        region=REGIONS[1],
        infrastructure=Infrastructure(
            ports_distance_km=32,
            airport_distance_km=41,
            road_score=72,
            electricity_score=76,
            internet_score=70,
        ),
        ecosystem=Ecosystem(
            industries=["Food distribution", "Construction supply", "Port logistics"],
            zones=["Kariangau Industrial Estate", "Balikpapan logistics corridor"],
            companies=["Pelindo", "Pertamina logistics network", "Regional food distributors"],
        ),
        regulatory=RegulatoryReadiness(
            permits=["Warehouse permit", "Cold storage certification"],
            incentives=["Strategic region facilitation", "Customs zone discussion"],
            complexity_level="medium",
            government_support="Regional investment office and IKN-linked facilitation available.",
        ),
    ),
]

PARTNERS: list[Partner] = [
    Partner(
        id="partner-kendal-advisory",
        name="Kendal Industrial Advisory",
        region_id="central-java",
        sectors=["Renewable Energy", "Manufacturing"],
        capabilities=["Site acquisition", "Permitting", "Industrial estate coordination"],
        match_score=91,
    ),
    Partner(
        id="partner-balikpapan-logistics",
        name="Balikpapan Logistics Consortium",
        region_id="east-kalimantan",
        sectors=["Logistics", "Food Processing"],
        capabilities=["Cold chain operations", "Port coordination", "Fleet partnerships"],
        match_score=87,
    ),
]

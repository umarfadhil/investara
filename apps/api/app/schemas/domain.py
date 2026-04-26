from datetime import datetime
from typing import Literal
from uuid import UUID, uuid4

from pydantic import BaseModel, Field

LanguageCode = Literal["en", "zh", "ja", "ko"]
RiskAppetite = Literal["low", "medium", "high"]
InvestorType = Literal[
    "strategic_corporate",
    "private_equity",
    "family_office",
    "development_finance",
    "government_agency",
]
EntryMode = Literal[
    "joint_venture",
    "minority_stake",
    "greenfield",
    "project_finance",
    "acquisition",
]
InvestmentTimeline = Literal["0_6_months", "6_12_months", "12_24_months"]
StrategicPriority = Literal[
    "domestic_market",
    "export_platform",
    "downstream_resources",
    "green_transition",
    "infrastructure_corridor",
    "partner_ready",
]
ActionType = Literal["shortlist", "request_intro", "contact_bkpm", "diligence"]


class Region(BaseModel):
    id: str
    name: str
    country: str = "Indonesia"
    population: int
    workforce: int
    median_age: float
    gdp_usd_billion: float
    growth_rate: float
    minimum_wage_usd: float
    sectors: list[str]


class ProjectSourceIncentive(BaseModel):
    name: str
    description: str = ""


class ProjectSourceContact(BaseModel):
    name: str = ""
    address: str = ""
    phone: str = ""
    email: str = ""
    website: str = ""


class ProjectSource(BaseModel):
    provider: str
    source_id: str
    opportunity_type: str
    project_status: str = ""
    year: int | None = None
    province: str = ""
    city: str = ""
    location: str = ""
    kbli_code: str = ""
    image_url: str = ""
    video_url: str = ""
    source_url: str = ""
    api_url: str = ""
    investment_value_text: str = ""
    npv_text: str = ""
    irr_text: str = ""
    payback_text: str = ""
    description: str = ""
    technical_aspect: str = ""
    market_aspect: str = ""
    incentives: list[ProjectSourceIncentive] = Field(default_factory=list)
    contacts: list[ProjectSourceContact] = Field(default_factory=list)
    gallery: list[str] = Field(default_factory=list)
    documents: list[str] = Field(default_factory=list)


class Infrastructure(BaseModel):
    ports_distance_km: float
    airport_distance_km: float
    road_score: int = Field(ge=0, le=100)
    electricity_score: int = Field(ge=0, le=100)
    internet_score: int = Field(ge=0, le=100)


class Ecosystem(BaseModel):
    industries: list[str]
    zones: list[str]
    companies: list[str]


class Financials(BaseModel):
    irr: float
    npv_usd: float
    payback_years: float


class RegulatoryReadiness(BaseModel):
    permits: list[str]
    incentives: list[str]
    complexity_level: Literal["low", "medium", "high"]
    government_support: str


class Project(BaseModel):
    id: str
    name: str
    sector: str
    region_id: str
    investment_size_usd: float
    readiness_level: int = Field(ge=0, le=100)
    risk_level: RiskAppetite
    attractiveness_score: int = Field(ge=0, le=100)
    overview: str
    coordinates: tuple[float, float] | None = None
    financials: Financials
    region: Region
    infrastructure: Infrastructure
    ecosystem: Ecosystem
    regulatory: RegulatoryReadiness
    source: ProjectSource | None = None


class InvestorProfileInput(BaseModel):
    investor_type: InvestorType = "strategic_corporate"
    origin_country: str = "Singapore"
    sector: str
    investment_size_usd: float
    risk_appetite: RiskAppetite
    entry_mode: EntryMode = "joint_venture"
    timeline: InvestmentTimeline = "6_12_months"
    target_irr_pct: float = Field(default=15, ge=0)
    investment_horizon_years: int = Field(default=7, ge=1, le=30)
    minimum_readiness: int = Field(default=70, ge=0, le=100)
    preferred_regions: list[str] = Field(default_factory=list)
    strategic_priorities: list[StrategicPriority] = Field(default_factory=list)


class InvestorProfile(InvestorProfileInput):
    id: UUID = Field(default_factory=uuid4)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Recommendation(BaseModel):
    project: Project
    score: int = Field(ge=0, le=100)
    reasons: list[str]


class TranslationRequest(BaseModel):
    language: LanguageCode
    content: str
    content_type: Literal["project_description", "regulation", "executive_summary"]


class TranslationResponse(BaseModel):
    language: LanguageCode
    translated_content: str
    provider: Literal["mock", "openai"]


class DecisionBriefRequest(BaseModel):
    project_id: str
    language: LanguageCode = "en"


class DecisionBriefResponse(BaseModel):
    project_id: str
    why_invest: list[str]
    why_not: list[str]
    ideal_investor: str
    final_recommendation: str
    provider: Literal["mock", "openai"]


class Partner(BaseModel):
    id: str
    name: str
    region_id: str
    sectors: list[str]
    capabilities: list[str]
    match_score: int = Field(ge=0, le=100)


class InvestorActionCreate(BaseModel):
    project_id: str
    action_type: ActionType
    notes: str | None = None


class InvestorAction(InvestorActionCreate):
    id: UUID = Field(default_factory=uuid4)
    status: Literal["open", "in_progress", "completed", "scheduled"] = "open"
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AuthLogin(BaseModel):
    email: str
    password: str


class AuthToken(BaseModel):
    access_token: str
    token_type: str = "bearer"

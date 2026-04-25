from datetime import datetime
from typing import Literal
from uuid import UUID, uuid4

from pydantic import BaseModel, Field

LanguageCode = Literal["en", "zh", "ja", "ko"]
RiskAppetite = Literal["low", "medium", "high"]
ActionType = Literal["shortlist", "request_intro", "contact_bkpm"]


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
    financials: Financials
    region: Region
    infrastructure: Infrastructure
    ecosystem: Ecosystem
    regulatory: RegulatoryReadiness


class InvestorProfileInput(BaseModel):
    sector: str
    investment_size_usd: float
    risk_appetite: RiskAppetite
    preferred_regions: list[str] = Field(default_factory=list)


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
    status: Literal["open", "in_progress", "completed"] = "open"
    created_at: datetime = Field(default_factory=datetime.utcnow)


class AuthLogin(BaseModel):
    email: str
    password: str


class AuthToken(BaseModel):
    access_token: str
    token_type: str = "bearer"


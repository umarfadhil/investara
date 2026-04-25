from functools import lru_cache
from typing import Protocol

from app.core.config import settings
from app.repositories.mock_data import PARTNERS, PROJECTS, REGIONS
from app.repositories.supabase import SupabaseRepository
from app.schemas.domain import (
    InvestorAction,
    InvestorActionCreate,
    InvestorProfile,
    InvestorProfileInput,
    Partner,
    Project,
    Region,
)


class DataRepository(Protocol):
    def list_regions(self) -> list[Region]: ...

    def get_region(self, region_id: str) -> Region | None: ...

    def list_projects(
        self,
        sector: str | None = None,
        region_id: str | None = None,
        readiness_min: int | None = None,
    ) -> list[Project]: ...

    def get_project(self, project_id: str) -> Project | None: ...

    def list_partners(
        self,
        region_id: str | None = None,
        sector: str | None = None,
    ) -> list[Partner]: ...

    def create_investor_profile(self, payload: InvestorProfileInput) -> InvestorProfile: ...

    def list_actions(self) -> list[InvestorAction]: ...

    def create_action(self, payload: InvestorActionCreate) -> InvestorAction: ...


class MockRepository:
    def __init__(self) -> None:
        self._actions: list[InvestorAction] = []

    def list_regions(self) -> list[Region]:
        return REGIONS

    def get_region(self, region_id: str) -> Region | None:
        return next((item for item in REGIONS if item.id == region_id), None)

    def list_projects(
        self,
        sector: str | None = None,
        region_id: str | None = None,
        readiness_min: int | None = None,
    ) -> list[Project]:
        projects = PROJECTS
        if sector:
            projects = [project for project in projects if project.sector.lower() == sector.lower()]
        if region_id:
            projects = [project for project in projects if project.region_id == region_id]
        if readiness_min is not None:
            projects = [project for project in projects if project.readiness_level >= readiness_min]
        return projects

    def get_project(self, project_id: str) -> Project | None:
        return next((item for item in PROJECTS if item.id == project_id), None)

    def list_partners(
        self,
        region_id: str | None = None,
        sector: str | None = None,
    ) -> list[Partner]:
        partners = PARTNERS
        if region_id:
            partners = [partner for partner in partners if partner.region_id == region_id]
        if sector:
            partners = [
                partner
                for partner in partners
                if sector.lower() in {item.lower() for item in partner.sectors}
            ]
        return partners

    def create_investor_profile(self, payload: InvestorProfileInput) -> InvestorProfile:
        return InvestorProfile(**payload.model_dump())

    def list_actions(self) -> list[InvestorAction]:
        return self._actions

    def create_action(self, payload: InvestorActionCreate) -> InvestorAction:
        action = InvestorAction(**payload.model_dump())
        self._actions.append(action)
        return action


@lru_cache
def get_data_repository() -> DataRepository:
    if settings.data_backend == "supabase":
        return SupabaseRepository(settings.resolved_supabase_url, settings.supabase_server_key)
    return MockRepository()

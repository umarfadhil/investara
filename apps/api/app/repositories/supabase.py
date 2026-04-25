import json
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from app.schemas.domain import (
    Ecosystem,
    Financials,
    Infrastructure,
    InvestorAction,
    InvestorActionCreate,
    InvestorProfile,
    InvestorProfileInput,
    Partner,
    Project,
    Region,
    RegulatoryReadiness,
)

JsonObject = dict[str, Any]


class SupabaseRepositoryError(RuntimeError):
    pass


class SupabaseRepository:
    def __init__(self, supabase_url: str | None, api_key: str | None) -> None:
        if not supabase_url:
            raise ValueError("SUPABASE_URL or SUPABASE_PROJECT_ID is required for Supabase mode.")
        if not api_key:
            raise ValueError("SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY is required.")
        self._rest_url = f"{supabase_url.rstrip('/')}/rest/v1"
        self._api_key = api_key

    def list_regions(self) -> list[Region]:
        rows = self._request("regions", params={"select": "*", "order": "name.asc"})
        return [self._region_from_row(row) for row in rows]

    def get_region(self, region_id: str) -> Region | None:
        rows = self._request(
            "regions",
            params={"select": "*", "id": f"eq.{region_id}", "limit": "1"},
        )
        return self._region_from_row(rows[0]) if rows else None

    def list_projects(
        self,
        sector: str | None = None,
        region_id: str | None = None,
        readiness_min: int | None = None,
    ) -> list[Project]:
        rows = self._request(
            "projects",
            params={"select": "*", "order": "attractiveness_score.desc"},
        )
        projects = self._projects_from_rows(rows)

        if sector:
            projects = [project for project in projects if project.sector.lower() == sector.lower()]
        if region_id:
            projects = [project for project in projects if project.region_id == region_id]
        if readiness_min is not None:
            projects = [project for project in projects if project.readiness_level >= readiness_min]

        return projects

    def get_project(self, project_id: str) -> Project | None:
        rows = self._request(
            "projects",
            params={"select": "*", "id": f"eq.{project_id}", "limit": "1"},
        )
        projects = self._projects_from_rows(rows)
        return projects[0] if projects else None

    def list_partners(
        self,
        region_id: str | None = None,
        sector: str | None = None,
    ) -> list[Partner]:
        rows = self._request("partners", params={"select": "*", "order": "match_score.desc"})
        partners = [self._partner_from_row(row) for row in rows]

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
        rows = self._request(
            "investor_profiles",
            method="POST",
            payload=payload.model_dump(),
        )
        if not rows:
            raise SupabaseRepositoryError("Supabase did not return the created investor profile.")
        return InvestorProfile(**rows[0])

    def list_actions(self) -> list[InvestorAction]:
        rows = self._request("investor_actions", params={"select": "*", "order": "created_at.desc"})
        return [InvestorAction(**row) for row in rows]

    def create_action(self, payload: InvestorActionCreate) -> InvestorAction:
        rows = self._request(
            "investor_actions",
            method="POST",
            payload=payload.model_dump(),
        )
        if not rows:
            raise SupabaseRepositoryError("Supabase did not return the created investor action.")
        return InvestorAction(**rows[0])

    def _projects_from_rows(self, rows: list[JsonObject]) -> list[Project]:
        if not rows:
            return []

        regions = {region.id: region for region in self.list_regions()}
        infrastructure = self._rows_by_project_id("project_infrastructure")
        ecosystems = self._rows_by_project_id("project_ecosystems")
        regulatory = self._rows_by_project_id("project_regulatory_readiness")

        return [
            self._project_from_row(
                row=row,
                regions=regions,
                infrastructure=infrastructure,
                ecosystems=ecosystems,
                regulatory=regulatory,
            )
            for row in rows
        ]

    def _rows_by_project_id(self, table: str) -> dict[str, JsonObject]:
        rows = self._request(table, params={"select": "*"})
        return {str(row["project_id"]): row for row in rows}

    def _project_from_row(
        self,
        row: JsonObject,
        regions: dict[str, Region],
        infrastructure: dict[str, JsonObject],
        ecosystems: dict[str, JsonObject],
        regulatory: dict[str, JsonObject],
    ) -> Project:
        project_id = str(row["id"])
        region = regions.get(str(row["region_id"]))
        infrastructure_row = infrastructure.get(project_id)
        ecosystem_row = ecosystems.get(project_id)
        regulatory_row = regulatory.get(project_id)

        if not region or not infrastructure_row or not ecosystem_row or not regulatory_row:
            raise SupabaseRepositoryError(
                f"Project '{project_id}' is missing related Supabase data."
            )

        return Project(
            id=project_id,
            name=str(row["name"]),
            sector=str(row["sector"]),
            region_id=str(row["region_id"]),
            investment_size_usd=float(row["investment_size_usd"]),
            readiness_level=int(row["readiness_level"]),
            risk_level=row["risk_level"],
            attractiveness_score=int(row["attractiveness_score"]),
            overview=str(row["overview"]),
            financials=Financials(
                irr=float(row["irr"]),
                npv_usd=float(row["npv_usd"]),
                payback_years=float(row["payback_years"]),
            ),
            region=region,
            infrastructure=Infrastructure(
                ports_distance_km=float(infrastructure_row["ports_distance_km"]),
                airport_distance_km=float(infrastructure_row["airport_distance_km"]),
                road_score=int(infrastructure_row["road_score"]),
                electricity_score=int(infrastructure_row["electricity_score"]),
                internet_score=int(infrastructure_row["internet_score"]),
            ),
            ecosystem=Ecosystem(
                industries=list(ecosystem_row["industries"] or []),
                zones=list(ecosystem_row["zones"] or []),
                companies=list(ecosystem_row["companies"] or []),
            ),
            regulatory=RegulatoryReadiness(
                permits=list(regulatory_row["permits"] or []),
                incentives=list(regulatory_row["incentives"] or []),
                complexity_level=regulatory_row["complexity_level"],
                government_support=str(regulatory_row["government_support"]),
            ),
        )

    def _region_from_row(self, row: JsonObject) -> Region:
        return Region(
            id=str(row["id"]),
            name=str(row["name"]),
            country=str(row.get("country") or "Indonesia"),
            population=int(row["population"]),
            workforce=int(row["workforce"]),
            median_age=float(row["median_age"]),
            gdp_usd_billion=float(row["gdp_usd_billion"]),
            growth_rate=float(row["growth_rate"]),
            minimum_wage_usd=float(row["minimum_wage_usd"]),
            sectors=list(row["sectors"] or []),
        )

    def _partner_from_row(self, row: JsonObject) -> Partner:
        return Partner(
            id=str(row["id"]),
            name=str(row["name"]),
            region_id=str(row["region_id"]),
            sectors=list(row["sectors"] or []),
            capabilities=list(row["capabilities"] or []),
            match_score=int(row["match_score"]),
        )

    def _request(
        self,
        table: str,
        *,
        params: dict[str, str] | None = None,
        method: str = "GET",
        payload: JsonObject | None = None,
    ) -> list[JsonObject]:
        url = f"{self._rest_url}/{table}"
        if params:
            url = f"{url}?{urlencode(params)}"

        data = json.dumps(payload).encode("utf-8") if payload is not None else None
        headers = {
            "Accept": "application/json",
            "Authorization": f"Bearer {self._api_key}",
            "apikey": self._api_key,
        }
        if data is not None:
            headers["Content-Type"] = "application/json"
            headers["Prefer"] = "return=representation"

        request = Request(url, data=data, headers=headers, method=method)

        try:
            with urlopen(request, timeout=15) as response:
                body = response.read().decode("utf-8")
        except HTTPError as exc:
            error_body = exc.read().decode("utf-8", errors="replace")
            raise SupabaseRepositoryError(
                f"Supabase request failed with HTTP {exc.code}: {error_body}"
            ) from exc
        except URLError as exc:
            raise SupabaseRepositoryError(f"Supabase request failed: {exc.reason}") from exc

        if not body:
            return []

        decoded = json.loads(body)
        if isinstance(decoded, list):
            return decoded
        if isinstance(decoded, dict):
            return [decoded]
        raise SupabaseRepositoryError("Supabase returned an unexpected response shape.")

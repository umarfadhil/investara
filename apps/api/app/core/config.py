from functools import lru_cache
from typing import Literal

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(".env", "../../.env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_env: str = "local"
    api_v1_prefix: str = "/api/v1"
    data_backend: Literal["mock", "supabase"] = "mock"
    database_url: str = "postgresql://investara:investara@localhost:5432/investara"
    jwt_secret: str = "change-me"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 60
    openai_api_key: str | None = None
    supabase_project_id: str | None = None
    supabase_url: str | None = None
    supabase_publishable_key: str | None = None
    supabase_secret_key: str | None = None
    supabase_anon_key: str | None = None
    supabase_service_role_key: str | None = None
    allowed_origins_raw: str = Field(
        default="http://localhost:3000",
        validation_alias="ALLOWED_ORIGINS",
    )

    @property
    def allowed_origins(self) -> list[str]:
        return [origin.strip() for origin in self.allowed_origins_raw.split(",") if origin.strip()]

    @property
    def resolved_supabase_url(self) -> str | None:
        if self.supabase_url:
            return self.supabase_url.rstrip("/")
        if self.supabase_project_id:
            return f"https://{self.supabase_project_id}.supabase.co"
        return None

    @property
    def supabase_server_key(self) -> str | None:
        return self.supabase_secret_key or self.supabase_service_role_key


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

from app.core.config import settings
from app.repositories.data_store import get_data_repository
from app.schemas.domain import (
    DecisionBriefRequest,
    DecisionBriefResponse,
    TranslationRequest,
    TranslationResponse,
)


def translate_content(payload: TranslationRequest) -> TranslationResponse:
    provider = "openai" if settings.openai_api_key else "mock"
    language_labels = {
        "en": "English",
        "zh": "Chinese",
        "ja": "Japanese",
        "ko": "Korean",
    }

    if provider == "mock":
        translated = f"[{language_labels[payload.language]} mock translation] {payload.content}"
    else:
        translated = payload.content

    return TranslationResponse(
        language=payload.language,
        translated_content=translated,
        provider=provider,
    )


def generate_decision_brief(payload: DecisionBriefRequest) -> DecisionBriefResponse:
    project = get_data_repository().get_project(payload.project_id)
    if project is None:
        raise ValueError("Project not found")

    provider = "openai" if settings.openai_api_key else "mock"
    return DecisionBriefResponse(
        project_id=project.id,
        why_invest=[
            f"Attractive IRR of {project.financials.irr:.1f}% with clear regional demand drivers.",
            (
                f"Readiness level of {project.readiness_level}/100 reduces "
                "early execution uncertainty."
            ),
            f"{project.region.name} offers relevant workforce and sector alignment.",
        ],
        why_not=[
            (
                f"{project.regulatory.complexity_level.title()} regulatory "
                "complexity still requires local execution support."
            ),
            (
                "Mock data must be replaced with verified financial and regional "
                "data before final investment approval."
            ),
        ],
        ideal_investor=(
            f"A {project.sector.lower()} investor seeking Indonesia exposure with medium-term "
            "capital deployment capacity and local partner appetite."
        ),
        final_recommendation=(
            "Proceed to diligence and partner introduction if target ticket size "
            "and risk appetite align."
        ),
        provider=provider,
    )

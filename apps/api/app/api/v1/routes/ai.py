from fastapi import APIRouter, HTTPException

from app.schemas.domain import (
    DecisionBriefRequest,
    DecisionBriefResponse,
    TranslationRequest,
    TranslationResponse,
)
from app.services.ai_service import generate_decision_brief, translate_content

router = APIRouter()


@router.post("/translate", response_model=TranslationResponse)
def post_translate(payload: TranslationRequest) -> TranslationResponse:
    return translate_content(payload)


@router.post("/decision-brief", response_model=DecisionBriefResponse)
def post_decision_brief(payload: DecisionBriefRequest) -> DecisionBriefResponse:
    try:
        return generate_decision_brief(payload)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


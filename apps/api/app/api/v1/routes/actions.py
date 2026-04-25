from fastapi import APIRouter

from app.schemas.domain import InvestorAction, InvestorActionCreate
from app.services.action_service import create_action, list_actions

router = APIRouter()


@router.get("", response_model=list[InvestorAction])
def get_actions() -> list[InvestorAction]:
    return list_actions()


@router.post("", response_model=InvestorAction)
def post_action(payload: InvestorActionCreate) -> InvestorAction:
    return create_action(payload)


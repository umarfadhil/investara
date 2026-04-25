from app.repositories.data_store import get_data_repository
from app.schemas.domain import InvestorAction, InvestorActionCreate


def create_action(payload: InvestorActionCreate) -> InvestorAction:
    return get_data_repository().create_action(payload)


def list_actions() -> list[InvestorAction]:
    return get_data_repository().list_actions()

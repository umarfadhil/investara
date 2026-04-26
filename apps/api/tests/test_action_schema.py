from app.schemas.domain import InvestorAction, InvestorActionCreate


def test_diligence_action_contract_accepts_scheduled_status() -> None:
    payload = InvestorActionCreate(
        project_id="pir-solar-central-java",
        action_type="diligence",
    )

    action = InvestorAction(**payload.model_dump(), status="scheduled")

    assert action.action_type == "diligence"
    assert action.status == "scheduled"

from fastapi import APIRouter

from app.schemas.domain import AuthLogin, AuthToken
from app.services.auth_service import login

router = APIRouter()


@router.post("/login", response_model=AuthToken)
def post_login(payload: AuthLogin) -> AuthToken:
    return login(payload)


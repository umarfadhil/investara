from datetime import UTC, datetime, timedelta

from jose import jwt

from app.core.config import settings
from app.schemas.domain import AuthLogin, AuthToken


def login(payload: AuthLogin) -> AuthToken:
    subject = payload.email.lower().strip()
    expires_at = datetime.now(UTC) + timedelta(
        minutes=settings.access_token_expire_minutes
    )
    access_token = jwt.encode(
        {"sub": subject, "exp": expires_at},
        settings.jwt_secret,
        algorithm=settings.jwt_algorithm,
    )
    return AuthToken(access_token=access_token)


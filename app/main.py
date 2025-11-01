from fastapi import FastAPI

from app.core.config import get_settings
from app.routers import auth, sweets


TAGS_METADATA = [
    {
        "name": "auth",
        "description": "User authentication, registration, and token issuance.",
    },
    {
        "name": "sweets",
        "description": "Sweet inventory browsing, management, purchasing, and restocking.",
    },
]


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title=settings.app_name,
        docs_url="/docs",
        redoc_url=None,
        openapi_url="/openapi.json",
        openapi_tags=TAGS_METADATA,
    )

    app.include_router(auth.router)
    app.include_router(sweets.router)

    return app


app = create_app()

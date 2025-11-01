from fastapi import FastAPI

from app.core.config import get_settings
from app.routers import auth


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.app_name)

    app.include_router(auth.router)

    return app


app = create_app()

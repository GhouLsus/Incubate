from fastapi import FastAPI

from app.core.config import get_settings
from app.core.database import engine
from app.models import sweet, user  # noqa: F401 - ensure models are imported
from app.models.base import Base
from app.routers import auth, sweets


settings = get_settings()


Base.metadata.create_all(bind=engine)


app = FastAPI(title=settings.app_name)


app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(sweets.router, prefix="/api/sweets", tags=["sweets"])


@app.get("/")
def root():
    return {"status": "ok", "app": settings.app_name}
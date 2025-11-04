from fastapi import FastAPI
from app.routers import auth, sweets
from app.core.config import get_settings
from app.core.database import engine


settings = get_settings()


app = FastAPI(title=settings.app_name)


app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(sweets.router, prefix="/api/sweets", tags=["sweets"])


@app.get("/")
def root():
    return {"status": "ok", "app": settings.app_name}
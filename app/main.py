from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # ✅ Added this line

from app.core.config import get_settings
from app.core.database import engine
from app.models import sweet, user  # noqa: F401 - ensure models are imported
from app.models.base import Base
from app.routers import auth, sweets

settings = get_settings()

# ✅ Create all tables
Base.metadata.create_all(bind=engine)

# ✅ Initialize FastAPI app
app = FastAPI(title=settings.app_name)

# ✅ Allow frontend to talk to backend (CORS fix)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(sweets.router, prefix="/api/sweets", tags=["sweets"])

@app.get("/")
def root():
    return {"status": "ok", "app": settings.app_name}

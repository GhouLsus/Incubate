from functools import lru_cache
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "sqlite:///./sweet_shop.db"
    jwt_secret_key: str = "super-secret-access-key"
    jwt_algorithm: str = "HS256"
    access_token_expires_minutes: int = 15
    refresh_token_expires_days: int = 7
    app_name: str = "Sweet Shop Management System API"


    # allow example extras (if present)
    postgres_db: str | None = None
    postgres_user: str | None = None
    postgres_password: str | None = None
    pgadmin_default_email: str | None = None
    pgadmin_default_password: str | None = None
    next_public_api_url: str | None = None


    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()

settings = get_settings()


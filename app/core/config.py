from functools import lru_cache
from datetime import timedelta
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/sweet_shop"
    jwt_secret_key: str = "super-secret-access-key"
    jwt_refresh_secret_key: str = "super-secret-refresh-key"
    jwt_algorithm: str = "HS256"
    access_token_expires_minutes: int = 15
    refresh_token_expires_days: int = 7
    app_name: str = "Sweet Shop Management System API"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()


def get_access_token_ttl(settings: Settings) -> timedelta:
    return timedelta(minutes=settings.access_token_expires_minutes)


def get_refresh_token_ttl(settings: Settings) -> timedelta:
    return timedelta(days=settings.refresh_token_expires_days)

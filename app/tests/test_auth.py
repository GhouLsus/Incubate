import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import create_app
from app.core.database import get_db
from app.models.base import Base
from app.models.user import User


SQLITE_URL = "sqlite+pysqlite:///:memory:"


@pytest.fixture(scope="session")
def engine():
    engine = create_engine(
        SQLITE_URL,
        future=True,
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    return engine


@pytest.fixture(scope="session")
def session_factory(engine):
    return sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


@pytest.fixture(autouse=True)
def clean_database(engine):
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


@pytest.fixture
def app(session_factory):
    application = create_app()

    def override_get_db():
        db = session_factory()
        try:
            yield db
            db.commit()
        except Exception:
            db.rollback()
            raise
        finally:
            db.close()

    application.dependency_overrides[get_db] = override_get_db
    return application


@pytest.fixture
def client(app):
    return TestClient(app)


@pytest.fixture
def db_session(session_factory):
    session = session_factory()
    try:
        yield session
    finally:
        session.close()


def register_user(client: TestClient, *, name: str, email: str, password: str, role: str = "user"):
    return client.post(
        "/auth/register",
        json={
            "name": name,
            "email": email,
            "password": password,
            "role": role,
        },
    )


def test_register_creates_user_and_returns_tokens(client: TestClient, db_session):
    response = register_user(
        client,
        name="Alice",
        email="alice@example.com",
        password="Secret123!",
    )

    assert response.status_code == 201
    body = response.json()

    assert body["user"]["email"] == "alice@example.com"
    assert body["user"]["name"] == "Alice"
    assert body["user"]["role"] == "user"
    assert "id" in body["user"]
    assert body["token_type"] == "bearer"
    assert body["access_token"]
    assert body["refresh_token"]

    stmt = select(User).where(User.email == "alice@example.com")
    user = db_session.execute(stmt).scalar_one()
    assert user.password_hash != "Secret123!"


def test_register_rejects_duplicate_email(client: TestClient):
    payload = {
        "name": "Bob",
        "email": "bob@example.com",
        "password": "Secret123!",
    }

    first = client.post("/auth/register", json=payload)
    assert first.status_code == 201

    second = client.post("/auth/register", json=payload)
    assert second.status_code == 400
    assert second.json()["detail"] == "Email already registered"


def test_login_returns_tokens_for_valid_credentials(client: TestClient):
    register_user(
        client,
        name="Charlie",
        email="charlie@example.com",
        password="Secret123!",
    )

    response = client.post(
        "/auth/login",
        json={"email": "charlie@example.com", "password": "Secret123!"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]
    assert body["refresh_token"]


def test_login_rejects_invalid_credentials(client: TestClient):
    register_user(
        client,
        name="Dana",
        email="dana@example.com",
        password="Secret123!",
    )

    response = client.post(
        "/auth/login",
        json={"email": "dana@example.com", "password": "WrongPass1!"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"


def test_login_rejects_unknown_user(client: TestClient):
    response = client.post(
        "/auth/login",
        json={"email": "unknown@example.com", "password": "Secret123!"},
    )

    assert response.status_code == 401
    assert response.json()["detail"] == "Invalid credentials"

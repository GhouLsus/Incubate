import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import create_app
from app.core.database import get_db
from app.models.base import Base


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


def register_user(client: TestClient, *, name: str, email: str, password: str, role: str = "user"):
    response = client.post(
        "/auth/register",
        json={
            "name": name,
            "email": email,
            "password": password,
            "role": role,
        },
    )
    return response


def get_auth_headers(response):
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def create_sweet(client: TestClient, headers):
    payload = {
        "name": "Chocolate Fudge",
        "category": "Chocolate",
        "description": "Rich chocolate fudge",
        "price": 4.99,
        "quantity": 10,
    }
    response = client.post("/sweets", json=payload, headers=headers)
    return response.json()


@pytest.fixture
def admin_headers(client: TestClient):
    response = register_user(
        client,
        name="Admin",
        email="admin_inventory@example.com",
        password="Secret123!",
        role="admin",
    )
    return get_auth_headers(response)


@pytest.fixture
def user_headers(client: TestClient):
    response = register_user(
        client,
        name="User",
        email="user_inventory@example.com",
        password="Secret123!",
    )
    return get_auth_headers(response)


def test_user_can_purchase_sweet(client: TestClient, admin_headers, user_headers):
    sweet = create_sweet(client, admin_headers)

    response = client.post(f"/sweets/{sweet['id']}/purchase", headers=user_headers)

    assert response.status_code == 200
    data = response.json()
    assert data["quantity"] == 9


def test_purchase_fails_when_out_of_stock(client: TestClient, admin_headers, user_headers):
    sweet = create_sweet(client, admin_headers)

    for _ in range(10):
        client.post(f"/sweets/{sweet['id']}/purchase", headers=user_headers)

    response = client.post(f"/sweets/{sweet['id']}/purchase", headers=user_headers)

    assert response.status_code == 400
    assert response.json()["detail"] == "Sweet is out of stock"


def test_restock_requires_admin(client: TestClient, admin_headers, user_headers):
    sweet = create_sweet(client, admin_headers)

    response = client.post(
        f"/sweets/{sweet['id']}/restock",
        json={"quantity": 5},
        headers=user_headers,
    )

    assert response.status_code == 403
    assert response.json()["detail"] == "Insufficient permissions"


def test_admin_can_restock_sweet(client: TestClient, admin_headers):
    sweet = create_sweet(client, admin_headers)

    response = client.post(
        f"/sweets/{sweet['id']}/restock",
        json={"quantity": 15},
        headers=admin_headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert data["quantity"] == 25

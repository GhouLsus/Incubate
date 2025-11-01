import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import create_app
from app.core.database import get_db
from app.models.base import Base
from app.models.sweet import Sweet


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


def create_sweet_payload(**overrides):
    payload = {
        "name": "Chocolate Fudge",
        "category": "Chocolate",
        "description": "Rich chocolate fudge",
        "price": 4.99,
        "quantity": 50,
    }
    payload.update(overrides)
    return payload


def test_admin_can_create_sweet(client: TestClient, db_session):
    admin_response = register_user(
        client,
        name="Admin",
        email="admin@example.com",
        password="Secret123!",
        role="admin",
    )
    headers = get_auth_headers(admin_response)

    response = client.post("/sweets", json=create_sweet_payload(), headers=headers)

    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Chocolate Fudge"
    assert data["category"] == "Chocolate"
    assert data["quantity"] == 50
    assert data["price"] == 4.99
    assert "id" in data
    assert data["created_at"]

    stmt = select(Sweet).where(Sweet.id == data["id"])
    sweet = db_session.execute(stmt).scalar_one()
    assert sweet.name == "Chocolate Fudge"


def test_create_sweet_requires_admin_role(client: TestClient):
    user_response = register_user(
        client,
        name="User",
        email="user@example.com",
        password="Secret123!",
    )
    headers = get_auth_headers(user_response)

    response = client.post("/sweets", json=create_sweet_payload(), headers=headers)

    assert response.status_code == 403
    assert response.json()["detail"] == "Insufficient permissions"


def test_get_sweets_returns_public_list(client: TestClient):
    admin_response = register_user(
        client,
        name="Admin",
        email="admin2@example.com",
        password="Secret123!",
        role="admin",
    )
    headers = get_auth_headers(admin_response)

    client.post("/sweets", json=create_sweet_payload(name="Caramel Bar"), headers=headers)
    client.post("/sweets", json=create_sweet_payload(name="Mint Delight"), headers=headers)

    response = client.get("/sweets")

    assert response.status_code == 200
    items = response.json()
    assert len(items) == 2
    names = {item["name"] for item in items}
    assert names == {"Caramel Bar", "Mint Delight"}


def test_search_sweets_filters_results(client: TestClient):
    admin_response = register_user(
        client,
        name="Admin",
        email="admin3@example.com",
        password="Secret123!",
        role="admin",
    )
    headers = get_auth_headers(admin_response)

    client.post(
        "/sweets",
        json=create_sweet_payload(name="Berry Tart", category="Fruit", price=5.50),
        headers=headers,
    )
    client.post(
        "/sweets",
        json=create_sweet_payload(name="Lemon Bar", category="Citrus", price=3.25),
        headers=headers,
    )
    client.post(
        "/sweets",
        json=create_sweet_payload(name="Orange Slice", category="Citrus", price=2.75),
        headers=headers,
    )

    response = client.get(
        "/sweets/search",
        params={"category": "Citrus", "minPrice": 3.0, "maxPrice": 4.0},
    )

    assert response.status_code == 200
    items = response.json()
    assert len(items) == 1
    assert items[0]["name"] == "Lemon Bar"


def test_update_sweet_allows_admin_to_modify(client: TestClient):
    admin_response = register_user(
        client,
        name="Admin",
        email="admin4@example.com",
        password="Secret123!",
        role="admin",
    )
    headers = get_auth_headers(admin_response)

    created = client.post("/sweets", json=create_sweet_payload(), headers=headers).json()

    response = client.put(
        f"/sweets/{created['id']}",
        json={"price": 6.25, "quantity": 30},
        headers=headers,
    )

    assert response.status_code == 200
    data = response.json()
    assert data["price"] == 6.25
    assert data["quantity"] == 30


def test_delete_sweet_removes_record(client: TestClient, db_session):
    admin_response = register_user(
        client,
        name="Admin",
        email="admin5@example.com",
        password="Secret123!",
        role="admin",
    )
    headers = get_auth_headers(admin_response)

    created = client.post("/sweets", json=create_sweet_payload(), headers=headers).json()

    response = client.delete(f"/sweets/{created['id']}", headers=headers)

    assert response.status_code == 204
    stmt = select(Sweet).where(Sweet.id == created["id"])
    result = db_session.execute(stmt).first()
    assert result is None

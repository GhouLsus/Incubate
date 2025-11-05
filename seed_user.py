# seed_user.py
# Run with: python seed_user.py

from app.core.database import SessionLocal
from app.models.user import User
from app.utils.security import hash_password


def create_user(email: str, password: str, full_name: str | None = None, role: str = "user"):
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            print(f"User already exists: {existing.email}")
            return

        user = User(
            email=email,
            full_name=full_name,
            password_hash=hash_password(password),
            role=role,
        )

        db.add(user)
        db.commit()
        db.refresh(user)
        print(f"✅ Created user: {user.email} (role={user.role})")
    finally:
        db.close()


if __name__ == "__main__":
    create_user("admin@gmail.com", "hardcoded123", full_name="Local Admin", role="admin")
    create_user("user@gmail.com", "testpass123", full_name="Test User", role="user")

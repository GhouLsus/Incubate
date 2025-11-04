from app.core.database import SessionLocal, engine
from app.models.base import Base
from app.models.user import User
from app.utils.security import hash_password

Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    admin_email = "admin@sweetshop.com"
    admin_password = "admin123"

    existing = db.query(User).filter(User.email == admin_email).first()
    if existing:
        print("Admin already exists.")
    else:
        admin = User(
            email=admin_email,
            full_name="Administrator",
            password_hash=hash_password(admin_password),
            role="admin",
        )
        db.add(admin)
        db.commit()
        print("✅ Admin user created:", admin_email)
finally:
    db.close()

from app.core.database import SessionLocal
from app.models.user import User
from app.services.auth_service import get_password_hash

db = SessionLocal()

admin_email = "admin@sweetshop.com"
admin_password = "admin123"

existing = db.query(User).filter(User.email == admin_email).first()
if existing:
    print("Admin already exists.")
else:
    admin = User(
        email=admin_email,
        hashed_password=get_password_hash(admin_password),
        role="admin"
    )
    db.add(admin)
    db.commit()
    print("✅ Admin user created:", admin_email)

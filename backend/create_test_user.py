from database import SessionLocal
from models import User, UserRole
from security import get_password_hash

db = SessionLocal()
user = db.query(User).filter(User.username == "test_admin").first()
if not user:
    user = User(
        username="test_admin",
        email="test_admin@example.com",
        full_name="Test Admin",
        role=UserRole.admin,
        password_hash=get_password_hash("password123")
    )
    db.add(user)
    db.commit()
    print("Created test_admin")
else:
    # Update password just in case
    user.password_hash = get_password_hash("password123")
    user.role = UserRole.admin
    db.commit()
    print("Updated test_admin")
db.close()

from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from sqlalchemy import func

def count_parth_tasks():
    db = SessionLocal()
    try:
        # Find user 'parth'
        user = db.query(models.User).filter(models.User.username == "parth").first()
        
        if not user:
            print("User 'parth' not found!")
            return

        print(f"User 'parth' found with ID: {user.id}")

        # Count tasks
        task_count = db.query(func.count(models.Task.task_id)).filter(models.Task.assigned_to == user.id).scalar()
        
        print(f"Total tasks assigned to 'parth': {task_count}")

        # SQL Equivalent
        print("\n--- Equivalent SQL Query ---")
        print(f"SELECT COUNT(*) FROM tasks WHERE assigned_to = {user.id};")
        print(f"-- Or dynamically:")
        print("SELECT COUNT(*) FROM tasks WHERE assigned_to = (SELECT user_id FROM users WHERE username = 'parth');")

    finally:
        db.close()

if __name__ == "__main__":
    count_parth_tasks()

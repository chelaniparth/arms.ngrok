from database import engine
from sqlalchemy import text

def update_schema():
    with engine.connect() as conn:
        conn = conn.execution_options(isolation_level="AUTOCOMMIT")
        
        # 1. Create Enum Type if not exists
        try:
            print("Creating Enum type 'task_error_status'...")
            conn.execute(text("CREATE TYPE arms_workflow.task_error_status AS ENUM ('None', 'Internal Error', 'Client Query');"))
            print("Enum created.")
        except Exception as e:
            print(f"Enum might already exist or error: {e}")

        # 2. Add 'rating' column
        try:
            print("Adding 'rating' column...")
            conn.execute(text("ALTER TABLE arms_workflow.tasks ADD COLUMN rating INTEGER;"))
            print("Column 'rating' added.")
        except Exception as e:
            print(f"Column 'rating' might already exist: {e}")

        # 3. Add 'error_status' column
        try:
            print("Adding 'error_status' column...")
            conn.execute(text("ALTER TABLE arms_workflow.tasks ADD COLUMN error_status arms_workflow.task_error_status DEFAULT 'None';"))
            print("Column 'error_status' added.")
        except Exception as e:
            print(f"Column 'error_status' might already exist: {e}")

        # 4. Add 'remarks' column
        try:
            print("Adding 'remarks' column...")
            conn.execute(text("ALTER TABLE arms_workflow.tasks ADD COLUMN remarks TEXT;"))
            print("Column 'remarks' added.")
        except Exception as e:
            print(f"Column 'remarks' might already exist: {e}")

        # 5. Add 'total_paused_duration_seconds' column
        try:
            print("Adding 'total_paused_duration_seconds' column...")
            conn.execute(text("ALTER TABLE arms_workflow.tasks ADD COLUMN total_paused_duration_seconds INTEGER DEFAULT 0;"))
            print("Column 'total_paused_duration_seconds' added.")
        except Exception as e:
            print(f"Column 'total_paused_duration_seconds' might already exist: {e}")

        # 6. Add 'last_paused_at' column
        try:
            print("Adding 'last_paused_at' column...")
            conn.execute(text("ALTER TABLE arms_workflow.tasks ADD COLUMN last_paused_at TIMESTAMP WITH TIME ZONE;"))
            print("Column 'last_paused_at' added.")
        except Exception as e:
            print(f"Column 'last_paused_at' might already exist: {e}")
            
        print("Schema update process completed.")

if __name__ == "__main__":
    update_schema()

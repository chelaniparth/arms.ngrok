from database import engine
from sqlalchemy import text

def add_error_status():
    with engine.connect() as conn:
        conn = conn.execution_options(isolation_level="AUTOCOMMIT")
        try:
            # 1. Create Enum Type
            print("Creating Enum type 'task_error_status'...")
            conn.execute(text("CREATE TYPE arms_workflow.task_error_status AS ENUM ('None', 'Internal Error', 'Client Query');"))
        except Exception as e:
            print(f"Enum might already exist: {e}")

        try:
            # 2. Add Column
            print("Adding 'error_status' column to 'tasks' table...")
            conn.execute(text("ALTER TABLE arms_workflow.tasks ADD COLUMN error_status arms_workflow.task_error_status DEFAULT 'None';"))
            print("Column added successfully.")
        except Exception as e:
            print(f"Error adding column: {e}")

if __name__ == "__main__":
    add_error_status()

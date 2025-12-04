from database import engine
from sqlalchemy import inspect

def check_columns():
    inspector = inspect(engine)
    columns = inspector.get_columns("tasks", schema="arms_workflow")
    column_names = [col['name'] for col in columns]
    print(f"Columns in 'tasks' table: {column_names}")
    
    if "error_status" in column_names:
        print("SUCCESS: 'error_status' column exists.")
    else:
        print("FAILURE: 'error_status' column is MISSING.")

if __name__ == "__main__":
    check_columns()

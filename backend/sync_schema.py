from database import engine
import models

def sync_schema():
    print("Syncing schema with database...")
    # This will create tables if they don't exist
    models.Base.metadata.create_all(bind=engine)
    print("Schema sync complete.")
    
    # Verify tables
    from sqlalchemy import inspect
    inspector = inspect(engine)
    tables = inspector.get_table_names(schema="arms_workflow")
    print(f"Tables in 'arms_workflow' schema: {tables}")

if __name__ == "__main__":
    sync_schema()

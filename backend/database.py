import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# On Render.com, the database URL is provided via the DATABASE_URL environment variable.
# Local development can fallback to a local PostgreSQL instance.
DATABASE_URL = os.environ.get(
    "DATABASE_URL", 
    "postgresql://postgres:12345678@localhost:5432/hikmah_db"
)

# Render provides connection strings starting with 'postgres://', but SQLAlchemy 
# requires 'postgresql://'. We must normalize this.
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get db session in FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

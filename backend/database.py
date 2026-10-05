import os
import urllib.parse
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Explicitly specify the path to the .env file in the backend directory
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path, override=True)

database_url = os.getenv("DATABASE_URL")

if database_url:
    url = database_url
    if url.startswith("mysql://"):
        url = url.replace("mysql://", "mysql+pymysql://", 1)
    connect_args = {}
    if "ssl" not in url and "localhost" not in url and "127.0.0.1" not in url:
        connect_args = {"ssl": {}}
else:
    host = os.getenv("DB_HOST", "localhost")
    port = int(os.getenv("DB_PORT", "3306"))
    db = os.getenv("DB_NAME", "document_intelligence")
    user = os.getenv("DB_USER", "root")
    password = os.getenv("DB_PASSWORD", "")

    safe_user = urllib.parse.quote_plus(user)
    safe_password = urllib.parse.quote_plus(password)
    url = f"mysql+pymysql://{safe_user}:{safe_password}@{host}:{port}/{db}"

    # TiDB Cloud and cloud MySQL providers require SSL; localhost does not
    connect_args = {}
    if host not in ("localhost", "127.0.0.1"):
        connect_args = {
            "ssl": {}
        }

engine = create_engine(url, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

        
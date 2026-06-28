import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Explicitly specify the path to the .env file in the backend directory
env_path = os.path.join(os.path.dirname(__file__), '.env')
load_dotenv(dotenv_path=env_path)

host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
db = os.getenv("DB_NAME")
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")

url = f"mysql+pymysql://{user}:{password}@{host}:{port}/{db}"
engine = create_engine(url)
SessionLocal=sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        with engine.connect() as connection:
            print("Database connected successfully")
    except Exception as e:
        print(f"Connection failed: {e}")

engine.connect()
print("Database connected successfully")


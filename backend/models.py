from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime, Boolean, inspect, text
from sqlalchemy.sql import func
from database import Base, engine

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String(256), unique=True, nullable=False, index=True)
    hashed_password = Column(String(512), nullable=True)
    auth_provider = Column(String(32), nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    reset_token = Column(String(256), nullable=True, index=True)
    reset_token_expires = Column(DateTime, nullable=True)

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(512), nullable=False)
    price = Column(Float, nullable=False)
    rating = Column(Integer, nullable=False)
    url = Column(String(1024), nullable=False)
    description = Column(Text, nullable=False)
    upc = Column(String(64), nullable=False)
    availability = Column(String(256), nullable=False)
    num_reviews = Column(Integer, default=0, nullable=False)
    summary = Column(Text, nullable=True)
    genre = Column(String(128), nullable=True)

class BookChunk(Base):
    __tablename__ = "book_chunks"

    id = Column(Integer, primary_key=True, autoincrement=True)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    chunk_text = Column(Text, nullable=False)
    chunk_index = Column(Integer, nullable=False)
    chroma_id = Column(String(128), nullable=False)

Base.metadata.create_all(bind=engine)


def upgrade_existing_users_table():
    """Add auth columns introduced after the original users table was created.

    ``create_all`` deliberately does not alter existing tables, so local databases
    created before password-reset support need this small forward-only upgrade.
    """
    inspector = inspect(engine)
    user_columns = {column["name"] for column in inspector.get_columns("users")}

    with engine.begin() as connection:
        if "reset_token" not in user_columns:
            connection.execute(text("ALTER TABLE users ADD COLUMN reset_token VARCHAR(256) NULL"))
        if "reset_token_expires" not in user_columns:
            connection.execute(text("ALTER TABLE users ADD COLUMN reset_token_expires DATETIME NULL"))

    # Keep the model's indexed field and the existing database schema aligned.
    indexes = {index["name"] for index in inspect(engine).get_indexes("users")}
    if "ix_users_reset_token" not in indexes:
        with engine.begin() as connection:
            connection.execute(text("CREATE INDEX ix_users_reset_token ON users (reset_token)"))


upgrade_existing_users_table()



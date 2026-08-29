from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime, Boolean
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



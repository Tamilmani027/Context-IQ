from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from models import Book
from schemas import BookResponse
from database import get_db

router = APIRouter(prefix="/api/books", tags=["books"])

@router.get("", response_model=List[BookResponse])
def get_books(db: Session = Depends(get_db)):
    return db.query(Book).all()

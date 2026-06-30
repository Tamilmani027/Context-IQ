from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from models import Book
from schemas import BookResponse, BookBase
from database import get_db

router = APIRouter(prefix="/api/books", tags=["books"])

@router.get("/", response_model=List[BookResponse])
def get_books(db: Session = Depends(get_db)):
    return db.query(Book).all()

@router.get("/{book_id:int}", response_model=BookResponse)
def get_book(book_id:int,db:Session=Depends(get_db)):
    book=db.query(Book).filter(Book.id==book_id).first()
    if book is None:
        raise HTTPException(status_code=404,detail="Book not found")
    return book

@router.get("/{book_id:int}/recommendations",response_model=List[BookResponse]) 
def get_recommendations(book_id:int,db:Session=Depends(get_db)):
    book=db.query(Book).filter(Book.id==book_id).first()
    if book is None:
        raise HTTPException(status_code=404,detail="Book not found")
    source_book=db.query(Book).filter(Book.rating == book.rating,Book.id != book_id).limit(5).all()
    return source_book

@router.post("/upload", response_model=BookResponse)
def upload_book(book:BookBase,db:Session=Depends(get_db)):
    new_book=Book(
        title=book.title,
        price=book.price,
        rating=book.rating,
        url=book.url,
        description=book.description,
        upc=book.upc,
        availability=book.availability,
        num_reviews=book.num_reviews
    )
    db.add(new_book)
    db.commit()
    db.refresh(new_book)
    return new_book    




    


    
 
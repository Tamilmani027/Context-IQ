import os
import json
from database import SessionLocal
from models import Book

json_path = "../scraper/data/books.json"
with open(json_path, 'r', encoding='utf-8') as f:
    books = json.load(f)

db = SessionLocal()
try:
    for book_data in books:
        book = Book(
            title=book_data.get("title"),
            price=book_data.get("price"),
            rating=book_data.get("rating"),
            url=book_data.get("url"),
            description=book_data.get("description"),
            upc=book_data.get("upc"),
            availability=book_data.get("availability"),
            num_reviews=book_data.get("num_reviews")
        )
        db.add(book)
    
    db.commit()
    print(f"Successfully imported {len(books)} books!")
finally:
    db.close()



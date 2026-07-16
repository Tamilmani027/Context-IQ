from database import SessionLocal
from services.embeddings import process_all_books

db = SessionLocal()
try:
    process_all_books(db)
finally:
    db.close()
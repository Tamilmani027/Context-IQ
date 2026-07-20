from database import SessionLocal
from services.embeddings import process_all_books

db = SessionLocal()
try:
    process_all_books(db)
finally:
    db.close()

from services.embeddings import setup_chromadb
collection = setup_chromadb()
print(f"ChromaDB chunks: {collection.count()}")
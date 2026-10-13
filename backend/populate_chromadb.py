from database import SessionLocal
from models import Book
from services.embeddings import generate_embeddings, setup_chromadb, chunk

db = SessionLocal()
collection = setup_chromadb()

try:
    books = db.query(Book).all()
    print(f"Found {len(books)} books")

    # If collection already has data, remove to avoid duplicates.
    existing = collection.count()
    if existing > 0:
        ids = collection.get()["ids"]
        if ids:
            collection.delete(ids=ids)
            print(f"Cleared {len(ids)} existing chunks")

    total = 0
    for book in books:
        text = f"{book.title}\n{book.description or ''}\n{book.summary or ''}".strip()
        if not text:
            continue
        chunks = chunk(text, chunk_size=200)
        embeddings = generate_embeddings(chunks)
        for idx, (chunk_text, embedding) in enumerate(zip(chunks, embeddings)):
            chroma_id = f"book_{book.id}_chunk_{idx}"
            collection.add(
                ids=[chroma_id],
                embeddings=[embedding],
                documents=[chunk_text],
                metadatas=[{"book_id": int(book.id)}],
            )
            total += 1
    print(f"Indexed {total} chunks")
finally:
    db.close()
    print("Collection count:", collection.count())

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from schemas import QuestionRequest
from database import get_db
from services.llm import query_chromadb, generate_answer


router = APIRouter(prefix="/api", tags=["qa"])


@router.post("/ask")
def ask_question(request: QuestionRequest, db: Session = Depends(get_db)):
    # Retrieve relevant chunks from ChromaDB
    results = query_chromadb(request.question)

    # Extract chunk texts (documents) -- results['documents'][0] is a list
    chunks = []
    try:
        chunks = results.get("documents", [])[0]
    except Exception:
        chunks = []

    # Extract book_ids from metadata entries
    book_ids = []
    try:
        metadatas = results.get("metadatas", [])[0]
        # metadatas is expected to be a list of dicts like {'book_id': 1}
        book_ids = [int(m.get("book_id")) for m in metadatas if "book_id" in m]
    except Exception:
        book_ids = []

    answer = generate_answer(request.question, chunks, book_ids, db)
    return answer

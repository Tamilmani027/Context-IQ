import os
import requests
from typing import List, Dict, Any
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env')
load_dotenv(dotenv_path=env_path, override=True)

from services.embeddings import generate_embeddings, setup_chromadb
from models import Book


def query_chromadb(question: str, n_results: int = 3) -> Dict[str, Any]:
    """Search ChromaDB for the most relevant chunks to a question.

    - Calls `generate_embeddings([question])`
    - Calls `setup_chromadb()` to get the collection
    - Calls `collection.query()` with the generated embedding
    - Returns the query results as-is
    """
    # generate_embeddings expects a list of texts; take the first embedding
    embeddings = generate_embeddings([question])
    if not embeddings:
        return {}

    collection = setup_chromadb()
    # ChromaDB expects a list of vectors for `query_embeddings`, so pass the
    # embeddings list (e.g. [[0.1, 0.2, ...]]) instead of a single vector.
    results = collection.query(
        query_embeddings=embeddings,
        n_results=n_results,
    )
    return results


def generate_answer(question: str, context_chunks: List[str], book_ids: List[int], db) -> Dict[str, Any]:
    """Send the question + retrieved context to LM Studio and return the answer.

    - `db` is an SQLAlchemy session used to fetch book titles for `book_ids`.
    - Returns a dict with keys `answer` and `source_books` (list of titles).
    """
    # Fetch book titles from the database for provided book_ids
    source_books: List[str] = []
    if book_ids:
        books = db.query(Book).filter(Book.id.in_(book_ids)).all()
        # Preserve order of book_ids when possible
        id_to_title = {b.id: b.title for b in books}
        source_books = [id_to_title.get(bid, f"book_{bid}") for bid in book_ids]

    # Build context and prompt
    context = "\n\n".join(context_chunks) if context_chunks else ""
    prompt = (
        "You are a helpful book assistant. Use the following book excerpts to answer the question.\n\n"
        f"Context:\n{context}\n\n"
        f"Question: {question}\n\n"
        "Answer based on the context provided. Cite which books you referenced."
    )

    llm_api_key = os.getenv("LLM_API_KEY")
    llm_model = os.getenv("LLM_MODEL", "llama-3.1-8b-instant")

    if llm_api_key:
        api_url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {llm_api_key}",
            "Content-Type": "application/json"
        }
        chosen_model = llm_model
    else:
        api_url = "http://localhost:1234/v1/chat/completions"
        headers = {"Content-Type": "application/json"}
        chosen_model = "mistralai/mistral-7b-instruct-v0.3"

    payload = {
        "model": chosen_model,
        "messages": [
            {"role": "user", "content": f"You are a helpful book assistant.\n\n{prompt}"},
        ],
        "temperature": 0.7,
        "max_tokens": 500,
    }

    try:
        resp = requests.post(api_url, json=payload, headers=headers, timeout=30)
        if not resp.ok:
            print(f"[LLM Error] API {api_url} returned status {resp.status_code}: {resp.text}")
        resp.raise_for_status()
        data = resp.json()
        answer_text = data["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"[LLM Exception] Failed to call {api_url}: {e}")
        answer_text = "Could not get an answer from the language model."

    return {"answer": answer_text, "source_books": source_books}

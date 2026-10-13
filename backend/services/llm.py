import os
import time
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

    llm_provider = os.getenv("LLM_PROVIDER", "groq").lower().strip()
    llm_api_key = os.getenv("LLM_API_KEY")
    llm_model = os.getenv("LLM_MODEL")

    if llm_provider == "gemini" and llm_api_key:
        # Gemini exposes an OpenAI-compatible chat/completions endpoint.
        api_url = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions"
        headers = {
            "Authorization": f"Bearer {llm_api_key}",
            "Content-Type": "application/json"
        }
        chosen_model = llm_model or "gemini-2.0-flash"
    elif llm_api_key:
        api_url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {
            "Authorization": f"Bearer {llm_api_key}",
            "Content-Type": "application/json"
        }
        chosen_model = llm_model or "llama-3.1-8b-instant"
    else:
        api_url = "http://localhost:1234/v1/chat/completions"
        headers = {"Content-Type": "application/json"}
        chosen_model = "mistralai/mistral-7b-instruct-v0.3"

    if llm_provider == "gemini" and llm_api_key:
        chosen_model = llm_model or "gemini-3.1-flash-lite"
        api_url = f"https://generativelanguage.googleapis.com/v1beta/models/{chosen_model}:generateContent?key={llm_api_key}"
        answer_text = "Could not get an answer from the language model."
        gemini_payload = {
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.7, "maxOutputTokens": 500},
        }
        for attempt in range(3):
            try:
                resp = requests.post(api_url, json=gemini_payload, headers={"Content-Type": "application/json"}, timeout=60)
                if not resp.ok:
                    print(f"[LLM Error] API {api_url} returned status {resp.status_code}: {resp.text}")
                    if resp.status_code in (429, 503) and attempt < 2:
                        time.sleep(2 ** attempt)
                        continue
                resp.raise_for_status()
                data = resp.json()
                answer_text = data["candidates"][0]["content"]["parts"][0]["text"]
                break
            except Exception as e:
                print(f"[LLM Exception] Failed to call {api_url}: {e}")
                if attempt < 2:
                    time.sleep(2 ** attempt)
                    continue
    else:
        answer_text = "Could not get an answer from the language model."
        payload = {
            "model": chosen_model,
            "messages": [
                {"role": "user", "content": f"You are a helpful book assistant.\n\n{prompt}"},
            ],
            "temperature": 0.7,
            "max_tokens": 500,
        }
        try:
            resp = requests.post(api_url, json=payload, headers=headers, timeout=120)
            if not resp.ok:
                print(f"[LLM Error] API {api_url} returned status {resp.status_code}: {resp.text}")
            resp.raise_for_status()
            data = resp.json()
            answer_text = data["choices"][0]["message"]["content"]
        except Exception as e:
            print(f"[LLM Exception] Failed to call {api_url}: {e}")
        answer_text = "Could not get an answer from the language model."

    return {"answer": answer_text, "source_books": source_books}

import os
import requests
from typing import List, Optional

# Lazy singletons to avoid loading heavy ML models into memory during app startup
_model = None
_chroma_collection = None

def get_embedding_model():
    """Lazy load SentenceTransformer only when needed."""
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    return _model

def setup_chromadb():
    """Lazy load ChromaDB only when needed."""
    global _chroma_collection
    if _chroma_collection is None:
        import chromadb
        client = chromadb.PersistentClient(path="./chroma_db")
        _chroma_collection = client.get_or_create_collection(name="books_collection")
    return _chroma_collection

def generate_embeddings_via_hf_api(texts: List[str], api_key: Optional[str] = None) -> Optional[List[List[float]]]:
    """Generate embeddings via Hugging Face Inference API (0MB RAM usage)."""
    api_url = "https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2"
    headers = {}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"
    try:
        response = requests.post(
            api_url,
            headers=headers,
            json={"inputs": texts, "options": {"wait_for_model": True}},
            timeout=20,
        )
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                if isinstance(data[0], list):
                    return data
                elif isinstance(data[0], float):
                    return [data]
    except Exception as e:
        print(f"HF API embedding error: {e}")
    return None

def generate_embeddings(texts: List[str]) -> List[List[float]]:
    if not texts:
        return []

    # Check for Hugging Face API key or explicit cloud flag to conserve RAM on Render
    hf_token = os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACE_API_KEY")
    if hf_token or os.getenv("USE_HF_EMBEDDINGS", "").lower() in ("true", "1"):
        emb = generate_embeddings_via_hf_api(texts, hf_token)
        if emb:
            return emb

    # Otherwise lazy load local SentenceTransformer
    try:
        model = get_embedding_model()
        embeddings = model.encode(texts)
        return embeddings.tolist()
    except Exception as e:
        print(f"Local SentenceTransformer unavailable or OOM: {e}, falling back to free HF API...")
        emb = generate_embeddings_via_hf_api(texts, hf_token)
        if emb:
            return emb
        raise e

def chunk(text, chunk_size=100):
    start = 0
    chunks = []
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end
    return chunks

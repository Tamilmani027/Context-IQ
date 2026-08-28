import chromadb
from sentence_transformers import SentenceTransformer
from typing import List

# Load model globally to avoid reloading it on every function call
model = SentenceTransformer('all-MiniLM-L6-v2')

def setup_chromadb():
    client = chromadb.PersistentClient(path="./chroma_db")
    collection = client.get_or_create_collection(name="books_collection")
    return collection

def generate_embeddings(texts: List[str]) -> List[List[float]]:
    if not texts:
        return []
    embeddings = model.encode(texts)
    return embeddings.tolist()

def chunk(text, chunk_size=100):
    start = 0
    chunks = []
    while start < len(text):
        end = start + chunk_size
        chunks.append(text[start:end])
        start = end
    return chunks

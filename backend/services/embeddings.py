
from sentence_transformers import SentenceTransformer 
import chromadb
from models import Book, BookChunk


def chunk_text(text,chunk_size=100, overlap=20):
	words=text.split(" ")
	if len(words)<=chunk_size:
		return [text]
	else:
		start=0
		chunks=[]
		while start<len(words):
			chunk=words[start:start+chunk_size]
			chunks.append(" ".join(chunk))
			start+=(chunk_size-overlap)
		return chunks

model=None
def load_embedding_model():
	global model
	if model is None:
		model=SentenceTransformer("all-MiniLM-L6-v2")
	return model

def generate_embeddings(texts):
	model=load_embedding_model()
	embed=model.encode(texts)
	return embed.tolist()

chroma_collection=None
def setup_chromadb():
	global chroma_collection
	if chroma_collection is None:
		client=chromadb.PersistentClient(path='chroma_db')
		chroma_collection=client.get_or_create_collection('book_chunks')
	return chroma_collection

def store_book_embeddings(book_id,chunks,embeddings,chunk_ids):
	collection=setup_chromadb()
	collection.add(ids=chunk_ids,
	embeddings=embeddings,
	documents=chunks,
	metadatas=[{"book_id": book_id} for _ in chunks]
	)

def process_all_books(db):
	books=db.query(Book).all()
	for book in books:
		print(f"Processing book {book.id}:{book.title}")
		if not book.description:
			continue
		chunks=chunk_text(book.description)
		embeddings=generate_embeddings(chunks)
		chunk_ids = [f"book_{book.id}_chunk_{i}" for i, _ in enumerate(chunks)] 		
		store_book_embeddings(book.id,chunks,embeddings,chunk_ids)
		for i, (chunk, chroma_id) in enumerate(zip(chunks, chunk_ids)):
			book_chunk = BookChunk(
        	book_id=book.id,
        	chunk_text=chunk,
        	chunk_index=i,
        	chroma_id=chroma_id
    				)
			db.add(book_chunk)
		db.commit()



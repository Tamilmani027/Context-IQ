import requests
import time

from database import SessionLocal
from models import Book


def generate_summary(description: str) -> str:
    """Return a 2-sentence summary for the given description using LM Studio."""
    prompt = (
        "You are a book summarizer. Write a short 2-sentence summary of this book based on its description. "
        "Reply with only the summary, nothing else.\n\n"
        f"Description: {description}"
    )

    payload = {
        "model": "mistralai/mistral-7b-instruct-v0.3",
        "messages": [
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.7,
        "max_tokens": 150,
    }

    try:
        resp = requests.post(
            "http://localhost:1234/v1/chat/completions",
            json=payload,
            timeout=60,
        )
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"]
    except Exception as e:
        return ""


def generate_genre(description: str) -> str:
    """Predict a single genre name from the description using LM Studio."""
    prompt = (
        "Based on this book description, classify it into exactly one genre. \n"
        "Reply with only the genre name, one or two words maximum. \n"
        "Choose from: Fiction, Mystery, Romance, Science Fiction, Fantasy, \n"
        "Historical Fiction, Self-Help, Children, Philosophy, Horror, Thriller, Poetry, Other.\n\n"
        f"Description: {description}"
    )

    payload = {
        "model": "mistralai/mistral-7b-instruct-v0.3",
        "messages": [
    {"role": "user", "content": f"Classify the book description into a single genre.\n\n{prompt}"},
					],
        "temperature": 0.0,
        "max_tokens": 10,
    }

    try:
        resp = requests.post("http://localhost:1234/v1/chat/completions", json=payload)
        resp.raise_for_status()
        data = resp.json()
        return data["choices"][0]["message"]["content"].strip()
    except Exception:
        return ""


def process_insights():
    db = SessionLocal()
    try:
        books = db.query(Book).all()
        total = len(books)
        processed = 0
        for book in books:
            if book.summary:
                continue
            print(f"Processing {book.id}/{total}: {book.title}")
            try:
                summary = generate_summary(book.description)
                genre = generate_genre(book.description)
                book.summary = summary
                book.genre = genre
                db.add(book)
                db.commit()
                processed += 1
            except Exception as e:
                db.rollback()
                print(f"Failed processing book {book.id}: {e}")
            time.sleep(0.5)
        print(f"Done. Processed {processed} books.")
    finally:
        db.close()


def test_summary():
    desc = "A collection of poems that are funny and strange, perfect for children and adults alike."
    result = generate_summary(desc)
    print(f"Result: '{result}'")
    print(f"Length: {len(result)}")


if __name__ == "__main__":
    test_summary()
    # process_insights()

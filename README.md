# Document Intelligence Platform (Context-IQ)

An end-to-end document intelligence system for books. The platform scrapes book data, stores it in MySQL, indexes descriptions with vector embeddings (ChromaDB), and answers natural-language questions using a local LLM via LM Studio. A Next.js frontend lets you browse books, view details and recommendations, and ask questions about the collection.

## Tech Stack

| Layer | Technologies |
|-------|----------------|
| **Scraper** | Python, Selenium, BeautifulSoup, Chrome WebDriver |
| **Backend** | FastAPI, Uvicorn, SQLAlchemy, PyMySQL, Pydantic |
| **Vector Store** | ChromaDB, Sentence-Transformers (`all-MiniLM-L6-v2`) |
| **LLM** | LM Studio (local OpenAI-compatible API, e.g. Mistral 7B) |
| **Database** | MySQL |
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4 |

## Project Structure

```
Document-Intelligence-Platfrom/
├── scraper/          # Book scraper (books.toscrape.com)
│   ├── scraper.py
│   ├── requirements.txt
│   └── data/books.json
├── backend/          # FastAPI API, embeddings, LLM integration
│   ├── main.py
│   ├── routers/
│   ├── services/
│   └── requirements.txt
└── frontend/         # Next.js web UI
    ├── app/
    └── package.json
```

## Prerequisites

- **Python 3.11+** (3.13 tested)
- **Node.js 18+** and npm
- **MySQL** server running locally
- **Google Chrome** (for the scraper)
- **LM Studio** with an OpenAI-compatible server on `http://localhost:1234` (for Q&A and AI insights)

## Setup Instructions

Follow these steps **in order**.

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd Document-Intelligence-Platfrom
```

### 2. Configure MySQL

Create a database (example name: `context_iq`):

```sql
CREATE DATABASE context_iq;
```

### 3. Configure backend environment

Create `backend/.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=context_iq
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
```

### 4. Set up the scraper

```bash
cd scraper
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
python scraper.py
```

Scraped books are written to `scraper/data/books.json`.

### 5. Set up the backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

pip install -r requirements.txt
```

Import scraped books into MySQL (tables are created by the models/session usage as needed):

```bash
python import_books.py
```

Optional — generate AI summaries/genres (requires LM Studio running):

```bash
python generate_insights.py
```

Optional — build vector embeddings for RAG Q&A (uncomment logic in `run_embeddings.py` / use embedding services as configured):

```bash
python run_embeddings.py
```

### 6. Set up the frontend

```bash
cd frontend
npm install
```

## How to Run Each Service

Run each service in its **own terminal**. Start backend before frontend.

### Backend (FastAPI)

```bash
cd backend
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux

uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

- API base: [http://localhost:8000](http://localhost:8000)
- Interactive docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend (Next.js)

```bash
cd frontend
npm run dev
```

- App: [http://localhost:3000](http://localhost:3000)

### Scraper (one-off data collection)

```bash
cd scraper
venv\Scripts\activate          # Windows
# source venv/bin/activate     # macOS / Linux

python scraper.py
```

### LM Studio (for Q&A / insights)

1. Open LM Studio and load a chat model (e.g. `mistralai/mistral-7b-instruct-v0.3`).
2. Start the local server on port **1234** (OpenAI-compatible API).
3. Keep it running while using `/api/ask` or `generate_insights.py`.

## API Endpoints

Base URL: `http://localhost:8000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/hello` | Health check — confirms the API is running |
| `GET` | `/api/books/` | List all books |
| `GET` | `/api/books/{id}` | Get a single book by ID |
| `GET` | `/api/books/{id}/recommendations` | Get up to 5 recommended books (same rating) |
| `POST` | `/api/books/upload` | Create/upload a new book |
| `POST` | `/api/ask` | Ask a natural-language question (RAG + LLM) |

### Example requests

**Health check**

```bash
curl http://localhost:8000/api/hello
```

**List books**

```bash
curl http://localhost:8000/api/books/
```

**Ask a question**

```bash
curl -X POST http://localhost:8000/api/ask \
  -H "Content-Type: application/json" \
  -d "{\"question\": \"Which books are about mystery?\"}"
```

**Upload a book**

```bash
curl -X POST http://localhost:8000/api/books/upload \
  -H "Content-Type: application/json" \
  -d "{
    \"title\": \"Example Book\",
    \"price\": 12.99,
    \"rating\": 4,
    \"url\": \"http://example.com/book\",
    \"description\": \"A short description.\",
    \"upc\": \"abc123\",
    \"availability\": \"In stock\",
    \"num_reviews\": 3
  }"
```

### Frontend pages

| Path | Description |
|------|-------------|
| `/` | Browse all books |
| `/books/[id]` | Book detail and recommendations |
| `/ask` | Q&A interface |

## Notes

- Backend CORS allows `http://localhost:3000`.
- Frontend API client points at `http://localhost:8000` (`frontend/lib/api.js`).
- ChromaDB data is stored under `backend/chroma_db/` (local, gitignored).
- Never commit `backend/.env` or virtual environments.

## License

This project is intended for educational / portfolio use.

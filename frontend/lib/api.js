const API_BASE = "http://localhost:8000";

export async function getAllBooks() {
    const res = await fetch(`${API_BASE}/api/books/`);
    return res.json();
}

export async function getBook(id) {
    const res = await fetch(`${API_BASE}/api/books/${id}`);
    return res.json();
}

export async function getRecommendations(id) {
    const res = await fetch(`${API_BASE}/api/books/${id}/recommendations`);
    return res.json();
}

export async function askQuestion(question) {
    const res = await fetch(`${API_BASE}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
    });
    return res.json();
}
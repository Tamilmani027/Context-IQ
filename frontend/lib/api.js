const API_BASE = "http://localhost:8000";

// ── Helper: get auth header ──────────────────────────

function authHeaders() {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Books ────────────────────────────────────────────

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

// ── Ask (protected) ──────────────────────────────────

export async function askQuestion(question) {
    const res = await fetch(`${API_BASE}/api/ask`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            ...authHeaders(),
        },
        body: JSON.stringify({ question }),
    });
    if (res.status === 401) {
        if (typeof window !== "undefined") {
            window.location.href = "/auth/login";
        }
        throw new Error("Unauthorized");
    }
    return res.json();
}

// ── Auth ─────────────────────────────────────────────

export async function registerUser(email, password) {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.detail || "Registration failed");
    }
    return data;
}

export async function loginUser(email, password) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.detail || "Login failed");
    }
    // Store token in localStorage and sync to cookie for middleware
    localStorage.setItem("token", data.access_token);
    document.cookie = `token=${data.access_token}; path=/; max-age=${60 * 60 * 24}`;
    return data;
}

export async function getMe() {
    const res = await fetch(`${API_BASE}/api/auth/me`, {
        headers: authHeaders(),
    });
    if (!res.ok) return null;
    return res.json();
}

export function logoutUser() {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; max-age=0";
}
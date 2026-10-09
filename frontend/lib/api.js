// Use NEXT_PUBLIC_API_URL in production (set in Vercel dashboard).
// Falls back to local FastAPI server during development.
const rawApiBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
export const API_BASE = rawApiBase.replace(/\/+$/, "");

// ── Helper: get auth header ──────────────────────────

function authHeaders() {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    return token ? { Authorization: `Bearer ${token}` } : {};
}

// ── Books ────────────────────────────────────────────

export async function getAllBooks() {
    try {
        const res = await fetch(`${API_BASE}/api/books/`, { cache: "no-store" });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error("Error fetching books:", err);
        return [];
    }
}

export async function getBook(id) {
    try {
        const res = await fetch(`${API_BASE}/api/books/${id}`, { cache: "no-store" });
        if (!res.ok) return null;
        return await res.json();
    } catch (err) {
        console.error(`Error fetching book ${id}:`, err);
        return null;
    }
}

export async function getRecommendations(id) {
    try {
        const res = await fetch(`${API_BASE}/api/books/${id}/recommendations`, { cache: "no-store" });
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error(`Error fetching recommendations for book ${id}:`, err);
        return [];
    }
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

export async function forgotPassword(email) {
    const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.detail || "Forgot password failed");
    }
    return data;
}

export async function resetPassword(token, new_password) {
    const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, new_password }),
    });
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.detail || "Password reset failed");
    }
    return data;
}

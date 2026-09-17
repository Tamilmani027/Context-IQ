"use client";
import { useState } from "react";
import { forgotPassword } from "@/lib/api";
import Link from "next/link";
import AuthNavbar from "../AuthNavbar";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);
        try {
            const data = await forgotPassword(email);
            setMessage(data.message || "Reset link sent successfully");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login-page-wrapper">
            {/* Background */}
            <div className="login-bg" />

            {/* Auth Navbar */}
            <AuthNavbar />

            {/* Card */}
            <div className="login-card">
                {/* Header */}
                <h1 className="login-title">Forgot Password</h1>
                <p className="login-subtitle">Enter your email to receive a reset link.</p>

                {/* Form */}
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label className="form-label">E-Mail Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email..."
                            required
                            className="form-input"
                        />
                    </div>

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="login-error" style={{ background: "rgba(34, 197, 94, 0.1)", borderColor: "rgba(34, 197, 94, 0.3)", color: "#15803d" }}>
                            {message}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="signin-btn"
                    >
                        {loading ? (
                            <span className="signin-loading">
                                <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" opacity="0.25" />
                                    <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75" />
                                </svg>
                                Sending...
                            </span>
                        ) : "Send Reset Link"}
                    </button>
                </form>

                {/* Footer */}
                <p className="login-footer">
                    Remember your password?{" "}
                    <Link href="/auth/login" className="signup-link">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}

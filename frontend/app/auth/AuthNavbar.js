"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthNavbar() {
    const pathname = usePathname();
    const isLogin = pathname === "/auth/login";
    const isRegister = pathname === "/auth/register";

    return (
        <nav className="auth-navbar">
            <Link href="/" className="auth-navbar-brand">
                <span className="auth-navbar-title">Context-IQ</span>
            </Link>

            <div className="auth-navbar-links">
                <Link
                    href="/auth/login"
                    className={`auth-navbar-link ${isLogin ? "auth-navbar-link-active" : ""}`}
                >
                    Login
                </Link>
                <Link
                    href="/auth/register"
                    className={`auth-navbar-link auth-navbar-link-accent ${isRegister ? "auth-navbar-link-active" : ""}`}
                >
                    Sign Up
                </Link>
            </div>
        </nav>
    );
}

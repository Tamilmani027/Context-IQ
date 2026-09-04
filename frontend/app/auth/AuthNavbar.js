"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function AuthNavbar() {
    const pathname = usePathname();
    const isLogin = pathname === "/auth/login";
    const isRegister = pathname === "/auth/register";

    return (
        <nav className="auth-navbar">
            <Link href="/" className="auth-navbar-brand">
                <Image
                    src="/context-iq-logo.svg"
                    alt="Context-IQ"
                    width={80}
                    height={80}
                    className="h-10 w-auto object-contain"
                    style={{ height: "50px", width: "auto" }}
                    priority
                />
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

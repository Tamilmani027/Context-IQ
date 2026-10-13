"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getMe, logoutUser } from "@/lib/api";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
            getMe()
                .then((userData) => {
                    if (userData) setUser(userData);
                    else setUser(null);
                })
                .catch(() => setUser(null))
                .finally(() => setAuthChecked(true));
        } else {
            setUser(null);
            setAuthChecked(true);
        }
    }, [pathname]);

    function handleLogout() {
        logoutUser();
        setUser(null);
        router.push("/");
        router.refresh();
    }

    const isLanding = pathname === "/";
    const isAuthPage = pathname?.startsWith("/auth");

    return (
        <header className={`${isAuthPage ? "static" : "sticky"} top-0 z-40 w-full border-b border-[#E5DFD5] bg-[#313F3B]/95 backdrop-blur-md transition-all`}>
            <div className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-x-4 gap-y-3 px-6 py-3 sm:px-10 lg:px-12">
                {/* Brand Logo */}
                <Link href="/" className="group flex items-center gap-2.5 transition-opacity hover:opacity-85">
                    <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-white transition-transform duration-200 group-hover:scale-105"
                    >
                        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    <span className="font-editorial text-2xl font-bold tracking-tight text-white">
                        Context-IQ
                    </span>
                </Link>

                {/* Navigation Links & Auth Actions */}
                <nav className="flex items-center gap-3 sm:gap-6">
                    {isLanding && (
                        <a
                            href="#how-it-works"
                            className="hidden text-sm font-medium text-white/80 transition-colors hover:text-white sm:inline-block"
                        >
                            How it works
                        </a>
                    )}

                    {authChecked && (
                        <>
                            {user ? (
                                <div className="flex items-center gap-3">
                                    <Link
                                        href="/books"
                                        className="hidden text-sm font-medium text-white/80 transition-colors hover:text-white md:inline-block"
                                    >
                                        Browse Books
                                    </Link>
                                    <Link
                                        href="/ask"
                                        className="hidden text-sm font-medium text-white/80 transition-colors hover:text-white md:inline-block"
                                    >
                                        Ask AI
                                    </Link>
                                    <span className="hidden max-w-[150px] truncate text-xs text-white/70 lg:inline-block">
                                        {user.email}
                                    </span>
                                    <Link
                                        href="/books"
                                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#2A352B] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#1E271F] hover:shadow"
                                    >
                                        <span>Dashboard</span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                            <line x1="7" y1="17" x2="17" y2="7" />
                                            <polyline points="7 7 17 7 17 17" />
                                        </svg>
                                    </Link>
                                    <button
                                        onClick={handleLogout}
                                        className="rounded-lg border border-white/30 bg-transparent px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                                    >
                                        Log out
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2.5 sm:gap-3">
                                    <Link
                                        href="/auth/register"
                                        className="text-sm font-medium text-white/80 transition-colors hover:text-white px-2 py-1.5"
                                    >
                                        Sign Up
                                    </Link>
                                    <Link
                                        href="/auth/login"
                                        className="inline-flex items-center gap-1.5 rounded-lg border border-white/40 bg-transparent px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/10 hover:border-white/60"
                                    >
                                        <span>Log in</span>
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                                            <line x1="7" y1="17" x2="17" y2="7" />
                                            <polyline points="7 7 17 7 17 17" />
                                        </svg>
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}

"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { getMe, logoutUser } from "@/lib/api";

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            getMe()
                .then((data) => {
                    if (data) setUser(data);
                    else setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setUser(null);
            setLoading(false);
        }
    }, [pathname]);

    function handleLogout() {
        logoutUser();
        setUser(null);
        router.push("/");
    }

    // Hide navbar on auth pages
    if (pathname?.startsWith("/auth")) return null;

    const isBooks = pathname?.startsWith("/books") || pathname === "/";
    const isAsk = pathname?.startsWith("/ask");

    return (
        <nav className="w-full bg-[#faf8f5] border-b border-[#e8e4df]">
            <div className="w-full max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
                {/* App Logo - Left side */}
                <Link href="/books" className="flex items-center gap-2.5 cursor-pointer">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#6e46e6] text-white shadow-sm">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <rect width="14" height="18" x="5" y="3" rx="2" />
                            <path d="M9 7h6" />
                            <path d="M12 17h.01" />
                        </svg>
                    </div>
                    <span className="font-bold text-stone-900 text-lg tracking-tight">Context-IQ</span>
                </Link>

                {/* Navigation links - Right side */}
                <div className="flex min-w-0 flex-wrap items-center justify-end gap-1.5 sm:gap-2">
                    <Link href="/books">
                        <div
                            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors cursor-pointer ${
                                isBooks
                                    ? "bg-[#e8e5e0] text-stone-900"
                                    : "text-stone-600 hover:text-stone-900"
                            }`}
                        >
                            Books
                        </div>
                    </Link>
                    <Link href="/ask">
                        <div
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                                isAsk
                                    ? "bg-[#e8e5e0] text-stone-900 font-semibold"
                                    : "text-stone-600 hover:text-stone-900"
                            }`}
                        >
                            Ask AI
                        </div>
                    </Link>

                    {/* Auth buttons */}
                    {!loading && (
                        <>
                            {user ? (
                                <div className="flex items-center gap-2 ml-2 sm:ml-3 sm:border-l sm:border-[#e8e4df] sm:pl-3">
                                    <span className="hidden max-w-48 truncate text-stone-600 text-xs sm:text-sm lg:block">
                                        {user.email}
                                    </span>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-[#e8e5e0] text-stone-700 hover:text-stone-900 px-3 py-1.5 rounded-lg font-medium text-xs sm:text-sm transition-colors cursor-pointer"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1.5 ml-2 sm:ml-3 sm:border-l sm:border-[#e8e4df] sm:pl-3">
                                    <Link href="/auth/login">
                                        <div className="text-stone-600 hover:text-stone-900 px-2.5 py-1.5 rounded-lg font-medium text-xs sm:text-sm cursor-pointer transition-colors">
                                            Login
                                        </div>
                                    </Link>
                                    <Link href="/auth/register">
                                        <div className="bg-[#6e46e6] hover:bg-[#5b36d6] text-white px-3 py-1.5 rounded-lg font-medium text-xs sm:text-sm cursor-pointer transition-colors shadow-sm">
                                            Sign Up
                                        </div>
                                    </Link>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

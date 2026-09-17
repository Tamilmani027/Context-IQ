"use client";
import Link from "next/link";
import Image from "next/image";
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

    return (
        <nav className="w-full bg-[#FAFAFA] px-4 py-2 sm:px-6 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-gray-100">
            {/* App name - Left side */}
            <Link href="/">
                <div className="flex items-center cursor-pointer">
                    <Image
                        src="/context-iq-logo.svg"
                        alt="Context-IQ"
                        width={80}
                        height={80}
                        className="h-14 w-auto object-contain sm:h-16"
                        priority
                    />
                </div>
            </Link>

            {/* Navigation links - Right side */}
            <div className="flex min-w-0 flex-wrap items-center justify-end gap-1 sm:gap-2">
                <Link href="/books">
                    <div className="bg-gray-200/70 text-gray-900 px-3 py-1.5 rounded-md font-medium text-sm cursor-pointer transition-colors sm:px-4">
                        Books
                    </div>
                </Link>
                <Link href="/ask">
                    <div className="text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-md font-medium text-sm cursor-pointer transition-colors sm:px-4">
                        Ask AI
                    </div>
                </Link>

                {/* Auth buttons */}
                {!loading && (
                    <>
                        {user ? (
                            <div className="flex items-center gap-2 sm:ml-3 sm:border-l sm:border-gray-200 sm:pl-3">
                                <span className="hidden max-w-48 truncate text-gray-600 text-sm lg:block">{user.email}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-gray-200/70 text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-md font-medium text-sm transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 sm:ml-3 sm:border-l sm:border-gray-200 sm:pl-3 sm:gap-2">
                                <Link href="/auth/login">
                                    <div className="text-gray-500 hover:text-gray-900 px-2.5 py-1.5 rounded-md font-medium text-sm cursor-pointer transition-colors sm:px-3">
                                        Login
                                    </div>
                                </Link>
                                <Link href="/auth/register">
                                    <div className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1.5 rounded-md font-medium text-sm cursor-pointer transition-colors sm:px-4">
                                        Sign Up
                                    </div>
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </nav>
    );
}

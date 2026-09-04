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
        <nav className="w-full bg-[#FAFAFA] px-8 pt-4 pb-2 flex items-center justify-between border-b border-gray-100">
            {/* App name - Left side */}
            <Link href="/">
                <div className="flex items-center cursor-pointer">
                    <Image
                        src="/context-iq-logo.svg"
                        alt="Context-IQ"
                        width={80}
                        height={80}
                        className="h-20 w-auto object-contain"
                        priority
                    />
                </div>
            </Link>

            {/* Navigation links - Right side */}
            <div className="flex items-center gap-2">
                <Link href="/books">
                    <div className="bg-gray-200/70 text-gray-900 px-4 py-1.5 rounded-md font-medium text-sm cursor-pointer transition-colors">
                        Books
                    </div>
                </Link>
                <Link href="/ask">
                    <div className="text-gray-500 hover:text-gray-900 px-4 py-1.5 rounded-md font-medium text-sm cursor-pointer transition-colors">
                        Ask AI
                    </div>
                </Link>

                {/* Auth buttons */}
                {!loading && (
                    <>
                        {user ? (
                            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                                <span className="text-gray-600 text-sm">{user.email}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-gray-200/70 text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-md font-medium text-sm transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
                                <Link href="/auth/login">
                                    <div className="text-gray-500 hover:text-gray-900 px-3 py-1.5 rounded-md font-medium text-sm cursor-pointer transition-colors">
                                        Login
                                    </div>
                                </Link>
                                <Link href="/auth/register">
                                    <div className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-1.5 rounded-md font-medium text-sm cursor-pointer transition-colors">
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
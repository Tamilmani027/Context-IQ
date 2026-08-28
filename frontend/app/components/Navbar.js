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

    return (
        <nav className="w-full bg-[#FAFAFA] px-8 py-4 flex items-center justify-between border-b border-gray-100">
            {/* App name - Left side */}
            <Link href="/">
                <div className="flex items-center gap-2 cursor-pointer">
                    <div className="bg-indigo-500 text-white p-1.5 rounded-lg flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book"><path d="M4 19.5v-15A2.5 2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 2.5 0 0 1 0-5H20"/></svg>
                    </div>
                    <span className="text-gray-900 text-xl font-bold font-serif tracking-tight">
                        Context-IQ
                    </span>
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
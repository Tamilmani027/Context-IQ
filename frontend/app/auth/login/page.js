"use client";
import { useState } from "react";
import { loginUser } from "@/lib/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await loginUser(email, password);
            router.push("/ask");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="bg-gray-800 rounded-xl p-8 w-full max-w-md shadow-2xl">
                <h1 className="text-white text-2xl font-bold mb-2 text-center">Welcome Back</h1>
                <p className="text-gray-400 text-center mb-6">Sign in to your account</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="text-gray-300 text-sm font-medium block mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                            className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                        />
                    </div>
                    <div>
                        <label className="text-gray-300 text-sm font-medium block mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            className="w-full bg-gray-700 text-white rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white font-semibold py-3 rounded-lg transition-colors"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className="text-gray-400 text-center mt-6 text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/auth/register" className="text-blue-400 hover:text-blue-300 font-medium">
                        Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}

"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CallbackHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = searchParams.get("token");
        const errorParam = searchParams.get("error");

        if (errorParam) {
            setError(decodeURIComponent(errorParam));
            setTimeout(() => router.push("/auth/login"), 3000);
            return;
        }

        if (token) {
            // Store token in localStorage and sync to cookie for middleware
            localStorage.setItem("token", token);
            document.cookie = `token=${token}; path=/; max-age=${60 * 60 * 24}`;
            router.push("/ask");
        } else {
            setError("No authentication token received.");
            setTimeout(() => router.push("/auth/login"), 3000);
        }
    }, [searchParams, router]);

    return (
        <div className="callback-wrapper">
            <div className="callback-bg" />
            <div className="callback-card">
                {error ? (
                    <>
                        <div className="callback-icon callback-icon-error">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="15" y1="9" x2="9" y2="15" />
                                <line x1="9" y1="9" x2="15" y2="15" />
                            </svg>
                        </div>
                        <h2 className="callback-title">Authentication Failed</h2>
                        <p className="callback-text">{error}</p>
                        <p className="callback-redirect">Redirecting to login...</p>
                    </>
                ) : (
                    <>
                        <div className="callback-icon">
                            <svg className="callback-spinner" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#4f46e5" strokeWidth="2">
                                <circle cx="12" cy="12" r="10" opacity="0.2" />
                                <path d="M12 2a10 10 0 0 1 10 10" />
                            </svg>
                        </div>
                        <h2 className="callback-title">Signing you in...</h2>
                        <p className="callback-text">Please wait while we complete authentication.</p>
                    </>
                )}
            </div>

            <style jsx>{`
                .callback-wrapper {
                    position: fixed;
                    inset: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 50;
                }

                .callback-bg {
                    position: absolute;
                    inset: 0;
                    background:
                        linear-gradient(180deg,
                            rgba(180, 210, 240, 0.9) 0%,
                            rgba(200, 220, 245, 0.7) 20%,
                            rgba(220, 230, 250, 0.5) 40%,
                            rgba(240, 240, 255, 0.3) 60%,
                            rgba(210, 195, 180, 0.5) 80%,
                            rgba(185, 165, 145, 0.7) 100%
                        );
                    background-color: #b4d2f0;
                }

                .callback-card {
                    position: relative;
                    background: rgba(255, 255, 255, 0.55);
                    backdrop-filter: blur(24px);
                    -webkit-backdrop-filter: blur(24px);
                    border: 1px solid rgba(255, 255, 255, 0.6);
                    border-radius: 24px;
                    padding: 48px 40px;
                    text-align: center;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
                    animation: cardIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }

                @keyframes cardIn {
                    from { opacity: 0; transform: translateY(20px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }

                .callback-icon {
                    margin-bottom: 16px;
                }

                .callback-icon-error {
                    animation: shake 0.4s ease;
                }

                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    25% { transform: translateX(-6px); }
                    75% { transform: translateX(6px); }
                }

                .callback-spinner {
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    to { transform: rotate(360deg); }
                }

                .callback-title {
                    font-size: 1.3rem;
                    font-weight: 700;
                    color: #1a1a2e;
                    margin: 0 0 8px;
                }

                .callback-text {
                    font-size: 0.9rem;
                    color: #6b7280;
                    margin: 0;
                }

                .callback-redirect {
                    font-size: 0.8rem;
                    color: #9ca3af;
                    margin-top: 12px;
                }
            `}</style>
        </div>
    );
}

export default function CallbackPage() {
    return (
        <Suspense fallback={
            <div style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "#b4d2f0" }}>
                <p style={{ color: "#1a1a2e", fontSize: "1rem" }}>Loading...</p>
            </div>
        }>
            <CallbackHandler />
        </Suspense>
    );
}

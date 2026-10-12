"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getMe, logoutUser } from "@/lib/api";

export default function LandingPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

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
      setAuthChecked(true);
    }
  }, []);

  function handleLogout() {
    logoutUser();
    setUser(null);
    router.refresh();
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/ask?q=${encodeURIComponent(searchQuery.trim())}`);
  }

  return (
    <div className="landing-page-root min-h-screen bg-[#F4F0EB] text-[#1C1A17] font-sans antialiased selection:bg-[#E2DDD3] selection:text-[#1C1A17]">
      {/* ── Top Navigation Bar ───────────────────────────────── */}
      <header className="sticky top-0 z-40 w-full border-b border-[#E5DFD5] bg-[#F4F0EB]/90 backdrop-blur-md transition-all">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 sm:px-10 lg:px-12">
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
              className="text-[#1C1A17] transition-transform duration-200 group-hover:scale-105"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span className="font-editorial text-2xl font-bold tracking-tight text-[#1C1A17]">
              Context-IQ
            </span>
          </Link>

          {/* Navigation Links & Auth Actions */}
          <nav className="flex items-center gap-3 sm:gap-6">
            <a
              href="#how-it-works"
              className="hidden text-sm font-medium text-[#5C564E] transition-colors hover:text-[#1C1A17] sm:inline-block"
            >
              How it works
            </a>

            {authChecked && (
              <>
                {user ? (
                  <div className="flex items-center gap-3">
                    <Link
                      href="/books"
                      className="hidden text-sm font-medium text-[#5C564E] transition-colors hover:text-[#1C1A17] md:inline-block"
                    >
                      Browse Books
                    </Link>
                    <Link
                      href="/ask"
                      className="hidden text-sm font-medium text-[#5C564E] transition-colors hover:text-[#1C1A17] md:inline-block"
                    >
                      Ask AI
                    </Link>
                    <span className="hidden max-w-[150px] truncate text-xs text-[#7A746B] lg:inline-block">
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
                      className="rounded-lg border border-[#D5CEC4] bg-transparent px-3 py-1.5 text-xs font-medium text-[#5C564E] transition-colors hover:bg-[#EAE4D9] hover:text-[#1C1A17]"
                    >
                      Log out
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <Link
                      href="/auth/register"
                      className="text-sm font-medium text-[#5C564E] transition-colors hover:text-[#1C1A17] px-2 py-1.5"
                    >
                      Sign Up
                    </Link>
                    <Link
                      href="/auth/login"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-[#D1CCC2] bg-transparent px-4 py-2 text-sm font-medium text-[#1C1A17] transition-all hover:bg-[#EAE4D9] hover:border-[#BDB5A8]"
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

      {/* ── Main Container ──────────────────────────────────── */}
      <main className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-12">
        {/* ── Hero Section ──────────────────────────────────── */}
        <section className="pt-14 pb-20 sm:pt-20 sm:pb-28 lg:pt-24 lg:pb-32">
          <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-12 xl:gap-16">
            {/* Left Hero Column */}
            <div className="lg:col-span-6 xl:col-span-5">
              {/* Eyebrow */}
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#6B655D]">
                <span>—</span>
                <span>BOOKS, MEET INTELLIGENCE.</span>
              </div>

              {/* Headline */}
              <h1 className="font-editorial mt-5 text-5xl font-normal leading-[1.08] tracking-tight text-[#1C1A17] sm:text-6xl lg:text-[68px]">
                Your collection,
                <br />
                in context.
              </h1>

              {/* Description */}
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-[#5C564E] sm:text-[19px]">
                Discover books, follow connections, and ask better questions. Context-IQ turns a collection into a conversation.
              </p>

              {/* Primary Call to Action */}
              <div className="mt-9">
                <Link
                  href="/books"
                  className="group inline-flex items-center gap-2 rounded-lg bg-[#2A352B] px-7 py-4 text-base font-medium text-white shadow-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1E271F] hover:shadow-lg"
                >
                  <span>Explore the collection</span>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </Link>
                <p className="mt-3.5 text-xs text-[#7A746B]">
                  Browse with curiosity. Find something unexpected.
                </p>
              </div>
            </div>

            {/* Right Hero Column: Product Preview Card */}
            <div className="lg:col-span-6 xl:col-span-7">
              <div className="relative rounded-2xl border border-[#E3DDD4] bg-white p-6 shadow-[0_20px_50px_rgba(30,26,20,0.06)] sm:p-7 md:p-8">
                {/* Preview Header */}
                <div className="flex items-center justify-between border-b border-[#F0EBE3] pb-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-[#1C1A17]">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-[#1C1A17]">
                      <rect x="3" y="7" width="3" height="13" rx="1.5" />
                      <rect x="10.5" y="3" width="3" height="17" rx="1.5" />
                      <rect x="18" y="10" width="3" height="10" rx="1.5" />
                    </svg>
                    <span>The collection</span>
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#888177]">
                    PRODUCT PREVIEW
                  </span>
                </div>

                {/* Search Bar / Perspective Title */}
                <div className="mt-5 mb-6">
                  {isSearching ? (
                    <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                      <input
                        type="text"
                        autoFocus
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search themes, books, questions..."
                        className="w-full rounded-xl border border-[#D5CEC4] bg-[#FAF8F5] px-4 py-2.5 text-sm text-[#1C1A17] focus:border-[#2A352B] focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="absolute right-2 rounded-lg bg-[#2A352B] px-3 py-1 text-xs text-white"
                      >
                        Search
                      </button>
                    </form>
                  ) : (
                    <div
                      onClick={() => setIsSearching(true)}
                      className="group flex cursor-pointer items-center justify-between rounded-xl p-1 transition-colors hover:bg-[#F9F7F4]"
                    >
                      <h2 className="font-editorial text-2xl font-normal tracking-tight text-[#1C1A17] sm:text-[28px]">
                        Find your next perspective.
                      </h2>
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg text-[#5C564E] transition-colors group-hover:bg-[#EAE4D9] group-hover:text-[#1C1A17]">
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <circle cx="11" cy="11" r="7" />
                          <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3 Books Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-3.5">
                  {/* Book 1: Frankenstein */}
                  <Link href="/books" className="group block">
                    <div className="relative flex h-48 flex-col justify-between overflow-hidden rounded-xl bg-[#313F3B] p-4 text-white shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md">
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-white/70">
                          MARY SHELLEY
                        </span>
                        <h3 className="font-editorial mt-1 text-lg font-normal leading-snug text-white">
                          Frankenstein
                        </h3>
                      </div>
                      {/* Geometric Line Graphic */}
                      <div className="pointer-events-none absolute -bottom-1 left-0 right-0 flex justify-center opacity-40">
                        <svg viewBox="0 0 160 80" className="h-16 w-full" fill="none">
                          <circle cx="65" cy="80" r="48" stroke="white" strokeWidth="1.2" />
                          <circle cx="95" cy="80" r="44" stroke="white" strokeWidth="1.2" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-2.5">
                      <div className="text-sm font-medium text-[#1C1A17] group-hover:underline">
                        Frankenstein
                      </div>
                      <div className="text-xs text-[#7A746B]">Gothic fiction</div>
                    </div>
                  </Link>

                  {/* Book 2: The Time Machine */}
                  <Link href="/books" className="group block">
                    <div className="relative flex h-48 flex-col justify-between overflow-hidden rounded-xl bg-[#CBBBA0] p-4 text-[#1C1A17] shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md">
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-[#1C1A17]/70">
                          H. G. WELLS
                        </span>
                        <h3 className="font-editorial mt-1 text-lg font-normal leading-snug text-[#1C1A17]">
                          The Time Machine
                        </h3>
                      </div>
                      {/* Geometric Line Graphic */}
                      <div className="pointer-events-none absolute -bottom-1 left-0 right-0 flex justify-center opacity-35">
                        <svg viewBox="0 0 160 80" className="h-16 w-full" fill="none">
                          <path d="M 52 80 V 30 A 28 28 0 0 1 108 30 V 80" stroke="#1C1A17" strokeWidth="1.2" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-2.5">
                      <div className="text-sm font-medium text-[#1C1A17] group-hover:underline">
                        The Time Machine
                      </div>
                      <div className="text-xs text-[#7A746B]">Science fiction</div>
                    </div>
                  </Link>

                  {/* Book 3: The Last Man */}
                  <Link href="/books" className="group block">
                    <div className="relative flex h-48 flex-col justify-between overflow-hidden rounded-xl bg-[#9E5743] p-4 text-white shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md">
                      <div>
                        <span className="font-mono text-[9px] uppercase tracking-wider text-white/70">
                          MARY SHELLEY
                        </span>
                        <h3 className="font-editorial mt-1 text-lg font-normal leading-snug text-white">
                          The Last Man
                        </h3>
                      </div>
                      {/* Geometric Line Graphic */}
                      <div className="pointer-events-none absolute -bottom-1 left-0 right-0 flex justify-center opacity-40">
                        <svg viewBox="0 0 160 80" className="h-16 w-full" fill="none">
                          <line x1="15" y1="76" x2="145" y2="76" stroke="white" strokeWidth="1.2" />
                          <path d="M 46 76 A 34 34 0 0 1 114 76" stroke="white" strokeWidth="1.2" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-2.5">
                      <div className="text-sm font-medium text-[#1C1A17] group-hover:underline">
                        The Last Man
                      </div>
                      <div className="text-xs text-[#7A746B]">Dystopian fiction</div>
                    </div>
                  </Link>
                </div>

                {/* AI Interactive Answer Card */}
                <Link
                  href="/ask?q=Which+books+explore+the+consequences+of+scientific+ambition%3F"
                  className="group mt-6 block rounded-xl border border-[#D5DDD2] bg-[#EBF0E9] p-4.5 transition-all duration-200 hover:border-[#BFCCBC] hover:bg-[#E5ECE3] sm:p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="text-[#3C4A3A]"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      <span className="text-sm font-medium text-[#1C1A17]">
                        Which books explore the consequences of scientific ambition?
                      </span>
                    </div>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      className="text-[#566354] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-[#4E564C] sm:text-[13px]">
                    Start with Frankenstein, where creation becomes a moral dilemma. The Time Machine offers another lens: progress and its unintended consequences.
                  </p>
                  <div className="mt-3 font-mono text-[10px] uppercase tracking-wider text-[#616B5E]">
                    EXPLORE · Frankenstein / The Time Machine
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 2: A More Thoughtful Way to Explore ─────── */}
        <section id="how-it-works" className="border-t border-[#E3DDD4] pt-14 pb-20 sm:pt-16 sm:pb-24">
          {/* Header Row */}
          <div className="flex flex-col justify-between gap-2 pb-10 sm:flex-row sm:items-center">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#7A746B]">
              A MORE THOUGHTFUL WAY TO EXPLORE
            </span>
            <span className="text-xs text-[#7A746B]">
              From discovery to understanding
            </span>
          </div>

          {/* 3 Columns */}
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8 lg:gap-14">
            {/* Column 01 */}
            <Link href="/books" className="group block">
              <span className="font-mono text-xs text-[#7A746B]">01 /</span>
              <h2 className="font-editorial mt-2.5 mb-3 text-2xl font-normal text-[#1C1A17] transition-colors group-hover:text-[#2A352B] sm:text-3xl">
                Browse with intention.
              </h2>
              <p className="text-sm leading-relaxed text-[#5C564E]">
                Explore the collection and discover books that speak to your interests, one title at a time.
              </p>
            </Link>

            {/* Column 02 */}
            <Link href="/books" className="group block">
              <span className="font-mono text-xs text-[#7A746B]">02 /</span>
              <h2 className="font-editorial mt-2.5 mb-3 text-2xl font-normal text-[#1C1A17] transition-colors group-hover:text-[#2A352B] sm:text-3xl">
                Go beyond the cover.
              </h2>
              <p className="text-sm leading-relaxed text-[#5C564E]">
                Dive into book details and descriptions, then follow recommendations to related reads.
              </p>
            </Link>

            {/* Column 03 */}
            <Link href="/ask" className="group block">
              <span className="font-mono text-xs text-[#7A746B]">03 /</span>
              <h2 className="font-editorial mt-2.5 mb-3 text-2xl font-normal text-[#1C1A17] transition-colors group-hover:text-[#2A352B] sm:text-3xl">
                Ask, naturally.
              </h2>
              <p className="text-sm leading-relaxed text-[#5C564E]">
                Put your curiosity into words. Ask questions about the collection and find relevant books through conversation.
              </p>
            </Link>
          </div>
        </section>

        {/* ── Section 3: Under The Surface ────────────────────── */}
        <section id="under-the-surface" className="border-t border-[#E3DDD4] pt-14 pb-20 sm:pt-16 sm:pb-24">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-14">
            {/* Left Column */}
            <div className="lg:col-span-5">
              <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#7A746B]">
                UNDER THE SURFACE
              </span>
              <h2 className="font-editorial mt-3 mb-4 text-3xl font-normal text-[#1C1A17] sm:text-4xl">
                Built for context, end to end.
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-[#5C564E]">
                Scraped book data, semantic search across descriptions, and a local language model — brought together in a Next.js interface.
              </p>
            </div>

            {/* Right Column: Pipeline Architecture Flow */}
            <div className="flex flex-col gap-6 pt-2 sm:flex-row sm:items-center sm:justify-between lg:col-span-7 lg:pt-6">
              {/* Step 1: Collect */}
              <div className="rounded-xl border border-[#E3DDD4] bg-[#F7F4EE] p-5 sm:border-none sm:bg-transparent sm:p-0">
                <div className="text-sm font-semibold text-[#1C1A17]">Collect</div>
                <div className="mt-1 font-mono text-xs text-[#7A746B]">
                  Book data <span className="text-[#A59F94]">→</span> MySQL
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden text-xl font-light text-[#A8A196] sm:block">
                →
              </div>

              {/* Step 2: Connect */}
              <div className="rounded-xl border border-[#E3DDD4] bg-[#F7F4EE] p-5 sm:border-none sm:bg-transparent sm:p-0">
                <div className="text-sm font-semibold text-[#1C1A17]">Connect</div>
                <div className="mt-1 font-mono text-xs text-[#7A746B]">
                  Embeddings <span className="text-[#A59F94]">→</span> ChromaDB
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden text-xl font-light text-[#A8A196] sm:block">
                →
              </div>

              {/* Step 3: Converse */}
              <div className="rounded-xl border border-[#E3DDD4] bg-[#F7F4EE] p-5 sm:border-none sm:bg-transparent sm:p-0">
                <div className="text-sm font-semibold text-[#1C1A17]">Converse</div>
                <div className="mt-1 font-mono text-xs text-[#7A746B]">
                  Local LLM <span className="text-[#A59F94]">→</span> LM Studio
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Section 4: Footer ───────────────────────────────── */}
        <footer className="border-t border-[#E3DDD4] py-10">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#1C1A17]"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
              <span className="font-editorial text-xl font-bold tracking-tight text-[#1C1A17]">
                Context-IQ
              </span>
            </Link>

            {/* Tagline */}
            <div className="font-editorial text-base italic text-[#6E685F]">
              Good questions lead to good books.
            </div>

            {/* Auth Links */}
            <div className="flex items-center gap-4 text-sm font-medium">
              <Link
                href="/auth/register"
                className="text-[#5C564E] transition-colors hover:text-[#1C1A17]"
              >
                Sign Up
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex items-center gap-1 text-[#1C1A17] transition-colors hover:text-[#2A352B] hover:underline"
              >
                <span>Log in to Context-IQ</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

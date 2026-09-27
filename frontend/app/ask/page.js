"use client";

import { useState } from "react";
import { askQuestion } from "@/lib/api";

export default function AskPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleAsk() {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    setAnswer(null);
    try {
      setAnswer(await askQuestion(question));
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto w-full max-w-4xl pb-14 pt-4">
      <header className="mb-8">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-[#f0ebff] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6e46e6]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#6e46e6]" /> Knowledge assistant
        </span>
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
          Ask AI about books
        </h1>
        <p className="text-sm leading-relaxed text-stone-500">Ask anything about the books in your collection and get a sourced answer.</p>
      </header>

      <div className="rounded-2xl border border-[#e8e4df] bg-white p-5 shadow-sm sm:p-7">
        <label htmlFor="question" className="mb-2 block text-sm font-semibold text-stone-800">Your question</label>
        <textarea id="question" value={question} onChange={(e) => setQuestion(e.target.value)} onKeyDown={(e) => { if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleAsk(); }} placeholder="For example, which book would you recommend for a historical fiction fan?" aria-label="Question" className="h-36 w-full resize-none rounded-xl border border-[#e4dfd8] bg-[#fdfcfb] p-4 text-sm leading-relaxed text-stone-800 outline-none transition focus:border-[#a88df2] focus:ring-4 focus:ring-[#ede7ff]" />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-stone-400">Press Ctrl + Enter to ask</p>
          <button onClick={handleAsk} disabled={loading || !question.trim()} className="rounded-lg bg-[#6e46e6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#5b36d6] disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Thinking…" : "Ask AI"}</button>
        </div>
      </div>

      {answer && (
        <section className="mt-6 rounded-2xl border border-[#e8e4df] bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-4 flex items-center gap-2 text-[#6e46e6]"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#f0ebff] text-sm">✦</span><h2 className="text-base font-bold text-stone-900">Answer</h2></div>
          <p className="break-words whitespace-pre-wrap text-sm leading-7 text-stone-600">{answer.answer}</p>
          {answer.source_books?.length > 0 && <div className="mt-6 border-t border-[#eeeae5] pt-5"><p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">Sources</p><div className="flex flex-wrap gap-2">{answer.source_books.map((book, i) => <span key={i} className="max-w-full break-words rounded-full bg-[#f4f1ec] px-3 py-1.5 text-xs font-medium text-stone-600">{book}</span>)}</div></div>}
        </section>
      )}

      {error && <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>}
    </section>
  );
}

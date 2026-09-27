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
    <section className="mx-auto w-full max-w-3xl pb-14 pt-4">
      {/* Header */}
      <header className="mb-8">
        <span className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em]"
          style={{ backgroundColor: "#f0ebff", color: "#6e46e6" }}
        >
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "#6e46e6" }}
          />
          Knowledge assistant
        </span>
        <h1
          className="mb-2 text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Ask AI about books
        </h1>
        <p className="text-sm leading-relaxed text-stone-500">
          Ask anything about the books in your collection and get a sourced
          answer.
        </p>
      </header>

      {/* Question input card */}
      <div
        className="rounded-xl border bg-white p-5 sm:p-6"
        style={{ borderColor: "#e8e4df" }}
      >
        <label
          htmlFor="question"
          className="mb-2 block text-sm font-semibold text-stone-800"
        >
          Your question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") handleAsk();
          }}
          placeholder="For example, which book would you recommend for a historical fiction fan?"
          aria-label="Question"
          className="h-36 w-full resize-none rounded-xl border p-4 text-sm leading-relaxed text-stone-800 outline-none transition focus:ring-4"
          style={{
            borderColor: "#e4dfd8",
            backgroundColor: "#fdfcfb",
          }}
        />
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-stone-400">Press Ctrl + Enter to ask</p>
          <button
            onClick={handleAsk}
            disabled={loading || !question.trim()}
            className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition cursor-pointer hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{ backgroundColor: "#6e46e6" }}
          >
            {loading ? "Thinking…" : "Ask AI"}
          </button>
        </div>
      </div>

      {/* Answer card */}
      {answer && (
        <section
          className="mt-6 rounded-xl border bg-white p-5 sm:p-6"
          style={{ borderColor: "#e8e4df" }}
        >
          {/* Answer header */}
          <div className="mb-4 flex items-center gap-2">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg text-sm"
              style={{ backgroundColor: "#f0ebff", color: "#6e46e6" }}
            >
              ✦
            </span>
            <h2 className="text-base font-bold text-stone-900">Answer</h2>
          </div>

          {/* Answer body */}
          <p className="break-words whitespace-pre-wrap text-sm leading-7 text-stone-600">
            {answer.answer}
          </p>

          {/* Sources */}
          {answer.source_books?.length > 0 && (
            <div
              className="mt-6 border-t pt-5"
              style={{ borderColor: "#eeeae5" }}
            >
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Sources
              </p>
              <div className="flex flex-wrap gap-2">
                {answer.source_books.map((book, i) => (
                  <span
                    key={i}
                    className="max-w-full break-words rounded-full px-3 py-1.5 text-xs font-medium text-stone-600"
                    style={{ backgroundColor: "#f4f1ec" }}
                  >
                    {book}
                  </span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Error alert */}
      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          {error}
        </div>
      )}
    </section>
  );
}

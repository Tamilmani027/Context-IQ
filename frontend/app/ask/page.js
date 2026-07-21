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
      const result = await askQuestion(question);
      setAnswer(result);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="text-white text-3xl font-bold mb-2">Ask AI About Books</h1>
      <p className="text-gray-400 mb-6">Ask anything about the books in our collection.</p>

      {/* Question Input Card */}
      <div className="bg-gray-800 rounded-xl p-6">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask anything about books..."
          aria-label="Question"
          className="w-full bg-gray-700 text-white rounded-lg p-4 resize-none h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleAsk}
          disabled={loading}
          className="mt-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {loading ? "Thinking..." : "Ask AI"}
        </button>
      </div>

      {/* Answer Display */}
      {answer && (
        <div className="bg-gray-800 rounded-xl p-6 mt-6">
          <h2 className="text-white font-semibold text-lg mb-3">Answer</h2>
          <p className="text-gray-300 whitespace-pre-wrap">{answer.answer}</p>

          {/* Source Books */}
          {answer.source_books && answer.source_books.length > 0 && (
            <div className="mt-4">
              <p className="text-gray-400 mb-2">Sources:</p>
              <div className="flex flex-wrap gap-2">
                {answer.source_books.map((book, i) => (
                  <span
                    key={i}
                    className="bg-blue-600/20 text-blue-400 text-sm px-3 py-1 rounded-full"
                  >
                    {book}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-xl p-4 mt-6 text-red-400">
          {error}
        </div>
      )}
    </div>
  );
}

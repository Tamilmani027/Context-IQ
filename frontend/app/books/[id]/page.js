import Link from "next/link";
import { getBook, getRecommendations } from "@/lib/api";
import BookCard from "@/app/components/BookCard";

const getGenreColor = (genre) => {
  const value = genre?.toUpperCase() || "";
  if (value.includes("GAME")) return "bg-[#ebf5ff] text-[#2563eb]";
  if (value.includes("ROMANCE")) return "bg-[#fdf2f8] text-[#db2777]";
  if (value.includes("POLITICAL")) return "bg-[#f0fdf4] text-[#16a34a]";
  if (value.includes("THRILLER")) return "bg-[#fef2f2] text-[#dc2626]";
  if (value.includes("HISTORY") || value.includes("NON-FICTION")) return "bg-[#f0f9ff] text-[#0284c7]";
  if (value.includes("SELF HELP")) return "bg-[#faf5ff] text-[#7c3aed]";
  if (value.includes("HISTORICAL")) return "bg-[#fff7ed] text-[#ea580c]";
  return "bg-stone-100 text-stone-600";
};

export default async function BookDetail({ params }) {
  const { id } = await params;
  const book = await getBook(id);
  const recommendations = await getRecommendations(id);

  const rating = Math.round(book?.rating || 0);
  const stars = Array(5).fill(0).map((_, i) => (
    <span key={i} className={i < rating ? "text-amber-500" : "text-stone-200"}>
      ★
    </span>
  ));

  return (
    <div className="w-full pb-16 pt-2">
      {/* Back button */}
      <Link
        href="/books"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-stone-500 transition-colors hover:text-stone-800"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
        Back to Books
      </Link>

      {/* Book Header */}
      <div className="mb-8">
        {/* Genre Badge */}
        {book?.genre && (
          <div className="mb-3">
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getGenreColor(book.genre)}`}>
              {book.genre}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="mb-1.5 break-words font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          {book?.title}
        </h1>

        {/* Author */}
        <p className="mb-3 text-sm text-stone-500">
          {book?.author || "Unknown Author"}
        </p>

        {/* Rating, Price, Reviews */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <div className="flex tracking-tight text-sm" aria-label={`${book?.rating || 0} out of 5 stars`}>
            {stars}
          </div>
          <span>{book?.rating || 0}/5</span>
          <span>·</span>
          <span>£{book?.price}</span>
          <span>·</span>
          <span>{book?.num_reviews || 0} reviews</span>
        </div>
      </div>

      {/* Main Content Cards */}
      <div className="space-y-6">
        {/* Description Card */}
        <div className="rounded-2xl border border-[#e8e4df] bg-white p-6 shadow-sm sm:p-7">
          <h2 className="mb-3 font-serif text-lg font-bold text-stone-900">
            Description
          </h2>
          <p className="text-xs sm:text-sm leading-relaxed text-stone-600">
            {book?.description
              ? `${book.description} ...more`
              : "No description available"}
          </p>
        </div>

        {/* Book Info Card */}
        <div className="rounded-2xl border border-[#e8e4df] bg-white p-6 shadow-sm sm:p-7">
          <h2 className="mb-6 font-serif text-lg font-bold text-stone-900">
            Book Info
          </h2>

          <div className="mb-6 grid grid-cols-2 gap-5 sm:grid-cols-4 sm:gap-6">
            <div>
              <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                UPC
              </div>
              <div className="break-all text-xs sm:text-sm text-stone-700">
                {book?.upc || "-"}
              </div>
            </div>
            <div>
              <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                AVAILABILITY
              </div>
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {book?.availability !== false ? "In Stock" : "Out of Stock"}
              </div>
            </div>
            <div>
              <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                STOCK
              </div>
              <div className="text-xs sm:text-sm text-stone-700">22 units</div>
            </div>
            <div>
              <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                REVIEWS
              </div>
              <div className="text-xs sm:text-sm text-stone-700">
                {book?.num_reviews || 0} reviews
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
              PRICE
            </div>
            <div className="font-serif text-xl font-bold text-stone-900 sm:text-2xl">
              £{book?.price}
            </div>
          </div>

          <button
            type="button"
            className="rounded-lg bg-[#6e46e6] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[#5b36d6] cursor-pointer"
          >
            Add to Cart
          </button>
        </div>

        {/* AI Summary Card */}
        <div className="rounded-2xl border border-[#ede9fe] bg-[#f6f3ff] p-5 sm:p-6 shadow-sm">
          <div className="mb-2.5 flex items-center gap-2 text-[#6e46e6]">
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
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v8" />
              <path d="m8.5 14 7-4" />
              <path d="m8.5 10 7 4" />
            </svg>
            <h3 className="text-sm sm:text-base font-semibold text-[#6e46e6]">
              AI Summary
            </h3>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed text-[#6e46e6]/90">
            {book?.summary ||
              (book?.description
                ? `${book.title} by ${book.author} — ${book.description.substring(0, 160)}.`
                : `${book?.title} by ${book?.author}`)}
          </p>
        </div>
      </div>

      {/* Similar Books Section */}
      {recommendations && recommendations.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-6 font-serif text-2xl font-bold text-stone-900">
            Similar Books
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {recommendations.map((rec) => (
              <BookCard key={rec.id} book={rec} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

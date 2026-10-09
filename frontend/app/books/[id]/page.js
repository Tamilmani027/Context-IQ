import Link from "next/link";
import { getBook, getRecommendations } from "@/lib/api";
import BookCard from "@/app/components/BookCard";

const getGenreStyle = (genre) => {
  const value = genre?.toUpperCase() || "";
  if (value.includes("GAME")) return { color: "#2563eb", bg: "#ebf5ff" };
  if (value.includes("ROMANCE")) return { color: "#db2777", bg: "#fdf2f8" };
  if (value.includes("POLITICAL")) return { color: "#16a34a", bg: "#f0fdf4" };
  if (value.includes("THRILLER")) return { color: "#dc2626", bg: "#fef2f2" };
  if (value.includes("HISTORY") || value.includes("NON-FICTION"))
    return { color: "#0284c7", bg: "#f0f9ff" };
  if (value.includes("SELF HELP")) return { color: "#7c3aed", bg: "#faf5ff" };
  if (value.includes("HISTORICAL"))
    return { color: "#ea580c", bg: "#fff7ed" };
  return { color: "#57534e", bg: "#f5f5f4" };
};

function StarRating({ rating }) {
  const filled = Math.round(rating || 0);
  const stars = [];
  for (let i = 0; i < 5; i++) {
    stars.push(
      <svg
        key={i}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={i < filled ? "#f59e0b" : "#d6d3d1"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    );
  }
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating || 0} out of 5 stars`}
    >
      {stars}
    </div>
  );
}

export const dynamic = "force-dynamic";

export default async function BookDetail({ params }) {
  const { id } = await params;
  const book = await getBook(id);
  const recommendations = await getRecommendations(id);
  const recList = Array.isArray(recommendations) ? recommendations : [];

  const genreStyle = getGenreStyle(book?.genre);

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
        {/* Genre — plain uppercase colored text */}
        {book?.genre && (
          <div className="mb-2">
            <span
              className="inline-block text-[9px] font-bold uppercase tracking-widest"
              style={{ color: genreStyle.color }}
            >
              {book.genre}
            </span>
          </div>
        )}

        {/* Title */}
        <h1
          className="mb-1.5 break-words text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {book?.title}
        </h1>

        {/* Author */}
        <p className="mb-4 text-sm" style={{ color: "#57534e" }}>
          {book?.author || "Unknown Author"}
        </p>

        {/* Rating + price + reviews */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-stone-500">
          <StarRating rating={book?.rating} />
          <span className="text-stone-500">{book?.rating}/5</span>
          <span className="text-stone-300">·</span>
          <span className="font-semibold text-stone-800">£{book?.price}</span>
          <span className="text-stone-300">·</span>
          <span>{book?.num_reviews || 0} reviews</span>
        </div>
      </div>

      {/* Content Cards */}
      <div className="space-y-4">
        {/* Description Card */}
        <div
          className="rounded-xl border bg-white p-5 sm:p-6"
          style={{ borderColor: "#e8e4df" }}
        >
          <h2 className="mb-3 text-base font-bold text-stone-900">
            Description
          </h2>
          <p className="text-sm leading-relaxed text-stone-600">
            {book?.description ? (
              <>
                {book.description}{" "}
                <span className="cursor-pointer text-stone-400 hover:underline">
                  ...more
                </span>
              </>
            ) : (
              "No description available"
            )}
          </p>
        </div>

        {/* Book Info Card */}
        <div
          className="rounded-xl border bg-white p-5 sm:p-6"
          style={{ borderColor: "#e8e4df" }}
        >
          <h2 className="mb-5 text-base font-bold text-stone-900">Book Info</h2>

          {/* 4-col info grid */}
          <div className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <div className="mb-1 text-[9px] font-bold uppercase tracking-wider text-stone-400">
                UPC
              </div>
              <div className="break-all text-sm text-stone-700">
                {book?.upc || "—"}
              </div>
            </div>
            <div>
              <div className="mb-1 text-[9px] font-bold uppercase tracking-wider text-stone-400">
                AVAILABILITY
              </div>
              <div className="flex items-center gap-1.5 text-sm font-medium text-emerald-600">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {book?.availability !== false ? "In Stock" : "Out of Stock"}
              </div>
            </div>
            <div>
              <div className="mb-1 text-[9px] font-bold uppercase tracking-wider text-stone-400">
                STOCK
              </div>
              <div className="text-sm text-stone-700">
                {book?.num_available != null
                  ? `${book.num_available} units`
                  : "22 units"}
              </div>
            </div>
            <div>
              <div className="mb-1 text-[9px] font-bold uppercase tracking-wider text-stone-400">
                REVIEWS
              </div>
              <div className="text-sm text-stone-700">
                {book?.num_reviews || 0} reviews
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <div className="mb-1 text-[9px] font-bold uppercase tracking-wider text-stone-400">
              PRICE
            </div>
            <div className="text-2xl font-bold text-stone-900">
              £{book?.price}
            </div>
          </div>

          {/* Add to Cart */}
          <button
            type="button"
            className="rounded-lg px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-opacity cursor-pointer hover:opacity-90"
            style={{ backgroundColor: "#6e46e6" }}
          >
            Add to Cart
          </button>
        </div>

        {/* AI Summary Card */}
        <div
          className="rounded-xl border p-5 sm:p-6"
          style={{ borderColor: "#ede9fe", backgroundColor: "#f6f3ff" }}
        >
          <div
            className="mb-2.5 flex items-center gap-2"
            style={{ color: "#6e46e6" }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
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
            <h3
              className="text-sm font-semibold"
              style={{ color: "#6e46e6" }}
            >
              AI Summary
            </h3>
          </div>
          <p
            className="text-sm leading-relaxed"
            style={{ color: "rgba(110,70,230,0.85)" }}
          >
            {book?.summary ||
              (book?.description
                ? `${book.title} by ${book.author} — ${book.description.substring(0, 200)}.`
                : `${book?.title} by ${book?.author}`)}
          </p>
        </div>
      </div>

      {/* Similar Books */}
      {recList.length > 0 && (
        <section className="mt-14">
          <h2
            className="mb-6 text-2xl font-bold text-stone-900"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            Similar Books
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {recList.map((rec) => (
              <BookCard key={rec.id} book={rec} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

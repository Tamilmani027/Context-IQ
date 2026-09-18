import Link from "next/link";

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

export default function BookCard({ book }) {
  const rating = Math.round(book.rating || 0);

  return (
    <Link href={`/books/${book.id}`} className="block h-full group">
      <article className="flex h-full min-w-0 flex-col rounded-2xl border border-[#e8e4df] bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
        {/* Genre Badge */}
        {book.genre && (
          <div className="mb-2.5">
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${getGenreColor(book.genre)}`}>
              {book.genre}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="mb-1 break-words font-serif text-sm font-bold leading-snug text-stone-900 line-clamp-2">
          {book.title}
        </h3>

        {/* Author */}
        <p className="mb-2 break-words text-[11px] text-stone-500 line-clamp-1">
          {book.author || "Unknown Author"}
        </p>

        {/* Rating and Price on same line matching Image 1 */}
        <div className="mb-2.5 flex flex-wrap items-center gap-1.5 text-xs text-stone-400">
          <div className="flex tracking-tight text-xs" aria-label={`${book.rating || 0} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} className={index < rating ? "text-amber-500" : "text-stone-200"}>★</span>
            ))}
          </div>
          <span>{book.rating}/5</span>
          <span>·</span>
          <span>£{book.price}</span>
        </div>

        {/* Description snippet */}
        {book.description && (
          <p className="mt-auto break-words text-[11px] leading-relaxed text-stone-500 line-clamp-3">
            {book.description}
          </p>
        )}
      </article>
    </Link>
  );
}

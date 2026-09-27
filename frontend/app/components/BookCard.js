import Link from "next/link";

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
        width="11"
        height="11"
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
      <span className="ml-1 text-[10px] text-stone-400">{rating}/5</span>
    </div>
  );
}

export default function BookCard({ book }) {
  const genreStyle = getGenreStyle(book.genre);

  return (
    <Link href={`/books/${book.id}`} className="block h-full group">
      <article
        className="flex h-full min-w-0 flex-col rounded-xl border bg-white p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
        style={{ borderColor: "#e8e4df" }}
      >
        {/* Genre badge */}
        {book.genre && (
          <div className="mb-2">
            <span
              className="inline-block rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest"
              style={{
                color: genreStyle.color,
                backgroundColor: genreStyle.bg,
              }}
            >
              {book.genre}
            </span>
          </div>
        )}

        {/* Title */}
        <h3
          className="mb-1 break-words text-sm font-bold leading-snug text-stone-900 line-clamp-2"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {book.title}
        </h3>

        {/* Author */}
        <p className="mb-2 text-[10px] truncate" style={{ color: "#57534e" }}>
          {book.author || "Unknown Author"}
        </p>

        {/* Rating */}
        <div className="mb-2">
          <StarRating rating={book.rating} />
        </div>

        {/* Price + rating inline */}
        <div className="mb-2 flex items-baseline gap-1.5">
          <span className="text-xs font-bold text-stone-900">
            £{book.price}
          </span>
        </div>

        {/* Description snippet */}
        {book.description && (
          <p className="mt-auto text-[10px] leading-relaxed text-stone-400 line-clamp-3">
            {book.description}
          </p>
        )}
      </article>
    </Link>
  );
}

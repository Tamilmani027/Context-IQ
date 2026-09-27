import Link from "next/link";
import { getAllBooks } from "@/lib/api";

const getGenreStyle = (genre) => {
  const value = genre?.toUpperCase() || "";
  if (value.includes("GAME"))
    return { color: "#2563eb", bg: "#ebf5ff" };
  if (value.includes("ROMANCE"))
    return { color: "#db2777", bg: "#fdf2f8" };
  if (value.includes("POLITICAL"))
    return { color: "#16a34a", bg: "#f0fdf4" };
  if (value.includes("THRILLER"))
    return { color: "#dc2626", bg: "#fef2f2" };
  if (value.includes("HISTORY") || value.includes("NON-FICTION"))
    return { color: "#0284c7", bg: "#f0f9ff" };
  if (value.includes("SELF HELP"))
    return { color: "#7c3aed", bg: "#faf5ff" };
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
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill={i < filled ? "#f59e0b" : "#e7e5e4"}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    );
  }
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating || 0} out of 5 stars`}>
      {stars}
      <span className="ml-1 text-xs text-stone-400">{rating}/5</span>
    </div>
  );
}

function CollectionCard({ book }) {
  const genreStyle = getGenreStyle(book.genre);

  return (
    <Link href={`/books/${book.id}`} className="block h-full group">
      <article
        className="flex h-full min-w-0 flex-col rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
        style={{ borderColor: "#e8e4df" }}
      >
        {book.genre && (
          <div className="mb-3">
            <span
              className="inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest"
              style={{ color: genreStyle.color, backgroundColor: genreStyle.bg }}
            >
              {book.genre}
            </span>
          </div>
        )}

        <h2
          className="mb-1 break-words text-base font-bold leading-snug text-stone-900 line-clamp-2"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          {book.title}
        </h2>

        <p className="mb-3 text-[11px] text-stone-500 truncate">
          {book.author || "Unknown Author"}
        </p>

        <div className="mb-2.5">
          <StarRating rating={book.rating} />
        </div>

        <p className="mb-3 text-sm font-bold text-stone-900">
          £{book.price}
        </p>

        {book.description && (
          <p className="mt-auto text-[11px] leading-relaxed text-stone-500 line-clamp-4">
            {book.description}
          </p>
        )}
      </article>
    </Link>
  );
}

export default async function BooksPage() {
  const books = await getAllBooks();

  return (
    <section className="w-full pb-14 pt-2">
      <header className="mb-8">
        <h1
          className="mb-1.5 text-3xl font-bold tracking-tight text-stone-900"
          style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
        >
          Our Collection
        </h1>
        <p className="text-sm text-stone-500">
          Browse our curated selection of books across every genre.
        </p>
      </header>

      <div className="grid items-stretch grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {books.map((book) => (
          <CollectionCard key={book.id} book={book} />
        ))}
      </div>

      
    </section>
  );
}

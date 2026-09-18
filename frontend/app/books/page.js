import Link from "next/link";
import { getAllBooks } from "@/lib/api";

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

function CollectionCard({ book }) {
  const rating = Math.round(book.rating || 0);

  return (
    <Link href={`/books/${book.id}`} className="block h-full group">
      <article className="flex h-full min-w-0 flex-col rounded-2xl border border-[#e8e4df] bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md">
        {book.genre && (
          <div className="mb-3">
            <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${getGenreColor(book.genre)}`}>
              {book.genre}
            </span>
          </div>
        )}

        <h2 className="mb-1 break-words font-serif text-lg font-bold leading-snug text-stone-900 line-clamp-2">
          {book.title}
        </h2>
        <p className="mb-2.5 break-words text-xs text-stone-500">{book.author || "Unknown Author"}</p>

        <div className="mb-2.5 flex items-center gap-1.5 text-xs text-stone-400">
          <div className="flex tracking-tight text-sm" aria-label={`${book.rating || 0} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} className={index < rating ? "text-amber-500" : "text-stone-200"}>★</span>
            ))}
          </div>
          <span>{book.rating}/5</span>
        </div>

        <p className="mb-3 text-base font-bold text-stone-900">£{book.price}</p>
        {book.description && (
          <p className="mt-auto break-words text-xs leading-relaxed text-stone-500 line-clamp-4">
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
        <h1 className="mb-1.5 font-serif text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Our Collection
        </h1>
        <p className="text-sm text-stone-500">
          Browse our curated selection of books across every genre.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {books.map((book) => (
          <CollectionCard key={book.id} book={book} />
        ))}
      </div>

      {/* Floating help question button from reference design */}
      <button
        type="button"
        aria-label="Help"
        className="fixed bottom-6 right-6 flex h-9 w-9 items-center justify-center rounded-full border border-[#e8e4df] bg-white text-sm font-semibold text-stone-600 shadow-md transition-colors hover:bg-stone-50 hover:text-stone-900"
      >
        ?
      </button>
    </section>
  );
}

import Link from "next/link";
import { getAllBooks } from "@/lib/api";

const getGenreColor = (genre) => {
  const value = genre?.toUpperCase() || "";
  if (value.includes("GAME")) return "bg-blue-50 text-blue-600";
  if (value.includes("ROMANCE")) return "bg-pink-50 text-pink-600";
  if (value.includes("POLITICAL")) return "bg-green-50 text-green-600";
  if (value.includes("THRILLER")) return "bg-red-50 text-red-600";
  if (value.includes("HISTORY") || value.includes("NON-FICTION")) return "bg-sky-50 text-sky-600";
  if (value.includes("SELF HELP")) return "bg-purple-50 text-purple-600";
  if (value.includes("HISTORICAL")) return "bg-orange-50 text-orange-600";
  return "bg-gray-100 text-gray-600";
};

function CollectionCard({ book }) {
  const rating = Math.round(book.rating || 0);

  return (
    <Link href={`/books/${book.id}`} className="block h-full">
      <article className="flex h-full min-w-0 flex-col rounded-xl border border-[#e8e4df] bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-shadow hover:shadow-md">
        {book.genre && (
          <div className="mb-3">
            <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getGenreColor(book.genre)}`}>
              {book.genre}
            </span>
          </div>
        )}

        <h2 className="mb-2 break-words font-serif text-[15px] font-bold leading-5 text-gray-900 line-clamp-2">
          {book.title}
        </h2>
        <p className="mb-3 break-words text-xs text-gray-500">{book.author || "Unknown Author"}</p>

        <div className="mb-3 flex items-center gap-2 text-xs">
          <div className="flex tracking-tight" aria-label={`${book.rating || 0} out of 5 stars`}>
            {Array.from({ length: 5 }, (_, index) => (
              <span key={index} className={index < rating ? "text-amber-500" : "text-gray-200"}>★</span>
            ))}
          </div>
          <span className="text-gray-400">{book.rating}/5</span>
        </div>

        <p className="mb-3 text-sm font-bold text-gray-800">£{book.price}</p>
        {book.description && <p className="mt-auto break-words text-xs leading-[1.55] text-gray-500 line-clamp-4">{book.description}</p>}
      </article>
    </Link>
  );
}

export default async function BooksPage() {
  const books = await getAllBooks();

  return (
    <section className="relative left-1/2 w-screen -translate-x-1/2 px-5 pb-8 pt-2 sm:px-8 lg:px-12 lg:pt-3">
      <header className="mb-8 lg:mb-7">
        <h1 className="mb-2 font-serif text-3xl font-bold text-gray-950">Our Collection</h1>
        <p className="text-sm text-gray-500">Browse our curated selection of books across every genre.</p>
      </header>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-6">
        {books.map((book) => <CollectionCard key={book.id} book={book} />)}
      </div>
    </section>
  );
}

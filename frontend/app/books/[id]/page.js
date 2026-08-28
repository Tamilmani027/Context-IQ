import Link from "next/link";
import { getBook, getRecommendations } from "@/lib/api";
import BookCard from "@/app/components/BookCard";

const getGenreColor = (genre) => {
  const g = genre?.toUpperCase() || "";
  if (g.includes("GAME")) return "bg-blue-50 text-blue-600";
  if (g.includes("ROMANCE")) return "bg-pink-50 text-pink-600";
  if (g.includes("POLITICAL")) return "bg-green-50 text-green-600";
  if (g.includes("THRILLER")) return "bg-red-50 text-red-600";
  if (g.includes("HISTORY") || g.includes("NON-FICTION")) return "bg-sky-50 text-sky-600";
  if (g.includes("SELF HELP")) return "bg-purple-50 text-purple-600";
  if (g.includes("HISTORICAL")) return "bg-orange-50 text-orange-600";
  return "bg-gray-100 text-gray-600";
};

export default async function BookDetail({ params }) {
  const { id } = await params;
  const book = await getBook(id);
  const recommendations = await getRecommendations(id);

  const rating = Math.round(book.rating || 0);
  const stars = Array(5).fill(0).map((_, i) => (
    <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-200"}>
      ★
    </span>
  ));

  return (
    <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link href="/books">
          <div className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors cursor-pointer mb-6 text-sm font-medium">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            Back to Books
          </div>
        </Link>

        {/* Book Header */}
        <div className="mb-10">
          {/* Genre Badge */}
          {book.genre && (
            <div className="mb-4">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${getGenreColor(book.genre)}`}>
                {book.genre}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-gray-900 text-4xl font-bold font-serif mb-2">
            {book.title}
          </h1>

          {/* Author */}
          <p className="text-gray-500 mb-4">
            {book.author || "Unknown Author"}
          </p>

          {/* Rating, Price, Reviews */}
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <div className="flex">{stars}</div>
            <span>{book.rating}/5</span>
            <span>-</span>
            <span>£{book.price}</span>
            <span>-</span>
            <span>{book.num_reviews || 0} reviews</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Description Card */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-gray-900 font-bold font-serif text-xl mb-4">
              Description
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm">
              {book.description || "No description available"}
            </p>
          </div>

          {/* Book Info Card */}
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h2 className="text-gray-900 font-bold font-serif text-xl mb-6">
              Book Info
            </h2>
            
            <div className="grid grid-cols-4 gap-8 mb-8">
              <div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">UPC</div>
                <div className="text-gray-700 text-sm">{book.upc || "-"}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Availability</div>
                <div className="text-green-600 text-sm flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  {book.availability !== false ? "In Stock" : "Out of Stock"}
                </div>
              </div>
              <div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Stock</div>
                <div className="text-gray-700 text-sm">22 units</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Reviews</div>
                <div className="text-gray-700 text-sm">{book.num_reviews || 0} reviews</div>
              </div>
            </div>

            <div className="mb-6">
              <div className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Price</div>
              <div className="text-gray-900 font-bold text-xl">£{book.price}</div>
            </div>

            <button className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors">
              Add to Cart
            </button>
          </div>

          {/* AI Summary Card */}
          <div className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-indigo-500">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
              <h2 className="font-bold text-lg">AI Summary</h2>
            </div>
            <p className="text-indigo-600/80 leading-relaxed text-sm">
              {book.summary || `${book.title} by ${book.author} — ${book.description?.substring(0, 150)}...`}
            </p>
          </div>
        </div>

        {/* Recommendations Section */}
        {recommendations && recommendations.length > 0 && (
          <div className="mt-16 mb-8">
            <h2 className="text-gray-900 font-bold font-serif text-2xl mb-6">
              Similar Books
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {recommendations.map((rec) => (
                <BookCard key={rec.id} book={rec} />
              ))}
            </div>
          </div>
        )}
    </div>
  );
}

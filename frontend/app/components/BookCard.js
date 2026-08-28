import Link from "next/link";

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

export default function BookCard({ book }) {
  // Generate stars based on rating
  const rating = Math.round(book.rating || 0);
  const stars = Array(5).fill(0).map((_, i) => (
    <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-200"}>
      ★
    </span>
  ));

  return (
    <Link href={`/books/${book.id}`}>
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full flex flex-col">
        {/* Genre Badge */}
        {book.genre && (
          <div className="mb-4">
            <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider ${getGenreColor(book.genre)}`}>
              {book.genre}
            </span>
          </div>
        )}

        {/* Title */}
        <h2 className="text-gray-900 font-bold text-lg font-serif mb-1 line-clamp-2">
          {book.title}
        </h2>

        {/* Author */}
        <p className="text-gray-500 text-sm mb-3">
          {book.author || "Unknown Author"}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex text-sm">{stars}</div>
          <span className="text-gray-400 text-xs">{book.rating}/5</span>
        </div>
        
        {/* Price */}
        <p className="text-gray-900 font-bold mb-3">
          £{book.price}
        </p>

        {/* Description */}
        {book.description && (
          <p className="text-gray-500 text-sm line-clamp-3 mt-auto">
            {book.description}
          </p>
        )}
      </div>
    </Link>
  );
}

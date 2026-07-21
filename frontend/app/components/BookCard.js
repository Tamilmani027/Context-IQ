import Link from "next/link";

export default function BookCard({ book }) {
  return (
    <Link href={`/books/${book.id}`}>
      <div className="bg-gray-800 rounded-xl p-6 hover:bg-gray-700 transition-colors cursor-pointer">
        {/* Genre Badge */}
        {book.genre && (
          <div className="mb-3">
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {book.genre}
            </span>
          </div>
        )}

        {/* Title */}
        <h2 className="text-white font-semibold text-lg line-clamp-2">
          {book.title}
        </h2>

        {/* Author */}
        <p className="text-gray-400 text-sm">
          {book.author || "Unknown Author"}
        </p>

        {/* Rating and Price */}
        <p className="text-gray-400 text-sm mt-2">
          ⭐ {book.rating}/5 · £{book.price}
        </p>

        {/* Description */}
        {book.description && (
          <p className="text-gray-400 text-sm line-clamp-2 mt-2">
            {book.description}
          </p>
        )}
      </div>
    </Link>
  );
}

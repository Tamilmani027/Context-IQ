import Link from "next/link";
import { getBook, getRecommendations } from "@/lib/api";
import BookCard from "@/app/components/BookCard";

export default async function BookDetail({ params }) {
  const { id } = await params;
  const book = await getBook(id);
  const recommendations = await getRecommendations(id);

  return (
    <div>
        {/* Back button */}
        <Link href="/books">
          <span className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer mb-8 inline-block">
            ← Back to Books
          </span>
        </Link>

        {/* Book Header */}
        <div className="mb-8">
          {/* Genre Badge */}
          {book.genre && (
            <div className="mb-3">
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                {book.genre}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-white text-4xl font-bold mb-3">
            {book.title}
          </h1>

          {/* Rating, Price, Reviews */}
          <p className="text-gray-400 text-lg">
            ⭐ {book.rating}/5 · £{book.price} · {book.num_reviews || 0} reviews
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-white font-semibold text-lg mb-3">
                Description
              </h2>
              <p className="text-gray-300">
                {book.description || "No description available"}
              </p>
            </div>

            {/* AI Summary Card */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-white font-semibold text-lg mb-3">
                AI Summary
              </h2>
              <p className="text-gray-300">
                {book.summary || "AI summary will appear here"}
              </p>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Book Info Card */}
            <div className="bg-gray-800 rounded-xl p-6">
              <h2 className="text-white font-semibold text-lg mb-3">
                Book Info
              </h2>
              <div className="space-y-3 text-gray-300 text-sm">
                {book.upc && (
                  <div>
                    <span className="text-gray-400">UPC:</span> {book.upc}
                  </div>
                )}
                {book.availability !== undefined && (
                  <div>
                    <span className="text-gray-400">Availability:</span>{" "}
                    {book.availability ? "In Stock" : "Out of Stock"}
                  </div>
                )}
                {book.num_reviews && (
                  <div>
                    <span className="text-gray-400">Reviews:</span>{" "}
                    {book.num_reviews}
                  </div>
                )}
                {book.author && (
                  <div>
                    <span className="text-gray-400">Author:</span> {book.author}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        {recommendations && recommendations.length > 0 && (
          <div className="mt-12">
            <h2 className="text-white text-2xl font-bold mb-6">
              You Might Also Like
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

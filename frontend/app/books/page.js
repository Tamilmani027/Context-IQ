import { getAllBooks } from "@/lib/api";
import BookCard from "@/app/components/BookCard";

export default async function BooksPage() {
  const books = await getAllBooks();

  return (
    <div>
      <h1 className="text-gray-900 text-4xl font-bold font-serif mb-3 mt-4">Our Collection</h1>
      <p className="text-gray-500 mb-10 text-lg">Browse our curated selection of books across every genre.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}

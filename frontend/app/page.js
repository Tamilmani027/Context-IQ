import { getAllBooks } from "@/lib/api";
import BookCard from "./components/BookCard";

export default async function Home() {
  const books = await getAllBooks();

  return (
    <div>
      <h1 className="text-white text-3xl font-bold mb-2">All Books</h1>
      <p className="text-gray-400 mb-8">Explore our collection of books</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
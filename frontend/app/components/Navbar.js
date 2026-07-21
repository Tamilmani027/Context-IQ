import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-gray-900 px-8 py-4 flex items-center justify-between">
      {/* App name - Left side */}
      <Link href="/">
        <span className="text-white text-xl font-bold cursor-pointer">
          Context-IQ
        </span>
      </Link>

      {/* Navigation links - Right side */}
      <div className="flex gap-6">
        <Link href="/books">
          <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
            Books
          </span>
        </Link>
        <Link href="/ask">
          <span className="text-gray-300 hover:text-white transition-colors cursor-pointer">
            Ask AI
          </span>
        </Link>
      </div>
    </nav>
  );
}
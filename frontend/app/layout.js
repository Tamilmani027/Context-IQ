import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "Context-IQ",
  description: "Document Intelligence Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-gray-950 min-h-screen`}>
        <Navbar />
        <main className="max-w-7xl mx-auto px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
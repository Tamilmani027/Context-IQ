import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import MainWrapper from "./components/MainWrapper";

const geist = Geist({ subsets: ["latin"] });

export const metadata = {
  title: "Context-IQ",
  description: "Document Intelligence Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-[#faf8f5] min-h-screen`}>
        <Navbar />
        <MainWrapper>{children}</MainWrapper>
      </body>
    </html>
  );
}

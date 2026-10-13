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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${geist.className} bg-[#F4F0EB] min-h-screen`}>
        <Navbar />
        <MainWrapper>
          {children}
        </MainWrapper>
      </body>
    </html>
  );
}

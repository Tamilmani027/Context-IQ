"use client";

import { usePathname } from "next/navigation";

export default function MainWrapper({ children }) {
  const pathname = usePathname();
  const isAuth = pathname?.startsWith("/auth");

  return (
    <main
      className={
        isAuth
          ? "w-full"
          : "w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-[45px]"
      }
    >
      {children}
    </main>
  );
}

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "\u0e2d\u0e48\u0e32\u0e19\u0e44\u0e17\u0e22 - Read Thai",
  description: "Learn to read and write Thai script with interactive lessons and SRS flashcards",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}

import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "The Elnsburg Continuum",
  description: "Webnovels + Wiki for the Elnsburg Continuum",
  openGraph: {
    title: "The Elnsburg Continuum",
    description: "Webnovels + Wiki for the Elnsburg Continuum",
    type: "website"
  },
  alternates: {
    types: { "application/rss+xml": "/api/rss" }
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b border-zinc-200/50 dark:border-zinc-800/50">
          <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-semibold">Elnsburg Continuum</Link>
            <nav className="flex gap-6 text-sm">
              <Link href="/#novels">Novels</Link>
              <Link href="/wiki">Wiki</Link>
              <a href="/api/rss">RSS</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="border-t border-zinc-200/50 dark:border-zinc-800/50 mt-16">
          <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-zinc-500">
            © {new Date().getFullYear()} The Elnsburg Continuum
          </div>
        </footer>
      </body>
    </html>
  );
}

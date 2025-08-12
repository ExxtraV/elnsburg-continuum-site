import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Cinzel, Merriweather } from "next/font/google";

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

const heading = Cinzel({ subsets: ["latin"], variable: "--font-heading", weight: ["400", "700"] });
const body = Merriweather({ subsets: ["latin"], variable: "--font-body", weight: ["400", "700"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body className="min-h-screen bg-gradient-to-br from-night-sky via-indigo-950 to-black text-parchment font-body">
        <header className="border-b border-royal-gold/20 bg-gradient-to-r from-night-sky to-indigo-950 shadow-md">
          <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-heading text-royal-gold">Elnsburg Continuum</Link>
            <nav className="flex gap-6 text-sm text-parchment">
              <Link href="/novels" className="hover:text-royal-gold">Novels</Link>
              <Link href="/wiki" className="hover:text-royal-gold">Wiki</Link>
              <a href="/api/rss" className="hover:text-royal-gold">RSS</a>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
        <footer className="border-t border-royal-gold/20 mt-16 bg-night-sky/50">
          <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-center text-parchment">
            © {new Date().getFullYear()} The Elnsburg Continuum
          </div>
        </footer>
      </body>
    </html>
  );
}

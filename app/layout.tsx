import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Cinzel, Merriweather } from "next/font/google";
import { ThemeProvider, ThemeToggle } from "@/components/theme-provider";

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
      <body className="min-h-screen font-body bg-white text-night-sky dark:bg-gradient-to-br dark:from-night-sky dark:via-indigo-950 dark:to-black dark:text-parchment">
        <ThemeProvider>
          <header className="border-b border-royal-gold/20 bg-gray-100 text-night-sky shadow-md dark:bg-gradient-to-r dark:from-night-sky dark:to-indigo-950 dark:text-parchment">
            <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
              <Link href="/" className="text-2xl font-heading text-royal-gold">Elnsburg Continuum</Link>
              <nav className="flex gap-6 text-sm text-night-sky dark:text-parchment">
                <Link href="/novels" className="hover:text-royal-gold">Novels</Link>
                <Link href="/wiki" className="hover:text-royal-gold">Wiki</Link>
                <a href="/api/rss" className="hover:text-royal-gold">RSS</a>
                <ThemeToggle />
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
          <footer className="border-t border-royal-gold/20 mt-16 bg-gray-100 text-night-sky dark:bg-night-sky/50 dark:text-parchment">
            <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-center">
              © {new Date().getFullYear()} The Elnsburg Continuum
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

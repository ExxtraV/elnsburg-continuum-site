"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Chapter {
  _id: string;
  slug: string;
  title: string;
  synopsis?: string;
}

export default function ChapterList({ chapters }: { chapters: Chapter[] }) {
  const { data: session } = useSession();
  const [user, setUser] = useState<{ progress: string[]; bookmarks: string[] }>({
    progress: [],
    bookmarks: [],
  });

  useEffect(() => {
    if (session) {
      fetch("/api/user")
        .then((res) => res.json())
        .then((d) => setUser(d));
    }
  }, [session]);

  return (
    <ul className="space-y-3">
      {chapters.map((c) => {
        const read = user.progress.includes(c.slug);
        const bookmarked = user.bookmarks.includes(c.slug);
        return (
          <li
            key={c._id}
            className="border border-royal-gold/30 bg-night-sky/40 backdrop-blur-sm p-4 rounded"
          >
            <Link href={c.slug} className="font-heading text-royal-gold">
              {c.title}
            </Link>
            {read && <span className="ml-2">✓</span>}
            {bookmarked && <span className="ml-1">★</span>}
            {c.synopsis && (
              <p className="text-sm mt-2 text-parchment/80">{c.synopsis}</p>
            )}
          </li>
        );
      })}
    </ul>
  );
}

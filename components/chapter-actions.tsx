"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";

interface Props { slug: string; }

export default function ChapterActions({ slug }: Props) {
  const { data: session } = useSession();
  const [read, setRead] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (session) {
      fetch("/api/user")
        .then((res) => res.json())
        .then((d) => {
          setRead(d.progress.includes(slug));
          setBookmarked(d.bookmarks.includes(slug));
        });
    }
  }, [session, slug]);

  const markRead = async () => {
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, type: "read" }),
    });
    setRead(true);
  };

  const toggleBookmark = async () => {
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, type: "bookmark" }),
    });
    setBookmarked((b) => !b);
  };

  if (!session)
    return (
      <button onClick={() => signIn()} className="text-sm text-royal-gold">
        Sign in to track progress
      </button>
    );

  return (
    <div className="flex gap-4 text-sm mt-4">
      <button onClick={markRead} disabled={read} className="underline">
        {read ? "Read" : "Mark as read"}
      </button>
      <button onClick={toggleBookmark} className="underline">
        {bookmarked ? "Unbookmark" : "Bookmark"}
      </button>
    </div>
  );
}

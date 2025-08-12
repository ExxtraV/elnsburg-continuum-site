'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

export default function ChapterActions({ chapterId }: { chapterId: string }) {
  const { data: session } = useSession();
  const [bookmarked, setBookmarked] = useState(false);
  const [read, setRead] = useState(false);

  useEffect(() => {
    if (!session) return;
    fetch('/api/bookmarks').then(r => r.json()).then((data: string[]) => {
      setBookmarked(data.includes(chapterId));
    });
    fetch('/api/progress').then(r => r.json()).then((data: string[]) => {
      setRead(data.includes(chapterId));
    });
  }, [session, chapterId]);

  if (!session) return null;

  const markRead = async () => {
    await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterId })
    });
    setRead(true);
  };

  const toggleBookmark = async () => {
    await fetch('/api/bookmarks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chapterId })
    });
    setBookmarked(!bookmarked);
  };

  return (
    <div className="flex gap-4 text-sm mt-4">
      <button onClick={markRead} disabled={read} className="hover:text-royal-gold">
        {read ? 'Read' : 'Mark as Read'}
      </button>
      <button onClick={toggleBookmark} className="hover:text-royal-gold">
        {bookmarked ? 'Remove Bookmark' : 'Bookmark'}
      </button>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useAuth } from './auth-context';

export default function ChapterListItem({ chapter }: { chapter: any }) {
  const { user, toggleBookmark, toggleRead } = useAuth();
  const read = user?.read[chapter._id];
  const bookmarked = user?.bookmarks[chapter._id];
  return (
    <li className="border border-royal-gold/30 bg-night-sky/40 backdrop-blur-sm p-4 rounded">
      <div className="flex justify-between items-start">
        <Link href={chapter.slug} className="font-heading text-royal-gold">
          Chapter {chapter.chapter}: {chapter.title}
        </Link>
        {user && (
          <div className="flex gap-2 text-sm">
            <button onClick={() => toggleRead(chapter._id)}>{read ? '✓' : '○'}</button>
            <button onClick={() => toggleBookmark(chapter._id)}>{bookmarked ? '★' : '☆'}</button>
          </div>
        )}
      </div>
      {chapter.synopsis && (
        <p className="text-sm mt-2 text-parchment/80">{chapter.synopsis}</p>
      )}
    </li>
  );
}


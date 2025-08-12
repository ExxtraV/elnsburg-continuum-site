'use client';

import { useAuth } from '@/components/auth-context';
import Link from 'next/link';
import { allChapters } from 'contentlayer/generated';

export default function BookmarksPage() {
  const { user } = useAuth();
  if (!user) return <p>Please log in to view bookmarks.</p>;
  const chapters = allChapters.filter(c => user.bookmarks[c._id]);
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-heading text-royal-gold">Bookmarks</h1>
      <ul className="space-y-3">
        {chapters.map(c => (
          <li key={c._id} className="border border-royal-gold/30 bg-night-sky/40 backdrop-blur-sm p-4 rounded">
            <Link href={c.slug} className="font-heading text-royal-gold">
              {c.series}: Chapter {c.chapter} - {c.title}
            </Link>
          </li>
        ))}
      </ul>
      {!chapters.length && <p>No bookmarks yet.</p>}
    </div>
  );
}


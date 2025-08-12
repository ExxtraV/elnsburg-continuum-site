'use client';

import { useAuth } from './auth-context';

export function ChapterActions({ id }: { id: string }) {
  const { user, toggleBookmark, toggleRead } = useAuth();
  if (!user) {
    return <p className="text-sm mb-4">Log in to track your progress.</p>;
  }
  const read = !!user.read[id];
  const bookmarked = !!user.bookmarks[id];
  return (
    <div className="flex gap-4 mb-4 text-sm">
      <button onClick={() => toggleRead(id)}>{read ? 'Mark Unread' : 'Mark Read'}</button>
      <button onClick={() => toggleBookmark(id)}>{bookmarked ? 'Remove Bookmark' : 'Bookmark'}</button>
    </div>
  );
}


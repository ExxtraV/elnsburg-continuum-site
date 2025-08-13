'use client';

import { useEffect, useState, FormEvent } from 'react';

interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export default function Comments({ series, chapter }: { series: string; chapter: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');

  async function fetchComments() {
    const res = await fetch(`/api/comments/${series}/${chapter}`);
    if (res.ok) {
      setComments(await res.json());
    }
  }

  useEffect(() => {
    fetchComments();
  }, [series, chapter]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/comments/${series}/${chapter}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author, text }),
    });
    if (res.ok) {
      setAuthor('');
      setText('');
      fetchComments();
    }
  }

  return (
    <section className="mt-8">
      <h2 className="text-lg font-heading mb-2">Comments</h2>
      <ul className="space-y-2 mb-4">
        {comments.map((c) => (
          <li key={c.id} className="border border-parchment/20 p-2 rounded">
            <p className="text-sm whitespace-pre-line">{c.text}</p>
            <p className="text-xs text-parchment/70">— {c.author} on {new Date(c.createdAt).toLocaleString()}</p>
          </li>
        ))}
        {comments.length === 0 && <li className="text-sm text-parchment/70">No comments yet.</li>}
      </ul>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Your name"
          required
          className="px-2 py-1 rounded bg-inherit border border-parchment/30"
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Your comment"
          required
          className="px-2 py-1 rounded bg-inherit border border-parchment/30"
        />
        <button type="submit" className="self-start px-3 py-1 rounded bg-royal-gold text-stone-900">Post</button>
      </form>
    </section>
  );
}

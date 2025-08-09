'use client';

import { useState, useMemo } from 'react';

function todayISO() {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mm}-${dd}`;
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [series, setSeries] = useState('Power, Curses, & Broken Promises');
  const [chapter, setChapter] = useState<number>(1);
  const [title, setTitle] = useState('Chapter 1 — Title');
  const [date, setDate] = useState(todayISO());
  const [synopsis, setSynopsis] = useState('');
  const [status, setStatus] = useState('draft');
  const [characters, setCharacters] = useState('Iskra, Nestle');
  const [content, setContent] = useState<string>(
`Welcome to **Elnsburg**. Write your chapter here.

<Spoiler>Optional spoiler block</Spoiler>

See <WikiLink slug="elnsburg-overview">Elnsburg overview</WikiLink>.`
  );

  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ok?: boolean; fileUrl?: string; previewSlug?: string; error?: string} | null>(null);

  const previewPath = useMemo(() => {
    return `/novels/${slugify(series)}/${String(chapter).padStart(3, '0')}`;
  }, [series, chapter]);

  async function publish() {
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch('/api/save-chapter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': password,
        },
        body: JSON.stringify({
          series,
          chapter: Number(chapter),
          title,
          date,
          synopsis,
          status,
          characters,
          content,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setResult({ error: json?.error || 'Failed to publish' });
      } else {
        setResult({ ok: true, fileUrl: json.fileUrl, previewSlug: json.previewSlug });
      }
    } catch (e: any) {
      setResult({ error: e?.message || 'Network error' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Elnsburg Admin</h1>
      <p className="text-sm text-zinc-500">
        Enter the password, fill out your chapter, and click Publish. This creates/updates an <code>.mdx</code> file in your GitHub repo and triggers a Vercel deploy.
      </p>

      <div className="grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm">Admin Password</span>
          <input
            type="password"
            className="border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Series</span>
          <input
            className="border rounded px-3 py-2"
            value={series}
            onChange={(e) => setSeries(e.target.value)}
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="text-sm">Chapter #</span>
            <input
              type="number"
              className="border rounded px-3 py-2"
              value={chapter}
              min={1}
              onChange={(e) => setChapter(Number(e.target.value))}
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm">Date (YYYY-MM-DD)</span>
            <input
              className="border rounded px-3 py-2"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm">Title</span>
          <input
            className="border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Synopsis (optional)</span>
          <input
            className="border rounded px-3 py-2"
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Status</span>
          <input
            className="border rounded px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            placeholder="draft or published"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Characters (comma-separated)</span>
          <input
            className="border rounded px-3 py-2"
            value={characters}
            onChange={(e) => setCharacters(e.target.value)}
            placeholder="Iskra, Nestle"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Content (MDX)</span>
          <textarea
            className="border rounded px-3 py-2 min-h-[300px] font-mono"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </label>

        <div className="flex items-center gap-3">
          <button
            className="rounded px-4 py-2 border disabled:opacity-50"
            onClick={publish}
            disabled={busy || !password}
          >
            {busy ? 'Publishing…' : 'Publish'}
          </button>
          <span className="text-sm text-zinc-500">Preview URL (after deploy): <code>{previewPath}</code></span>
        </div>

        {result?.ok && (
          <div className="rounded border p-3 text-sm">
            ✅ Published! {result.fileUrl ? (<a className="underline" href={result.fileUrl} target="_blank">View file on GitHub</a>) : null}
            {result.previewSlug ? <> • Preview on site: <code>{result.previewSlug}</code> (after deploy)</> : null}
          </div>
        )}
        {result?.error && (
          <div className="rounded border p-3 text-sm text-red-600">
            ⚠️ {result.error}
          </div>
        )}
      </div>
    </div>
  );
}
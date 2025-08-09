'use client';

import { useState } from 'react';

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export default function WikiAdminPage() {
  const [password, setPassword] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState<string>('Write your wiki entry here.');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok?: boolean; fileUrl?: string; previewSlug?: string; error?: string } | null>(null);

  const previewPath = `/wiki/${slug}`;

  async function publish() {
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch('/api/save-wiki', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': password,
        },
        body: JSON.stringify({ title, slug, summary, tags, content }),
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
      <h1 className="text-2xl font-semibold">Wiki Admin</h1>
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
          <span className="text-sm">Title</span>
          <input
            className="border rounded px-3 py-2"
            value={title}
            onChange={(e) => {
              const t = e.target.value;
              setTitle(t);
              setSlug(slugify(t));
            }}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Slug</span>
          <input
            className="border rounded px-3 py-2 font-mono"
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            placeholder="elnsburg-overview"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Summary (optional)</span>
          <input
            className="border rounded px-3 py-2"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Tags (comma-separated)</span>
          <input
            className="border rounded px-3 py-2"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="overview, factions"
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
            disabled={busy || !password || !slug || !title}
          >
            {busy ? 'Publishing…' : 'Publish'}
          </button>
          <span className="text-sm text-zinc-500">Preview URL (after deploy): <code>{previewPath}</code></span>
        </div>

        {result?.ok && (
          <div className="rounded border p-3 text-sm">
            ✅ Published! {result.fileUrl ? (
              <a className="underline" href={result.fileUrl} target="_blank">View file on GitHub</a>
            ) : null}
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

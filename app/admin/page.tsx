'use client';

import { useState } from 'react';

type Result =
  | {
      ok?: boolean;
      fileUrl?: string;
      previewSlug?: string;
      message?: string;
      error?: string;
    }
  | null;

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [content, setContent] = useState('Write your wiki entry here.');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result>(null);

  const previewPath = `/wiki/${slug}`;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) setLoggedIn(true);
  };

  async function saveWiki() {
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
      if (!res.ok) setResult({ error: json?.error || 'Failed to publish' });
      else setResult({ ok: true, fileUrl: json.fileUrl, previewSlug: json.previewSlug });
    } catch (e: any) {
      setResult({ error: e?.message || 'Network error' });
    } finally {
      setBusy(false);
    }
  }

  async function deleteWiki() {
    if (!slug) return;
    if (!confirm('Delete this wiki entry?')) return;
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch('/api/delete-wiki', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-secret': password,
        },
        body: JSON.stringify({ slug }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) setResult({ error: json?.error || 'Failed to delete' });
      else setResult({ ok: true, message: 'Deleted.' });
    } catch (e: any) {
      setResult({ error: e?.message || 'Network error' });
    } finally {
      setBusy(false);
    }
  }

  if (!loggedIn)
    return (
      <form onSubmit={handleLogin} className="max-w-md mx-auto mt-16 grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm">Admin Password</span>
          <input
            type="password"
            className="border rounded px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button className="rounded border px-4 py-2" disabled={!password}>
          Enter
        </button>
      </form>
    );

  return (
    <div className="grid gap-4">
      <label className="grid gap-1">
        <span className="text-sm">Title</span>
        <input
          className="border rounded px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label className="grid gap-1">
        <span className="text-sm">Slug</span>
        <input
          className="border rounded px-3 py-2"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
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
        />
      </label>
      <label className="grid gap-1">
        <span className="text-sm">Content (MDX)</span>
        <textarea
          className="border rounded px-3 py-2 min-h-[300px] font-mono text-blue-700"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </label>
      <details className="border rounded px-3 py-2 bg-zinc-50 text-sm text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
        <summary className="cursor-pointer">MDX Guide</summary>
        <ul className="mt-2 list-disc pl-4 space-y-1">
          <li>
            <code># Heading</code> creates a heading
          </li>
          <li>
            <code>**bold**</code> and <code>*italic*</code> text
          </li>
          <li>
            <code>[link](https://example.com)</code> for links
          </li>
          <li>
            Use the built-in <code>&lt;Spoiler&gt;</code> component
          </li>
        </ul>
      </details>
      <div className="flex items-center gap-3">
        <button
          className="rounded px-4 py-2 border disabled:opacity-50"
          onClick={saveWiki}
          disabled={busy || !password || !title || !slug || !content}
        >
          {busy ? 'Publishing…' : 'Publish'}
        </button>
        <button
          className="rounded px-4 py-2 border disabled:opacity-50"
          onClick={deleteWiki}
          disabled={busy || !password || !slug}
        >
          {busy ? 'Deleting…' : 'Delete'}
        </button>
        <span className="text-sm text-zinc-500">
          Preview URL (after deploy): <code>{previewPath}</code>
        </span>
      </div>
      {result?.ok && (
        <div className="rounded border p-3 text-sm">
          ✅ {result.message || 'Published!'}{' '}
          {result.fileUrl ? (
            <a className="underline" href={result.fileUrl} target="_blank">
              View file on GitHub
            </a>
          ) : null}
          {result.previewSlug ? (
            <> • Preview on site: <code>{result.previewSlug}</code> (after deploy)</>
          ) : null}
        </div>
      )}
      {result?.error && (
        <div className="rounded border p-3 text-sm text-red-600">
          ⚠️ {result.error}
        </div>
      )}
    </div>
  );
}


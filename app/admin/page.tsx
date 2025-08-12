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
const pad3 = (n: number) => String(n).padStart(3, '0');

type Result = { ok?: boolean; fileUrl?: string; previewSlug?: string; error?: string } | null;

type ContentType = 'chapter' | 'wiki';
type Action = 'create' | 'delete';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [contentType, setContentType] = useState<ContentType>('chapter');
  const [action, setAction] = useState<Action>('create');

  // Chapter fields
  const [series, setSeries] = useState('Power, Curses, & Broken Promises');
  const [chapter, setChapter] = useState<number>(1);
  const [title, setTitle] = useState('Chapter 1 — Title');
  const [date, setDate] = useState(todayISO());
  const [synopsis, setSynopsis] = useState('');
  const [status, setStatus] = useState('draft');
  const [characters, setCharacters] = useState('Iskra, Nestle');
  const [chapterContent, setChapterContent] = useState<string>(
    `Welcome to **Elnsburg**. Write your chapter here.

<Spoiler>Optional spoiler block</Spoiler>

See [[elnsburg-overview]].`
  );

  // Wiki fields
  const [wikiTitle, setWikiTitle] = useState('');
  const [wikiSlug, setWikiSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [tags, setTags] = useState('');
  const [wikiContent, setWikiContent] = useState<string>('Write your wiki entry here.');

  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result>(null); // create/update feedback
  const [msg, setMsg] = useState<string | null>(null); // delete feedback

  const previewChapterPath = useMemo(() => `/novels/${slugify(series)}/${pad3(chapter)}`, [series, chapter]);
  const previewWikiPath = `/wiki/${wikiSlug}`;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password) setLoggedIn(true);
  };

  async function saveChapter() {
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
          content: chapterContent,
        }),
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
        body: JSON.stringify({
          title: wikiTitle,
          slug: wikiSlug,
          summary,
          tags,
          content: wikiContent,
        }),
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

  async function deleteChapter() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch('/api/delete-chapter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': password },
        body: JSON.stringify({ series, chapter }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) setMsg(`⚠️ ${json?.error || 'Delete failed'}`);
      else setMsg(`✅ Deleted content/novels/${slugify(series)}/chapters/${pad3(chapter)}.mdx. Vercel will redeploy shortly.`);
    } catch (e: any) {
      setMsg(`⚠️ ${e?.message || 'Network error'}`);
    } finally {
      setBusy(false);
    }
  }

  async function deleteWiki() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch('/api/delete-wiki', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-secret': password },
        body: JSON.stringify({ slug: wikiSlug }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) setMsg(`⚠️ ${json?.error || 'Delete failed'}`);
      else setMsg(`✅ Deleted content/wiki/${slugify(wikiSlug)}.mdx. Vercel will redeploy shortly.`);
    } catch (e: any) {
      setMsg(`⚠️ ${e?.message || 'Network error'}`);
    } finally {
      setBusy(false);
    }
  }

  function renderChapterCreate() {
    return (
      <div className="grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm">Series</span>
          <input className="border rounded px-3 py-2" value={series} onChange={(e) => setSeries(e.target.value)} />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="text-sm">Chapter #</span>
            <input type="number" className="border rounded px-3 py-2" value={chapter} min={1} onChange={(e) => setChapter(Number(e.target.value))} />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Date (YYYY-MM-DD)</span>
            <input className="border rounded px-3 py-2" value={date} onChange={(e) => setDate(e.target.value)} />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm">Title</span>
          <input className="border rounded px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Synopsis (optional)</span>
          <input className="border rounded px-3 py-2" value={synopsis} onChange={(e) => setSynopsis(e.target.value)} />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Status</span>
          <input className="border rounded px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value)} placeholder="draft or published" />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Characters (comma-separated)</span>
          <input className="border rounded px-3 py-2" value={characters} onChange={(e) => setCharacters(e.target.value)} placeholder="Iskra, Nestle" />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Content (MDX)</span>
          <textarea className="border rounded px-3 py-2 min-h-[300px] font-mono" value={chapterContent} onChange={(e) => setChapterContent(e.target.value)} />
        </label>

        <div className="flex items-center gap-3">
          <button className="rounded px-4 py-2 border disabled:opacity-50" onClick={saveChapter} disabled={busy || !password}>
            {busy ? 'Publishing…' : 'Publish'}
          </button>
          <span className="text-sm text-zinc-500">Preview URL (after deploy): <code>{previewChapterPath}</code></span>
        </div>

        {result?.ok && (
          <div className="rounded border p-3 text-sm">
            ✅ Published! {result.fileUrl ? (<a className="underline" href={result.fileUrl} target="_blank">View file on GitHub</a>) : null}
            {result.previewSlug ? <> • Preview on site: <code>{result.previewSlug}</code> (after deploy)</> : null}
          </div>
        )}
        {result?.error && (
          <div className="rounded border p-3 text-sm text-red-600">⚠️ {result.error}</div>
        )}
      </div>
    );
  }

  function renderChapterDelete() {
    return (
      <div className="grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm">Series</span>
          <input className="border rounded px-3 py-2" value={series} onChange={(e) => setSeries(e.target.value)} />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Chapter #</span>
          <input type="number" min={1} className="border rounded px-3 py-2" value={chapter} onChange={(e) => setChapter(Number(e.target.value))} />
        </label>
        <div className="text-xs text-zinc-500">Target file: <code>{`/content/novels/${slugify(series)}/chapters/${pad3(chapter)}.mdx`}</code></div>
        <button className="rounded px-4 py-2 border disabled:opacity-50" disabled={!password || busy} onClick={deleteChapter}>
          {busy ? 'Deleting…' : 'Delete Chapter'}
        </button>
        {msg && <div className="text-sm">{msg}</div>}
      </div>
    );
  }

  function renderWikiCreate() {
    return (
      <div className="grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm">Title</span>
          <input className="border rounded px-3 py-2" value={wikiTitle} onChange={(e) => { const t = e.target.value; setWikiTitle(t); setWikiSlug(slugify(t)); }} />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Slug</span>
          <input className="border rounded px-3 py-2 font-mono" value={wikiSlug} onChange={(e) => setWikiSlug(slugify(e.target.value))} placeholder="elnsburg-overview" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Summary (optional)</span>
          <input className="border rounded px-3 py-2" value={summary} onChange={(e) => setSummary(e.target.value)} />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Tags (comma-separated)</span>
          <input className="border rounded px-3 py-2" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="overview, factions" />
        </label>
        <label className="grid gap-1">
          <span className="text-sm">Content (MDX)</span>
          <textarea className="border rounded px-3 py-2 min-h-[300px] font-mono" value={wikiContent} onChange={(e) => setWikiContent(e.target.value)} />
        </label>
        <div className="flex items-center gap-3">
          <button className="rounded px-4 py-2 border disabled:opacity-50" onClick={saveWiki} disabled={busy || !password || !wikiSlug || !wikiTitle}>
            {busy ? 'Publishing…' : 'Publish'}
          </button>
          <span className="text-sm text-zinc-500">Preview URL (after deploy): <code>{previewWikiPath}</code></span>
        </div>
        {result?.ok && (
          <div className="rounded border p-3 text-sm">
            ✅ Published! {result.fileUrl ? (<a className="underline" href={result.fileUrl} target="_blank">View file on GitHub</a>) : null}
            {result.previewSlug ? <> • Preview on site: <code>{result.previewSlug}</code> (after deploy)</> : null}
          </div>
        )}
        {result?.error && (
          <div className="rounded border p-3 text-sm text-red-600">⚠️ {result.error}</div>
        )}
      </div>
    );
  }

  function renderWikiDelete() {
    return (
      <div className="grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm">Slug</span>
          <input className="border rounded px-3 py-2 font-mono" value={wikiSlug} onChange={(e) => setWikiSlug(slugify(e.target.value))} placeholder="elnsburg-overview" />
        </label>
        <div className="text-xs text-zinc-500">Target file: <code>{`/content/wiki/${slugify(wikiSlug)}.mdx`}</code></div>
        <button className="rounded px-4 py-2 border disabled:opacity-50" disabled={!password || busy || !wikiSlug} onClick={deleteWiki}>
          {busy ? 'Deleting…' : 'Delete Wiki Page'}
        </button>
        {msg && <div className="text-sm">{msg}</div>}
      </div>
    );
  }

  const renderForm = () => {
    if (contentType === 'chapter' && action === 'create') return renderChapterCreate();
    if (contentType === 'chapter' && action === 'delete') return renderChapterDelete();
    if (contentType === 'wiki' && action === 'create') return renderWikiCreate();
    if (contentType === 'wiki' && action === 'delete') return renderWikiDelete();
    return null;
  };

  if (!loggedIn) {
    return (
      <form onSubmit={handleLogin} className="mx-auto max-w-sm space-y-4">
        <h1 className="text-2xl font-semibold">Admin Login</h1>
        <input
          type="password"
          className="border rounded px-3 py-2 w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Admin password"
        />
        <button type="submit" className="rounded px-4 py-2 border w-full disabled:opacity-50" disabled={!password}>
          Enter
        </button>
      </form>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="text-2xl font-semibold">Elnsburg Admin</h1>

      <div className="flex gap-4">
        <label className="text-sm flex items-center gap-2">
          <span>Type</span>
          <select className="border rounded px-2 py-1" value={contentType} onChange={(e) => { setContentType(e.target.value as ContentType); setResult(null); setMsg(null); }}>
            <option value="chapter">Chapter</option>
            <option value="wiki">Wiki Page</option>
          </select>
        </label>
        <label className="text-sm flex items-center gap-2">
          <span>Action</span>
          <select className="border rounded px-2 py-1" value={action} onChange={(e) => { setAction(e.target.value as Action); setResult(null); setMsg(null); }}>
            <option value="create">Create/Update</option>
            <option value="delete">Delete</option>
          </select>
        </label>
      </div>

      {renderForm()}
    </div>
  );
}

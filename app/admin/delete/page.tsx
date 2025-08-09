'use client';

import { useState } from 'react';

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
const pad3 = (n: number) => String(n).padStart(3, '0');

export default function DeleteChapterPage() {
  const [password, setPassword] = useState('');
  const [series, setSeries] = useState('Power, Curses, & Broken Promises');
  const [chapter, setChapter] = useState<number>(1);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const path = `/content/novels/${slugify(series)}/chapters/${pad3(chapter)}.mdx`;

  async function del() {
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
      else setMsg(`✅ Deleted ${path}. Vercel will redeploy shortly.`);
    } catch (e: any) {
      setMsg(`⚠️ ${e?.message || 'Network error'}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Delete Chapter</h1>
      <p className="text-sm text-zinc-500">This removes the MDX file from the repo and triggers a redeploy.</p>

      <label className="grid gap-1">
        <span className="text-sm">Admin Password</span>
        <input type="password" className="border rounded px-3 py-2" value={password} onChange={e=>setPassword(e.target.value)} />
      </label>

      <label className="grid gap-1">
        <span className="text-sm">Series</span>
        <input className="border rounded px-3 py-2" value={series} onChange={e=>setSeries(e.target.value)} />
      </label>

      <label className="grid gap-1">
        <span className="text-sm">Chapter #</span>
        <input type="number" min={1} className="border rounded px-3 py-2" value={chapter} onChange={e=>setChapter(Number(e.target.value))} />
      </label>

      <div className="text-xs text-zinc-500">Target file: <code>{path}</code></div>

      <button className="rounded px-4 py-2 border disabled:opacity-50" disabled={!password || busy} onClick={del}>
        {busy ? 'Deleting…' : 'Delete Chapter'}
      </button>

      {msg && <div className="text-sm">{msg}</div>}
    </div>
  );
}
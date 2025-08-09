import { allChapters, allWikis } from 'contentlayer/generated';
import Link from "next/link";

export default function HomePage() {
  const chapters = [...allChapters].sort((a,b)=> b.chapter - a.chapter).slice(0,5);
  const wiki = [...allWikis].slice(0,5);
  const mainSeries = "power-curses-broken-promises";

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">Power, Curses, & Broken Promises</h1>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl">
          The flagship webnovel in the Elnsburg Continuum — a city of saints, curses, and political factions.
        </p>
        <div>
          <Link href={`/novels/${mainSeries}/001`} className="inline-block rounded px-4 py-2 border">
            Start at Chapter 1
          </Link>
        </div>
      </section>

      <section id="novels" className="space-y-4">
        <h2 className="text-2xl font-semibold">Latest Chapters</h2>
        <ul className="space-y-3">
          {chapters.map(c => (
            <li key={c._id} className="border p-4 rounded">
              <Link href={c.slug} className="text-lg font-medium">{c.title}</Link>
              <div className="text-xs mt-1 text-zinc-500">Series: {c.series} • Chapter {c.chapter}</div>
              {c.synopsis && <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{c.synopsis}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">From the Wiki</h2>
        <ul className="grid sm:grid-cols-2 gap-4">
          {wiki.map(w => (
            <li key={w._id} className="border p-4 rounded">
              <Link href={w.slug} className="font-medium">{w.title}</Link>
              {w.summary && <p className="text-sm mt-2 text-zinc-700 dark:text-zinc-300">{w.summary}</p>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

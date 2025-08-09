import { allChapters, allWikis } from 'contentlayer/generated';
import Link from "next/link";

export default function HomePage() {
  const chapters = [...allChapters].sort((a,b)=> b.chapter - a.chapter).slice(0,5);
  const wiki = [...allWikis].slice(0,5);
  const mainSeries = "power-curses-broken-promises";

  return (
    <div className="space-y-12">
      <section className="space-y-4">
        <h1 className="text-4xl font-heading text-royal-gold">Power, Curses, & Broken Promises</h1>
        <p className="text-parchment/80 max-w-2xl">
          The flagship webnovel in the Elnsburg Continuum — a city of saints, curses, and political factions.
        </p>
        <div>
          <Link href={`/novels/power-curses-and-broken-promises/001`} className="inline-block rounded px-4 py-2 bg-royal-gold text-night-sky font-bold hover:bg-yellow-400">
            Start at Chapter 1
          </Link>
        </div>
      </section>

      <section id="novels" className="space-y-4">
        <h2 className="text-3xl font-heading text-royal-gold">Latest Chapters</h2>
        <ul className="space-y-3">
          {chapters.map(c => (
            <li key={c._id} className="border border-royal-gold/30 bg-night-sky/40 backdrop-blur-sm p-4 rounded">
              <Link href={c.slug} className="text-lg font-heading text-royal-gold">{c.title}</Link>
              <div className="text-xs mt-1 text-parchment/70">Series: {c.series} • Chapter {c.chapter}</div>
              {c.synopsis && <p className="mt-2 text-sm text-parchment/80">{c.synopsis}</p>}
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-3xl font-heading text-royal-gold">From the Wiki</h2>
        <ul className="grid sm:grid-cols-2 gap-4">
          {wiki.map(w => (
            <li key={w._id} className="border border-royal-gold/30 bg-night-sky/40 backdrop-blur-sm p-4 rounded">
              <Link href={w.slug} className="font-heading text-royal-gold">{w.title}</Link>
              {w.summary && <p className="text-sm mt-2 text-parchment/80">{w.summary}</p>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

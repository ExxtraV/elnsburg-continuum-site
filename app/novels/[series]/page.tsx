import { allChapters } from 'contentlayer/generated';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  const slugs = Array.from(new Set(allChapters.map(c => c.seriesSlug)));
  return slugs.map(series => ({ series }));
}

export default function SeriesPage({ params }: { params: { series: string } }) {
  const chapters = allChapters
    .filter(c => c.seriesSlug === params.series)
    .sort((a,b)=> a.chapter - b.chapter);
  if (!chapters.length) return notFound();
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-heading text-royal-gold">{chapters[0].series}</h1>
      <ul className="space-y-3">
        {chapters.map(c => (
          <li key={c._id} className="border border-royal-gold/30 bg-night-sky/40 backdrop-blur-sm p-4 rounded">
            <Link href={c.slug} className="font-heading text-royal-gold">Chapter {c.chapter}: {c.title}</Link>
            {c.synopsis && <p className="text-sm mt-2 text-parchment/80">{c.synopsis}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

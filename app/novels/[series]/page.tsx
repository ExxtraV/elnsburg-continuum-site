import { allChapters } from "contentlayer/generated";
import { notFound } from "next/navigation";
import Link from "next/link";

export function generateStaticParams() {
  return Array.from(new Set(allChapters.map((c) => c.seriesSlug))).map(
    (series) => ({ series })
  );
}

export default function SeriesPage({ params }: { params: { series: string } }) {
  const chapters = allChapters
    .filter((c) => c.seriesSlug === params.series)
    .sort((a, b) => a.chapter - b.chapter);

  if (chapters.length === 0) return notFound();

  const seriesName = chapters[0].series;

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-heading text-royal-gold">{seriesName}</h1>
      <ul className="space-y-3">
        {chapters.map((c) => (
          <li
            key={c._id}
            className="border border-royal-gold/30 bg-night-sky/40 backdrop-blur-sm p-4 rounded"
          >
            <Link href={c.slug} className="font-heading text-royal-gold">
              {c.title}
            </Link>
            <div className="text-xs mt-1 text-parchment/70">
              Chapter {c.chapter}
            </div>
            {c.synopsis && (
              <p className="mt-2 text-sm text-parchment/80">{c.synopsis}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

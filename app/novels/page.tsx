import { allChapters } from 'contentlayer/generated';
import Link from 'next/link';

export default function NovelsIndex() {
  const seriesMap = new Map<string, string>();
  for (const c of allChapters) {
    if (!seriesMap.has(c.seriesSlug)) seriesMap.set(c.seriesSlug, c.series);
  }
  const series = Array.from(seriesMap.entries()).sort((a,b)=> a[1].localeCompare(b[1]));
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-heading text-royal-gold">Novels</h1>
      <ul className="space-y-3">
        {series.map(([slug, name]) => (
          <li key={slug} className="border border-royal-gold/30 bg-night-sky/40 backdrop-blur-sm p-4 rounded">
            <Link href={`/novels/${slug}`} className="font-heading text-royal-gold">{name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

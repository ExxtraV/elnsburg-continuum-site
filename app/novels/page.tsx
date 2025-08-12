import { allChapters } from "contentlayer/generated";
import Link from "next/link";

export default function NovelsIndex() {
  const seriesMap = new Map<string, typeof allChapters[number]>();
  for (const chapter of allChapters) {
    if (!seriesMap.has(chapter.seriesSlug)) {
      seriesMap.set(chapter.seriesSlug, chapter);
    }
  }
  const series = Array.from(seriesMap.values()).sort((a, b) =>
    a.series.localeCompare(b.series)
  );

  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-heading text-royal-gold">Web Novels</h1>
      <ul className="grid sm:grid-cols-2 gap-4">
        {series.map((s) => (
          <li
            key={s.seriesSlug}
            className="border border-royal-gold/30 bg-night-sky/40 backdrop-blur-sm p-4 rounded"
          >
            <Link
              href={`/novels/${s.seriesSlug}`}
              className="font-heading text-royal-gold"
            >
              {s.series}
            </Link>
            <div className="text-xs mt-2 text-parchment/70">
              {allChapters.filter((c) => c.seriesSlug === s.seriesSlug).length} chapters
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

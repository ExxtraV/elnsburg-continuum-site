import { allChapters } from 'contentlayer/generated';
import ChapterListItem from '@/components/chapter-list-item';
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
          <ChapterListItem key={c._id} chapter={c} />
        ))}
      </ul>
    </div>
  );
}

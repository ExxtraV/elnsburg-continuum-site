import { allChapters } from 'contentlayer/generated';
import { notFound } from 'next/navigation';
import ChapterList from '@/components/chapter-list';

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
      <ChapterList chapters={chapters.map(c => ({
        _id: c._id,
        slug: c.slug,
        title: `Chapter ${c.chapter}: ${c.title}`,
        synopsis: c.synopsis,
      }))} />
    </div>
  );
}

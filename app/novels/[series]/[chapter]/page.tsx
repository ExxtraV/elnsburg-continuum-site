import { allChapters } from "contentlayer/generated";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXContent } from "@/components/mdx-content";
import ChapterActions from "@/components/chapter-actions";

export function generateStaticParams() {
  return allChapters.map((c) => ({
    series: c.seriesSlug,
    chapter: String(c.chapter).padStart(3, "0"),
  }));
}

export default function ChapterPage({ params }: { params: { series: string; chapter: string } }) {
  const doc = allChapters.find(
    (c) => c.seriesSlug === params.series && String(c.chapter).padStart(3, "0") === params.chapter
  );
  if (!doc) return notFound();

  const seriesChapters = allChapters
    .filter((c) => c.seriesSlug === params.series)
    .sort((a, b) => a.chapter - b.chapter);

  const idx = seriesChapters.findIndex((c) => c._id === doc._id);
  const prev = idx > 0 ? seriesChapters[idx - 1] : null;
  const next = idx < seriesChapters.length - 1 ? seriesChapters[idx + 1] : null;

  return (
    <article className="prose prose-invert prose-headings:font-heading prose-headings:text-royal-gold mx-auto">
      <h1>{doc.title}</h1>
      <MDXContent code={doc.body.code} />
      <hr />
      <ChapterActions slug={doc.slug} />
      <nav className="flex justify-between text-sm mt-4">
        <div>{prev && <Link href={prev.slug}>← {prev.title}</Link>}</div>
        <div>{next && <Link href={next.slug}>{next.title} →</Link>}</div>
      </nav>
      <p className="text-xs text-parchment/70 mt-8">Series: {doc.series} • Chapter {doc.chapter}</p>
    </article>
  );
}

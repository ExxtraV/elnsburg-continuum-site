import { allChapters } from "contentlayer/generated";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXContent } from "@/components/mdx-content";

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
    <article className="prose dark:prose-invert mx-auto">
      <h1>{doc.title}</h1>
      <MDXContent code={doc.body.code} />
      <hr />
      <nav className="flex justify-between text-sm">
        <div>{prev && <Link href={prev.slug}>← {prev.title}</Link>}</div>
        <div>{next && <Link href={next.slug}>{next.title} →</Link>}</div>
      </nav>
      <p className="text-xs text-zinc-500 mt-8">Series: {doc.series} • Chapter {doc.chapter}</p>
    </article>
  );
}

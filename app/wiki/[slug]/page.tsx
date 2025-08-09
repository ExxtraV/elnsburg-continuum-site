import { allWikis } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { MDXContent } from "@/components/mdx-content";

export function generateStaticParams() {
  return allWikis.map(w => ({ slug: w.slug.split("/").at(-1)! }));
}

export default function WikiPage({ params }: { params: { slug: string } }) {
  const doc = allWikis.find(w => w.slug.endsWith(params.slug));
  if (!doc) return notFound();
  return (
    <article className="prose dark:prose-invert mx-auto">
      <h1>{doc.title}</h1>
      <MDXContent code={doc.body.code} />
    </article>
  );
}

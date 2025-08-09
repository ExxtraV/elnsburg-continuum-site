'use client';

import { useMDXComponent } from 'next-contentlayer2/hooks';
import Link from 'next/link';

const components = {
  a: (props: any) => <a {...props} />,
  Spoiler: ({ children }: { children: React.ReactNode }) => (
    <details>
      <summary>Spoiler</summary>
      <div>{children}</div>
    </details>
  ),
  WikiLink: ({ slug, children }: { slug: string; children: React.ReactNode }) => (
    <Link href={`/wiki/${slug}`}>{children}</Link>
  ),
} as const;

export function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return <Component components={components as any} />;
}
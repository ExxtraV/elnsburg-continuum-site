'use client';
import * as runtime from 'react/jsx-runtime';
import { useMDXComponent } from 'next-contentlayer/hooks';
import Link from 'next/link';

const components = {
  a: (props: any) => <a {...props} />,
  // Add custom shortcodes as you like:
  Spoiler: ({ children }: { children: React.ReactNode }) => (
    <details><summary>Spoiler</summary><div>{children}</div></details>
  ),
  WikiLink: ({ slug, children }: { slug: string; children: React.ReactNode }) => (
    <Link href={`/wiki/${slug}`}>{children}</Link>
  ),
};

export function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code, { ...runtime });
  return <Component components={components as any} />;
}

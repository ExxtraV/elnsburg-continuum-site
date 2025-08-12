'use client';

import { useMDXComponent } from 'next-contentlayer2/hooks';
import Link from 'next/link';

const components = {
  a: ({ href, children, ...rest }: any) => {
    if (href?.startsWith('/')) {
      return (
        <Link href={href} {...rest}>
          {children}
        </Link>
      );
    }
    return (
      <a href={href} {...rest}>
        {children}
      </a>
    );
  },
  Spoiler: ({ children }: { children: React.ReactNode }) => (
    <details>
      <summary>Spoiler</summary>
      <div>{children}</div>
    </details>
  ),
} as const;

export function MDXContent({ code }: { code: string }) {
  const Component = useMDXComponent(code);
  return <Component components={components as any} />;
}
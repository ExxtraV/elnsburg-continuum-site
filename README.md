# The Elnsburg Continuum — Wiki

This repo powers **The Elnsburg Continuum** wiki. The companion webnovel is hosted separately at [run-write.com/elnsburg](https://www.run-write.com/elnsburg).

## Features

- **Next.js 14** with the App Router and TypeScript
- **MDX + Contentlayer** for type‑safe content sourced from the `content/` directory
- **Tailwind CSS** for styling

## Quick start
```bash
npm i
npm run dev
```
Wiki content lives in `content/wiki/*.mdx`. Edit or add files, and the site updates.

## Authoring

Use double brackets to link to wiki pages. Writing `[[elnsburg-overview]]` in your entry will automatically link to `/wiki/elnsburg-overview`.

## Deploy
- Vercel recommended: import repo, set `NEXT_PUBLIC_SITE_URL` env (e.g., https://your-domain)
- Static hosting also works with `next export` (limited features).

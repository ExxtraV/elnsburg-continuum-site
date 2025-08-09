# The Elnsburg Continuum — Webnovel + Wiki Starter

Tech: Next.js (App Router, TS), MDX + Contentlayer, Tailwind.

## Quick start
```bash
npm i
npm run dev
```
Content lives in `content/novels/*/chapters/*.mdx` and `content/wiki/*.mdx`.
Edit or add files, and the site updates.

An admin interface is available for quickly creating content without touching the files directly:

- `(/admin)` for novel chapters
- `(/admin/wiki)` for wiki entries

## Deploy
- Vercel recommended: import repo, set `NEXT_PUBLIC_SITE_URL` env (e.g., https://your-domain)
- Static hosting also works with `next export` (limited features).

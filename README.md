# The Elnsburg Continuum — Webnovel + Wiki Starter

This repo powers **The Elnsburg Continuum**, a template for hosting a serialised
webnovel alongside a companion world wiki. It uses modern tooling to make
writing and publishing chapters or lore entries as simple as editing a Markdown
file.

## Features

- **Next.js 14** with the App Router and TypeScript
- **MDX + Contentlayer** for type‑safe content sourced from the `content/`
  directory
- **Tailwind CSS** for styling
- Built‑in admin pages for creating chapters and wiki entries without touching
  files (`/admin` and `/admin/wiki`)

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

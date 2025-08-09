# The Elnsburg Continuum — Webnovel + Wiki Starter

Tech: Next.js (App Router, TS), MDX + Contentlayer, Tailwind.

## Quick start
```bash
npm i
npm run dev
```
Content lives in `content/novels/*/chapters/*.mdx` and `content/wiki/*.mdx`.
Edit or add files, and the site updates.

## Deploy
- Vercel recommended: import repo, set `NEXT_PUBLIC_SITE_URL` env (e.g., https://your-domain)
- Static hosting also works with `next export` (limited features).

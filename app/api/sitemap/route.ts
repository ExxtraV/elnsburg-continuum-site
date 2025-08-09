import { allChapters, allWikis } from "contentlayer/generated";

export async function GET() {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const urls = ["/", ...allChapters.map(c=>c.slug), ...allWikis.map(w=>w.slug)]
    .map(u => `<url><loc>${site}${u}</loc></url>`)
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
  </urlset>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}

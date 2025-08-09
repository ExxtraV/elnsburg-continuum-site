import { allChapters } from "contentlayer/generated";

export async function GET() {
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const items = [...allChapters]
    .sort((a,b)=> b.chapter - a.chapter)
    .slice(0, 20)
    .map(c => `
      <item>
        <title>${escapeXml(c.title)}</title>
        <link>${site}${c.slug}</link>
        <description>${escapeXml(c.synopsis ?? "")}</description>
        <guid>${site}${c.slug}</guid>
        <pubDate>${new Date(c.date).toUTCString()}</pubDate>
      </item>
    `)
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0"><channel>
    <title>The Elnsburg Continuum — Latest Chapters</title>
    <link>${site}</link>
    <description>Recent chapters</description>
    ${items}
  </channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml" } });
}

function escapeXml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

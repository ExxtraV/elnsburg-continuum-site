import { NextRequest, NextResponse } from "next/server";

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
const pad3 = (n: number) => String(n).padStart(3, "0");

export async function POST(req: NextRequest) {
  // simple auth
  if (req.headers.get("x-admin-secret") !== process.env.ADMIN_PASSWORD) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { series, chapter } = (await req.json()) as { series: string; chapter: number };
  if (!series || !chapter) {
    return NextResponse.json({ error: "Missing series or chapter" }, { status: 400 });
  }

  const seriesSlug = slugify(series);
  const chapterId = pad3(chapter);
  const path = `content/novels/${seriesSlug}/chapters/${chapterId}.mdx`;

  const repo = process.env.GITHUB_REPO!;
  const [owner, repoName] = repo.split("/");
  const branch = process.env.GITHUB_DEFAULT_BRANCH || "main";
  const apiBase = `https://api.github.com`;
  const contentsUrl = `${apiBase}/repos/${owner}/${repoName}/contents/${encodeURIComponent(path)}`;
  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // get current SHA
  const res = await fetch(`${contentsUrl}?ref=${branch}`, { headers });
  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    return NextResponse.json({ error: "File not found or cannot fetch", details: msg || res.statusText }, { status: 404 });
  }
  const json = (await res.json()) as { sha?: string };
  const sha = json.sha;
  if (!sha) return NextResponse.json({ error: "Could not read file SHA" }, { status: 500 });

  // delete
  const del = await fetch(contentsUrl, {
    method: "DELETE",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({
      message: `chore(chapter): delete ${series} ch${chapterId}`,
      sha,
      branch,
    }),
  });

  if (!del.ok) {
    const text = await del.text().catch(() => "");
    return NextResponse.json({ error: "GitHub DELETE failed", details: text || del.statusText }, { status: 500 });
  }

  return NextResponse.json({ ok: true, path });
}
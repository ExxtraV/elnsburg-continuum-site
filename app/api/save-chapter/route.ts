import { NextRequest, NextResponse } from "next/server";

type Payload = {
  series: string;           // e.g., "Power, Curses, & Broken Promises"
  chapter: number;          // e.g., 3
  title: string;            // e.g., "Chapter 3 — Goat Diplomacy"
  date: string;             // e.g., "2025-08-09"
  synopsis?: string;
  status?: string;          // e.g., "draft" | "published"
  characters?: string;      // comma-separated: "Iskra, Nestle"
  content: string;          // MDX body (no frontmatter)
};

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function pad3(n: number) {
  return String(n).padStart(3, "0");
}

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (!secret || secret !== process.env.ADMIN_PASSWORD) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const {
    series,
    chapter,
    title,
    date,
    synopsis = "",
    status = "draft",
    characters = "",
    content,
  } = (await req.json()) as Payload;

  if (!series || !chapter || !title || !date || !content) {
    return NextResponse.json(
      { error: "Missing required fields (series, chapter, title, date, content)" },
      { status: 400 }
    );
  }

  const seriesSlug = slugify(series);
  const chapterId = pad3(chapter);

  // Frontmatter (YAML)
  const characterList = characters
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const fm = [
    "---",
    `title: ${JSON.stringify(title)}`,
    `chapter: ${chapter}`,
    `date: ${JSON.stringify(date)}`,
    `series: ${JSON.stringify(series)}`,
    synopsis ? `synopsis: ${JSON.stringify(synopsis)}` : null,
    status ? `status: ${JSON.stringify(status)}` : null,
    `characters: [${characterList.map((c) => JSON.stringify(c)).join(", ")}]`,
    "---",
    "",
  ]
    .filter(Boolean)
    .join("\n");

  const mdx = `${fm}${content.endsWith("\n") ? content : content + "\n"}`;

  const repo = process.env.GITHUB_REPO!;
  const [owner, repoName] = repo.split("/");
  const branch = process.env.GITHUB_DEFAULT_BRANCH || "main";
  const path = `content/novels/${seriesSlug}/chapters/${chapterId}.mdx`;

  const apiBase = `https://api.github.com`;
  const contentsUrl = `${apiBase}/repos/${owner}/${repoName}/contents/${encodeURIComponent(path)}`;
  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  // Check if file exists to get SHA (needed for updates)
  let sha: string | undefined;
  {
    const res = await fetch(`${contentsUrl}?ref=${branch}`, { headers });
    if (res.ok) {
      const json = (await res.json()) as { sha?: string };
      sha = json.sha;
    }
  }

  const message = `${sha ? "chore" : "feat"}(chapter): ${series} ch${chapterId} — ${title}`;
  const body = {
    message,
    content: Buffer.from(mdx, "utf8").toString("base64"),
    branch,
    ...(sha ? { sha } : {}),
  };

  const put = await fetch(contentsUrl, {
    method: "PUT",
    headers,
    body: JSON.stringify(body),
  });

  if (!put.ok) {
    const text = await put.text().catch(() => "");
    return NextResponse.json(
      { error: "GitHub PUT failed", details: text || put.statusText },
      { status: 500 }
    );
  }

  const json = (await put.json()) as any;
  const fileUrl = json?.content?.html_url ?? null;
  const previewSlug = `/novels/${seriesSlug}/${chapterId}`;

  return NextResponse.json({ ok: true, fileUrl, previewSlug, path, branch });
}
import { NextRequest, NextResponse } from "next/server";

type Payload = {
  series: string;
  chapter: number;
  title: string;
  date: string;
  synopsis?: string;
  status?: string;
  characters?: string; // comma-separated
  content: string;     // MDX body (no frontmatter)
};

function slugify(input: string) {
  return input.toLowerCase().trim().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
const pad3 = (n: number) => String(n).padStart(3, "0");

export async function POST(req: NextRequest) {
  // simple auth
  if (req.headers.get("x-admin-secret") !== process.env.ADMIN_PASSWORD) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = (await req.json()) as Payload;
  const { series, chapter, title, date, synopsis = "", status = "draft", characters = "", content } = body;

  if (!series || !chapter || !title || !date || !content) {
    return NextResponse.json({ error: "Missing required fields (series, chapter, title, date, content)" }, { status: 400 });
  }

  const seriesSlug = slugify(series);
  const chapterId = pad3(chapter);

  const characterList = characters
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Build YAML frontmatter deterministically with explicit newlines
  const frontmatter =
`---
title: ${JSON.stringify(title)}
chapter: ${chapter}
date: ${JSON.stringify(date)}
series: ${JSON.stringify(series)}
${synopsis ? `synopsis: ${JSON.stringify(synopsis)}\n` : ""}${status ? `status: ${JSON.stringify(status)}\n` : ""}characters: [${characterList.map((c) => JSON.stringify(c)).join(", ")}]
---
`;

  // Ensure exactly one blank line between FM and content, and a trailing newline
  const mdx = `${frontmatter}${content.trim()}\n`;

  // GitHub commit
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

  // find existing sha
  let sha: string | undefined;
  const head = await fetch(`${contentsUrl}?ref=${branch}`, { headers });
  if (head.ok) {
    const j = (await head.json()) as { sha?: string };
    sha = j.sha;
  }

  const commitMessage = `${sha ? "chore" : "feat"}(chapter): ${series} ch${chapterId} — ${title}`;
  const put = await fetch(contentsUrl, {
    method: "PUT",
    headers,
    body: JSON.stringify({
      message: commitMessage,
      content: Buffer.from(mdx, "utf8").toString("base64"),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!put.ok) {
    return NextResponse.json({ error: "GitHub PUT failed", details: await put.text() }, { status: 500 });
  }

  const json = await put.json();
  const fileUrl = json?.content?.html_url ?? null;
  const previewSlug = `/novels/${seriesSlug}/${chapterId}`;

  return NextResponse.json({ ok: true, fileUrl, previewSlug, path, branch });
}
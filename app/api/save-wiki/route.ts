import { NextRequest, NextResponse } from "next/server";

interface Payload {
  title: string;
  slug: string;
  summary?: string;
  tags?: string; // comma-separated
  content: string; // MDX body (no frontmatter)
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: NextRequest) {
  if (req.headers.get("x-admin-secret") !== process.env.ADMIN_PASSWORD) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = (await req.json()) as Payload;
  const { title, slug, summary = "", tags = "", content } = body;

  if (!title || !slug || !content) {
    return NextResponse.json(
      { error: "Missing required fields (title, slug, content)" },
      { status: 400 }
    );
  }

  const finalSlug = slugify(slug);
  const tagList = tags
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const frontmatter =
    `---\n` +
    `title: ${JSON.stringify(title)}\n` +
    (summary ? `summary: ${JSON.stringify(summary)}\n` : "") +
    (tagList.length
      ? `tags: [${tagList.map((t) => JSON.stringify(t)).join(", ")}]\n`
      : "") +
    `---\n`;

  const mdx = `${frontmatter}${content.trim()}\n`;

  const repo = process.env.GITHUB_REPO!;
  const [owner, repoName] = repo.split("/");
  const branch = process.env.GITHUB_DEFAULT_BRANCH || "main";
  const path = `content/wiki/${finalSlug}.mdx`;
  const apiBase = `https://api.github.com`;
  const contentsUrl = `${apiBase}/repos/${owner}/${repoName}/contents/${encodeURIComponent(
    path
  )}`;
  const headers = {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  let sha: string | undefined;
  const head = await fetch(`${contentsUrl}?ref=${branch}`, { headers });
  if (head.ok) {
    const j = (await head.json()) as { sha?: string };
    sha = j.sha;
  }

  const commitMessage = `${sha ? "chore" : "feat"}(wiki): ${title}`;
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
    return NextResponse.json(
      { error: "GitHub PUT failed", details: await put.text() },
      { status: 500 }
    );
  }

  const json = await put.json();
  const fileUrl = json?.content?.html_url ?? null;
  const previewSlug = `/wiki/${finalSlug}`;

  return NextResponse.json({ ok: true, fileUrl, previewSlug, path, branch });
}


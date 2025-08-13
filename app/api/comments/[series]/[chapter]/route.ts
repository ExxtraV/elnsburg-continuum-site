import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';

type Comment = {
  id: string;
  author: string;
  text: string;
  createdAt: string;
};

type DB = Record<string, Record<string, Comment[]>>;

const DB_PATH = path.join(process.cwd(), 'data', 'comments.json');

async function readDB(): Promise<DB> {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data) as DB;
  } catch {
    return {};
  }
}

async function writeDB(db: DB) {
  await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
  await fs.writeFile(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { series: string; chapter: string } }
) {
  const db = await readDB();
  const comments = db[params.series]?.[params.chapter] ?? [];
  return NextResponse.json(comments);
}

export async function POST(
  req: NextRequest,
  { params }: { params: { series: string; chapter: string } }
) {
  const { author, text } = await req.json();
  if (!author || !text) {
    return NextResponse.json({ error: 'Missing author or text' }, { status: 400 });
  }
  const db = await readDB();
  const comment: Comment = {
    id: randomUUID(),
    author,
    text,
    createdAt: new Date().toISOString(),
  };
  db[params.series] ??= {};
  db[params.series][params.chapter] ??= [];
  db[params.series][params.chapter].push(comment);
  await writeDB(db);
  return NextResponse.json(comment, { status: 201 });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { series: string; chapter: string } }
) {
  const { id, author, text } = await req.json();
  const db = await readDB();
  const list = db[params.series]?.[params.chapter] ?? [];
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  if (author !== undefined) list[idx].author = author;
  if (text !== undefined) list[idx].text = text;
  await writeDB(db);
  return NextResponse.json(list[idx]);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { series: string; chapter: string } }
) {
  const { id } = await req.json();
  const db = await readDB();
  const list = db[params.series]?.[params.chapter] ?? [];
  const idx = list.findIndex((c) => c.id === id);
  if (idx === -1) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const [removed] = list.splice(idx, 1);
  await writeDB(db);
  return NextResponse.json(removed);
}

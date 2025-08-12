import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { findUser, updateUser } from '@/lib/db';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json([]);
  const user = findUser(session.user.email);
  return NextResponse.json(user?.bookmarks ?? []);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { chapterId } = await request.json();
  const user = findUser(session.user.email);
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
  const idx = user.bookmarks.indexOf(chapterId);
  if (idx >= 0) {
    user.bookmarks.splice(idx, 1);
  } else {
    user.bookmarks.push(chapterId);
  }
  updateUser(user);
  return NextResponse.json({ ok: true });
}

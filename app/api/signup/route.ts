import { NextResponse } from 'next/server';
import { addUser, findUser } from '@/lib/db';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }
  if (findUser(email)) {
    return NextResponse.json({ error: 'User exists' }, { status: 400 });
  }
  const hashed = await bcrypt.hash(password, 10);
  addUser({ id: randomUUID(), email, password: hashed, bookmarks: [], progress: [] });
  return NextResponse.json({ ok: true });
}

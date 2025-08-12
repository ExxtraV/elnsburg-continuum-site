import fs from 'fs';
import path from 'path';

export interface UserRecord {
  username: string;
  password: string;
  progress: string[];
  bookmarks: string[];
}

const filePath = path.join(process.cwd(), 'data', 'users.json');

function readUsers(): UserRecord[] {
  if (!fs.existsSync(filePath)) return [];
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as UserRecord[];
}

function writeUsers(users: UserRecord[]) {
  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
}

export function getUser(username: string): UserRecord | undefined {
  return readUsers().find(u => u.username === username);
}

export function markRead(username: string, slug: string) {
  const users = readUsers();
  const user = users.find(u => u.username === username);
  if (!user) return;
  if (!user.progress.includes(slug)) {
    user.progress.push(slug);
    writeUsers(users);
  }
}

export function toggleBookmark(username: string, slug: string) {
  const users = readUsers();
  const user = users.find(u => u.username === username);
  if (!user) return;
  if (user.bookmarks.includes(slug)) {
    user.bookmarks = user.bookmarks.filter(s => s !== slug);
  } else {
    user.bookmarks.push(slug);
  }
  writeUsers(users);
}

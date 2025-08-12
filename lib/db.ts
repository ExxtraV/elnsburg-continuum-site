import fs from 'fs';
import path from 'path';

export type User = {
  id: string;
  email: string;
  password: string;
  bookmarks: string[];
  progress: string[];
};

const dataFile = path.join(process.cwd(), 'data', 'users.json');

function readUsers(): User[] {
  try {
    const raw = fs.readFileSync(dataFile, 'utf8');
    return JSON.parse(raw) as User[];
  } catch {
    return [];
  }
}

function writeUsers(users: User[]) {
  fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
}

export function findUser(email: string) {
  return readUsers().find((u) => u.email === email);
}

export function addUser(user: User) {
  const users = readUsers();
  users.push(user);
  writeUsers(users);
}

export function updateUser(user: User) {
  const users = readUsers();
  const idx = users.findIndex((u) => u.id === user.id);
  if (idx >= 0) {
    users[idx] = user;
    writeUsers(users);
  }
}

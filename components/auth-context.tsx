'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type UserData = {
  username: string;
  read: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
};

type AuthContextValue = {
  user: UserData | null;
  login: (name: string) => void;
  logout: () => void;
  toggleRead: (id: string) => void;
  toggleBookmark: (id: string) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function loadUser(name: string): UserData {
  const raw = typeof window !== 'undefined' ? localStorage.getItem(`ec-user-${name}`) : null;
  if (raw) return JSON.parse(raw) as UserData;
  return { username: name, read: {}, bookmarks: {} };
}

function saveUser(user: UserData) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`ec-user-${user.username}`, JSON.stringify(user));
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    const current = typeof window !== 'undefined' ? localStorage.getItem('ec-current-user') : null;
    if (current) setUser(loadUser(current));
  }, []);

  const login = (name: string) => {
    const u = loadUser(name);
    setUser(u);
    if (typeof window !== 'undefined') {
      localStorage.setItem('ec-current-user', name);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ec-current-user');
    }
    setUser(null);
  };

  const toggleRead = (id: string) => {
    if (!user) return;
    const next = { ...user, read: { ...user.read, [id]: !user.read[id] } };
    setUser(next);
    saveUser(next);
  };

  const toggleBookmark = (id: string) => {
    if (!user) return;
    const next = { ...user, bookmarks: { ...user.bookmarks, [id]: !user.bookmarks[id] } };
    setUser(next);
    saveUser(next);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, toggleRead, toggleBookmark }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}


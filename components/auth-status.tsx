'use client';

import Link from 'next/link';
import { useAuth } from './auth-context';

export default function AuthStatus() {
  const { user, logout } = useAuth();
  if (user) {
    return (
      <>
        <Link href="/bookmarks" className="hover:text-royal-gold">Bookmarks</Link>
        <button onClick={logout} className="hover:text-royal-gold">Logout {user.username}</button>
      </>
    );
  }
  return <Link href="/login" className="hover:text-royal-gold">Login</Link>;
}


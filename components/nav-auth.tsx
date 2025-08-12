'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function NavAuth() {
  const { data: session } = useSession();
  if (session?.user) {
    return (
      <button onClick={() => signOut()} className="hover:text-royal-gold">Logout</button>
    );
  }
  return <Link href="/login" className="hover:text-royal-gold">Login</Link>;
}

"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function NavAuth() {
  const { data: session } = useSession();
  return session ? (
    <button onClick={() => signOut()} className="hover:text-royal-gold">Sign out</button>
  ) : (
    <Link href="/login" className="hover:text-royal-gold">Sign in</Link>
  );
}

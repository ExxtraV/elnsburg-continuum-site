'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth-context';

export default function LoginPage() {
  const [name, setName] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    login(name);
    router.push('/');
  };

  return (
    <form onSubmit={submit} className="max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-heading text-royal-gold">Login</h1>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 rounded bg-night-sky/40 border border-royal-gold/30"
        placeholder="Username"
      />
      <button type="submit" className="px-4 py-2 bg-royal-gold text-night-sky rounded">
        Login
      </button>
    </form>
  );
}


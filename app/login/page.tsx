"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn("credentials", { username, password, callbackUrl: "/" });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-heading text-royal-gold">Sign In</h1>
      <input
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full p-2 text-black"
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 text-black"
        placeholder="Password"
      />
      <button type="submit" className="bg-royal-gold text-night-sky px-4 py-2">
        Sign In
      </button>
    </form>
  );
}

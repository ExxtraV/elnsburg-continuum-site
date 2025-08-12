import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { getUser } from "@/lib/userData";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const user = getUser(credentials.username);
        if (user && user.password === credentials.password) {
          return { id: user.username, name: user.username };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },
};

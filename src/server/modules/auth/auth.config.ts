import type { NextAuthConfig } from "next-auth";

export const authOptions: NextAuthConfig = {
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.workspace = (user as any).workspace;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "ADMIN" | "ANALYST" | "VIEWER";
        session.user.workspace = token.workspace as {
          id: string;
          name: string;
          slug: string;
        };
      }
      return session;
    },
  },
  providers: [],
  pages: {
    signIn: "/login",
  },
  trustHost: true,
  secret: process.env.AUTH_SECRET,
};
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authOptions } from "@/server/modules/auth/auth.config";

export const {
  handlers,
  signIn,
  signOut,
  auth,
} = NextAuth({
  ...authOptions,
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }
        const { authenticateUser } = await import("./auth.service");
        return authenticateUser(
          credentials.email as string,
          credentials.password as string
        );
      },
    }),
  ],
});
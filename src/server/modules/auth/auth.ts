import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authenticateUser } from "./auth.service";

export const {
    handlers,
    signIn,
    signOut,
    auth,
} = NextAuth({
    session: {
        strategy: "jwt",
    },

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

                return authenticateUser(
                    credentials.email as string,
                    credentials.password as string
                );
            },
        }),
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.workspace = user.workspace;
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

    pages: {
        signIn: "/login",
    },

    trustHost: true,

    secret: process.env.AUTH_SECRET,
});
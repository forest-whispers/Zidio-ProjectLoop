import { DefaultSession } from "next-auth";

type UserRole = "ADMIN" | "ANALYST" | "VIEWER";

declare module "next-auth" {
    interface Session {
        user: DefaultSession["user"] & {
            id: string;
            role: UserRole;
            workspace: {
                id: string;
                name: string;
                slug: string;
            };
        };
    }

    interface User {
        id: string;
        role: UserRole;
        workspace: {
            id: string;
            name: string;
            slug: string;
        };
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: UserRole;
        workspace: {
            id: string;
            name: string;
            slug: string;
        };
    }
}
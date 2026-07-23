import { auth } from "@/server/modules/auth/auth";

import { UnauthorizedError } from "@/server/shared/errors/errors";

export async function requireAuth() {
    const session = await auth();

    if (!session?.user) {
        throw new UnauthorizedError("Unauthorized.");
    }

    return session;
}
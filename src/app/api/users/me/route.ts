import { auth } from "@/server/modules/auth/auth";

import { ok } from "@/server/shared/http/response";
import { UnauthorizedError } from "@/server/shared/errors/errors";
import { createRouteHandler } from "@/server/shared/http/route";

export const GET = createRouteHandler(async () => {
    const session = await auth();

    if (!session?.user) {
        throw new UnauthorizedError("Unauthorized.");
    }

    return ok({
        user: session.user,
    });
}) as any;
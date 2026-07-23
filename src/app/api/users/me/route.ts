import { requireAuth } from "@/server/shared/auth/auth";

import { ok } from "@/server/shared/http/response";
import { createRouteHandler } from "@/server/shared/http/route";

export const GET = createRouteHandler(async () => {
    const session = await requireAuth();

    return ok({
        user: session.user,
    });
}) as any;
import { NextRequest } from "next/server";

import { ok } from "@/server/shared/http/response";
import { requireAuth } from "@/server/shared/auth/auth";
import { getAnalytics } from "@/server/modules/analytics/analytics.service";
import { createRouteHandler } from "@/server/shared/http/route";

export const GET = createRouteHandler(
    async (request: NextRequest) => {
        const session = await requireAuth();

        const workspaceId =
            session.user.workspace.id;

        const range =
            (request.nextUrl.searchParams.get("range") ??
                "30d") as
            | "7d"
            | "30d"
            | "90d"
            | "1y"
            | "all";

        const analytics =
            await getAnalytics(
                workspaceId,
                range
            );

        return ok(analytics);
})
import { ok } from "@/server/shared/http/response";
import { requireAuth } from "@/server/shared/auth/auth";

import { getDashboard } from "@/server/modules/dashboard/dashboard.service";
import { createRouteHandler } from "@/server/shared/http/route";

export const GET = createRouteHandler(
    async () => {
        const session = await requireAuth();

        const dashboard = await getDashboard(
            session.user.workspace.id
        );

        return ok(dashboard);
})
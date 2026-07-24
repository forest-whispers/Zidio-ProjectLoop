import { NextRequest } from "next/server";

import { ok } from "@/server/shared/http/response";
import { requireAuth } from "@/server/shared/auth/auth";
import { generateReport } from "@/server/modules/report/report.service";
import { createRouteHandler } from "@/server/shared/http/route";

export const POST = createRouteHandler(
    async (request: NextRequest) => {
        const session = await requireAuth();

        const { range = "30d" } = await request.json();

        const report = await generateReport(
            session.user.workspace.id,
            range
        );

        return ok(report);
})
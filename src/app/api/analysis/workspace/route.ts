import { NextRequest } from "next/server";

import { ok } from "@/server/shared/http/response";
import { requireAuth } from "@/server/shared/auth/auth";
import { requireRoles } from "@/server/shared/auth/permissions";
import { createRouteHandler } from "@/server/shared/http/route";

import { prisma } from "@/server/config/db";

import { analyzeWorkspace } from "@/server/modules/analysis/analysis.service";
import { FEEDBACK_WRITE_ROLES } from "@/server/modules/feedback/feedback.constants";

export const POST = createRouteHandler(
    async (_request: NextRequest ) => {
        const session = await requireAuth();
        requireRoles(session.user, FEEDBACK_WRITE_ROLES);

        const workspace = await prisma.workspace.findFirst({
            where: {
                id: session.user.id,
            },
            select: {
                id: true,
            },
        });

        if (!workspace) {
            throw new Error("Workspace not found.");
        }

        const analyses = await analyzeWorkspace(workspace.id);

        return ok(analyses);
});
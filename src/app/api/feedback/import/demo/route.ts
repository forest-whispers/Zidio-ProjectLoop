import { NextRequest } from "next/server";

import { requireAuth } from "@/server/shared/auth/auth";
import { requireRoles } from "@/server/shared/auth/permissions";

import { FEEDBACK_WRITE_ROLES } from "@/server/modules/feedback/feedback.constants";
import { importDemoFeedback } from "@/server/modules/feedback/feedback.import.service";

import { ok } from "@/server/shared/http/response";
import { createRouteHandler } from "@/server/shared/http/route";

export const POST = createRouteHandler(async (_: NextRequest) => {
    const session = await requireAuth();

    requireRoles(session.user, FEEDBACK_WRITE_ROLES);

    const result = await importDemoFeedback(
        session.user.workspace.id
    );

    return ok(result);
});
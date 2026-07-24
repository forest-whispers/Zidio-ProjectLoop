import { NextRequest } from "next/server";

import { ok } from "@/server/shared/http/response";
import { requireAuth } from "@/server/shared/auth/auth";
import { requireRoles } from "@/server/shared/auth/permissions";
import { createRouteHandler } from "@/server/shared/http/route";

import { analyzeFeedbackById } from "@/server/modules/analysis/analysis.service";
import { FEEDBACK_WRITE_ROLES } from "@/server/modules/feedback/feedback.constants";

export const POST = createRouteHandler(
    async (_request: NextRequest, context: any ) => {
        const session = await requireAuth();
        requireRoles(session.user, FEEDBACK_WRITE_ROLES);

        const { feedbackId } = await context.params;

        const analysis = await analyzeFeedbackById(feedbackId);

        return ok(analysis);
    }
);
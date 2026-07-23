import { NextRequest } from "next/server";

import { updateFeedbackStatus } from "@/server/modules/feedback/feedback.service";
import { updateStatusSchema } from "@/server/modules/feedback/feedback.validation";

import { getBody } from "@/server/shared/http/body";
import { createRouteHandler } from "@/server/shared/http/route";
import { FEEDBACK_WRITE_ROLES } from "@/server/modules/feedback/feedback.constants";
import { ok } from "@/server/shared/http/response";
import { requireAuth } from "@/server/shared/auth/auth";
import { requireRoles } from "@/server/shared/auth/permissions";

export const PATCH = createRouteHandler(
    async (request: NextRequest, context: any) => {
        const session = await requireAuth();

        requireRoles(session.user, FEEDBACK_WRITE_ROLES);

        const { id } = await context.params;

        const { status } = updateStatusSchema.parse(
            await getBody(request)
        );

        const feedback = await updateFeedbackStatus(
            session.user.workspace.id,
            id,
            status
        );

        return ok(feedback);
    }
);
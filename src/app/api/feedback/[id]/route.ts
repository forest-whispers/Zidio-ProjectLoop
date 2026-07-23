import { NextRequest } from "next/server";

import {
    deleteFeedback,
    getFeedbackById,
    updateFeedback,
} from "@/server/modules/feedback/feedback.service";
import { updateFeedbackSchema } from "@/server/modules/feedback/feedback.validation";

import { getBody } from "@/server/shared/http/body";
import { createRouteHandler } from "@/server/shared/http/route";
import { FEEDBACK_WRITE_ROLES } from "@/server/modules/feedback/feedback.constants";
import { ok, noContent } from "@/server/shared/http/response";
import { requireAuth } from "@/server/shared/auth/auth";
import { requireRoles } from "@/server/shared/auth/permissions";

export const GET = createRouteHandler(
    async (_: NextRequest, context: any) => {
        const session = await requireAuth();

        const { id } = await context.params;

        const feedback = await getFeedbackById(
            session.user.workspace.id,
            id
        );

        return ok(feedback);
    }
);

export const PATCH = createRouteHandler(
    async (request: NextRequest, context: any) => {
        const session = await requireAuth();

        requireRoles(session.user, FEEDBACK_WRITE_ROLES);

        const { id } = await context.params;

        const dto = updateFeedbackSchema.parse(
            await getBody(request)
        );

        const feedback = await updateFeedback(
            session.user.workspace.id,
            id,
            dto
        );

        return ok(feedback);
    }
);

export const DELETE = createRouteHandler(
    async (_: NextRequest, context: any) => {
        const session = await requireAuth();

        requireRoles(session.user, FEEDBACK_WRITE_ROLES);

        const { id } = await context.params;

        await deleteFeedback(
            session.user.workspace.id,
            id
        );

        return noContent();
    }
);
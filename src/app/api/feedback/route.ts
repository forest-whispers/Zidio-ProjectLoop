import { NextRequest } from "next/server";

import {
    createFeedback,
    getFeedbacks,
} from "@/server/modules/feedback/feedback.service";
import {
    createFeedbackSchema,
    feedbackFiltersSchema,
} from "@/server/modules/feedback/feedback.validation";

import { getBody } from "@/server/shared/http/body";
import { createRouteHandler } from "@/server/shared/http/route";
import { getQuery } from "@/server/shared/http/query";
import { FEEDBACK_WRITE_ROLES } from "@/server/modules/feedback/feedback.constants";
import { created, ok } from "@/server/shared/http/response";
import { requireAuth } from "@/server/shared/auth/auth";
import { requireRoles } from "@/server/shared/auth/permissions";

export const POST = createRouteHandler(async (request: NextRequest) => {
    const session = await requireAuth();

    requireRoles(session.user, FEEDBACK_WRITE_ROLES);

    const body = await getBody(request);

    const dto = createFeedbackSchema.parse(body);

    const feedback = await createFeedback(
        session.user.workspace.id,
        dto
    );

    return created(feedback);
});

export const GET = createRouteHandler(async (request: NextRequest) => {
    const session = await requireAuth();

    const filters = feedbackFiltersSchema.parse(
        getQuery(request)
    );

    const feedbacks = await getFeedbacks(
        session.user.workspace.id,
        filters
    );

    return ok(feedbacks);
});
import { NextRequest } from "next/server";

import { auth } from "@/server/modules/auth/auth";
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
import { created, ok } from "@/server/shared/http/response";
import { UnauthorizedError } from "@/server/shared/errors/errors";

export const POST = createRouteHandler(async (request: NextRequest) => {
    const session = await auth();

    if (!session?.user) {
        throw new UnauthorizedError("Unauthorized.");
    }

    const body = await getBody(request);

    const dto = createFeedbackSchema.parse(body);

    const feedback = await createFeedback(
        session.user.workspace.id,
        dto
    );

    return created(feedback);
});

export const GET = createRouteHandler(async (request: NextRequest) => {
    const session = await auth();

    if (!session?.user) {
        throw new UnauthorizedError("Unauthorized.");
    }

    const filters = feedbackFiltersSchema.parse(
        getQuery(request)
    );

    const feedbacks = await getFeedbacks(
        session.user.workspace.id,
        filters
    );

    return ok(feedbacks);
});
import { NextRequest } from "next/server";

import { auth } from "@/server/modules/auth/auth";
import {
    deleteFeedback,
    getFeedbackById,
    updateFeedback,
} from "@/server/modules/feedback/feedback.service";
import { updateFeedbackSchema } from "@/server/modules/feedback/feedback.validation";

import { getBody } from "@/server/shared/http/body";
import { createRouteHandler } from "@/server/shared/http/route";
import { ok, noContent } from "@/server/shared/http/response";
import { UnauthorizedError } from "@/server/shared/errors/errors";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export const GET = createRouteHandler(
    async (_: NextRequest, context: RouteContext) => {
        const session = await auth();

        if (!session?.user) {
            throw new UnauthorizedError("Unauthorized.");
        }

        const { id } = await context.params;

        const feedback = await getFeedbackById(
            session.user.workspace.id,
            id
        );

        return ok(feedback);
    }
);

export const PATCH = createRouteHandler(
    async (request: NextRequest, context: RouteContext) => {
        const session = await auth();

        if (!session?.user) {
            throw new UnauthorizedError("Unauthorized.");
        }

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
    async (_: NextRequest, context: RouteContext) => {
        const session = await auth();

        if (!session?.user) {
            throw new UnauthorizedError("Unauthorized.");
        }

        const { id } = await context.params;

        await deleteFeedback(
            session.user.workspace.id,
            id
        );

        return noContent();
    }
);
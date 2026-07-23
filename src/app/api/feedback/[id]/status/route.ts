import { NextRequest } from "next/server";

import { auth } from "@/server/modules/auth/auth";
import { updateFeedbackStatus } from "@/server/modules/feedback/feedback.service";
import { updateStatusSchema } from "@/server/modules/feedback/feedback.validation";

import { getBody } from "@/server/shared/http/body";
import { createRouteHandler } from "@/server/shared/http/route";
import { ok } from "@/server/shared/http/response";
import { UnauthorizedError } from "@/server/shared/errors/errors";

interface RouteContext {
    params: Promise<{
        id: string;
    }>;
}

export const PATCH = createRouteHandler(
    async (request: NextRequest, context: RouteContext) => {
        const session = await auth();

        if (!session?.user) {
            throw new UnauthorizedError("Unauthorized.");
        }

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
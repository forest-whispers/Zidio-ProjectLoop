import { NextRequest } from "next/server";

import { requireAuth } from "@/server/shared/auth/auth";
import { ok } from "@/server/shared/http/response";
import { createRouteHandler } from "@/server/shared/http/route";

import { askLoop } from "@/server/modules/askLoop/askLoop.service";

export const POST = createRouteHandler(
    async ( request: NextRequest ) => {
        const session = await requireAuth();

        const { question } = await request.json();

        if (!question || typeof question !== "string") {

            throw new Error("Question is required.");
        }

        const response = await askLoop(
                session.user.workspace.id,
                question
            );

        return ok(response);
})
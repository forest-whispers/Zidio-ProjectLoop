import { NextRequest } from "next/server";

import { createRouteHandler } from "@/server/shared/http/route";
import { created } from "@/server/shared/http/response";
import { getBody } from "@/server/shared/http/body";

import { signUpSchema } from "@/server/modules/auth/auth.validation";
import { signUp } from "@/server/modules/auth/auth.service";

export const POST = createRouteHandler(async (request: NextRequest) => {
    const body = await getBody(request);

    const dto = signUpSchema.parse(body);

    const { user, workspace } = await signUp(dto);

    return created({
        message: "Account created successfully.",

        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        },

        workspace: {
            id: workspace.id,
            name: workspace.name,
            slug: workspace.slug,
        },
    });
});
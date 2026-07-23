import { NextRequest } from "next/server";

import { requireAuth } from "@/server/shared/auth/auth";
import { requireRoles } from "@/server/shared/auth/permissions";

import { FEEDBACK_WRITE_ROLES } from "@/server/modules/feedback/feedback.constants";
import { importFeedbackCsv } from "@/server/modules/feedback/feedback.import.service";

import { ok } from "@/server/shared/http/response";
import { BadRequestError } from "@/server/shared/errors/errors";
import { createRouteHandler } from "@/server/shared/http/route";

export const POST = createRouteHandler(async (request: NextRequest) => {
    const session = await requireAuth();

    requireRoles(session.user, FEEDBACK_WRITE_ROLES);

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
        throw new BadRequestError("CSV file is required.");
    }

    if (!file.name.toLowerCase().endsWith(".csv")) {
        throw new BadRequestError("Only CSV files are supported.");
    }

    const result = await importFeedbackCsv(
        session.user.workspace.id,
        file
    );

    return ok(result);
});
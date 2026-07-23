import { NextRequest, NextResponse } from "next/server";

import { AppError } from "@/server/shared/errors/AppError";

type RouteContext = {
    params?: Record<string, string>;
};

type RouteHandler = (
    request: NextRequest,
    context: RouteContext
) => Promise<NextResponse>;

export function createRouteHandler(handler: RouteHandler) {
    return async (
        request: NextRequest,
        context: RouteContext
    ): Promise<NextResponse> => {
        try {
            return await handler(request, context);
        } catch (error) {
            if (error instanceof AppError) {
                return NextResponse.json(
                    {
                        message: error.message,
                    },
                    {
                        status: error.statusCode,
                    }
                );
            }

            console.error(error);

            return NextResponse.json(
                {
                    message: "Internal Server Error",
                },
                {
                    status: 500,
                }
            );
        }
    };
}
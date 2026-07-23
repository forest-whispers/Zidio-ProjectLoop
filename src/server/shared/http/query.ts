import { NextRequest } from "next/server";

export function getQuery(request: NextRequest) {
    return request.nextUrl.searchParams;
}
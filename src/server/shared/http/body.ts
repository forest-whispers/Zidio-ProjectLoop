import { NextRequest } from "next/server";

export async function getBody<T>(request: NextRequest) {
    return (await request.json()) as T;
}
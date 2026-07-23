import { z } from "zod";

export const signUpSchema = z.discriminatedUnion("mode", [
    z.object({
        mode: z.literal("create"),

        name: z.string().trim().min(2).max(100),

        email: z.string().trim().email(),

        password: z.string().min(8).max(100),

        workspaceName: z.string().trim().min(2).max(100),
    }),

    z.object({
        mode: z.literal("join"),

        name: z.string().trim().min(2).max(100),

        email: z.string().trim().email(),

        password: z.string().min(8).max(100),

        workspaceSlug: z.string().trim().min(2).max(100),

        role: z.enum(["ANALYST", "VIEWER"]),
    }),
]);

export const loginSchema = z.object({
    email: z.string().trim().email(),

    password: z.string().min(1),
});
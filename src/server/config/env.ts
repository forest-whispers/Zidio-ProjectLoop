import { config } from "dotenv";
import { z } from "zod";

config();

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),

    DATABASE_URL: z.string(),

    AUTH_SECRET: z.string(),

    NEXTAUTH_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
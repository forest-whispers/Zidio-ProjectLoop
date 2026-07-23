import { z } from "zod";
import { FeatureArea } from "@prisma/client";

// const featureAreas = [
//     "DASHBOARD",
//     "PERFORMANCE",
//     "AUTHENTICATION",
//     "BILLING",
//     "ANALYTICS",
//     "COLLABORATION",
//     "SEARCH",
//     "MOBILE",
//     "NOTIFICATIONS",
//     "EXPORTS",
//     "AI",
//     "UI_UX",
//     "OTHER",
// ] as const;

export const analysisSchema = z.object({
    sentiment: z.enum([
        "POSITIVE",
        "NEUTRAL",
        "NEGATIVE",
    ]),

    sentimentScore: z
        .number()
        .min(0)
        .max(1),

    featureArea: z.enum(FeatureArea),

    themes: z
        .array(z.string())
        .min(1)
        .max(5),

    keywords: z
        .array(z.string())
        .max(10),

    summary: z
        .string()
        .min(10)
        .max(300),
});

export type AnalysisSchema = z.infer<typeof analysisSchema>;
import { z } from "zod";

const feedbackChannels = [
    "SUPPORT_TICKET",
    "APP_STORE",
    "PLAY_STORE",
    "TWITTER",
    "SALES_CALL",
    "SURVEY",
    "COMMUNITY",
    "CSV_IMPORT",
    "MANUAL",
] as const;

const feedbackStatuses = [
    "SUBMITTED",
    "UNDER_REVIEW",
    "IN_PROGRESS",
    "RESOLVED",
    "CLOSED",
] as const;

const sentiments = [
    "POSITIVE",
    "NEUTRAL",
    "NEGATIVE",
] as const;

export const createFeedbackSchema = z.object({
    content: z
        .string()
        .trim()
        .min(5)
        .max(5000),

    channel: z.enum(feedbackChannels),

    customerLabel: z
        .string()
        .trim()
        .max(100)
        .optional(),
});

export const updateFeedbackSchema = z.object({
    content: z
        .string()
        .trim()
        .min(5)
        .max(5000)
        .optional(),

    channel: z
        .enum(feedbackChannels)
        .optional(),

    customerLabel: z
        .string()
        .trim()
        .max(100)
        .optional(),
});

export const updateStatusSchema = z.object({
    status: z.enum(feedbackStatuses),
});

export const feedbackFiltersSchema = z.object({
    search: z.string().trim().optional(),

    channel: z.enum(feedbackChannels).optional(),

    status: z.enum(feedbackStatuses).optional(),

    sentiment: z.enum(sentiments).optional(),

    page: z.coerce
        .number()
        .min(1)
        .default(1),

    limit: z.coerce
        .number()
        .min(1)
        .max(100)
        .default(20),
});
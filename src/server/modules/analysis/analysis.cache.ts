import { prisma } from "@/server/config/db";
import { FeatureArea, Sentiment } from "@prisma/client";

import type { AnalysisResult } from "./analysis.types";

import { ANALYSIS_CONSTANTS } from "./analysis.constants";

export interface SaveEmbeddingInput {
    feedbackId: string;

    provider: string;

    model: string;

    embedding: number[];
}

export interface FindNearestFeedbackInput {
    workspaceId: string;

    embedding: number[];

    limit?: number;

    similarityThreshold?: number;
}

export interface SimilarFeedback {
    feedbackId: string;

    similarity: number;

    analysis: AnalysisResult;
}

export async function saveEmbedding({
    feedbackId,
    provider,
    model,
    embedding,
}: SaveEmbeddingInput) {
    // return prisma.feedbackEmbedding.upsert({
    //     where: {
    //         feedbackId,
    //     },

    //     create: {
    //         feedbackId,
    //         provider,
    //         model,
    //         embedding: embedding as unknown as Prisma.InputJsonValue,
    //     },

    //     update: {
    //         provider,
    //         model,
    //         embedding: embedding as unknown as Prisma.InputJsonValue,
    //     },
    // });

    await prisma.$executeRaw`
    INSERT INTO "FeedbackEmbedding"
    (
        "id",
        "feedbackId",
        "provider",
        "model",
        "embedding",
        "createdAt",
        "updatedAt"
    )
    VALUES
    (
        gen_random_uuid(),
        ${feedbackId},
        ${provider},
        ${model},
        ${JSON.stringify(embedding)}::vector,
        NOW(),
        NOW()
    )
    ON CONFLICT ("feedbackId")
    DO UPDATE SET
        "provider" = EXCLUDED."provider",
        "model" = EXCLUDED."model",
        "embedding" = EXCLUDED."embedding",
        "updatedAt" = NOW();
`;
}

export async function deleteEmbedding(
    feedbackId: string
) {
    await prisma.feedbackEmbedding.delete({
        where: {
            feedbackId,
        },
    });
}

export async function findNearestFeedbacks({
    workspaceId,
    embedding,
    limit = 1,
    similarityThreshold = ANALYSIS_CONSTANTS.DEFAULT_SIMILARITY_THRESHOLD,
}: FindNearestFeedbackInput): Promise<SimilarFeedback[]> 
{
    const rows = await prisma.$queryRaw<
        Array<{
            feedbackId: string;

            similarity: number;

            sentiment: string;

            sentimentScore: number;

            summary: string;

            featureArea: string;

            keywords: string[];

            themes: string[];
        }>
    >
    // `
    // SELECT

    // fe."feedbackId",

    // 1 - (fe.embedding <=> ${JSON.stringify(
    //         embedding
    //     )}::vector) AS similarity,

    // fa.sentiment,

    // fa."sentimentScore",

    // fa.summary,

    // fa."featureArea",

    // fa.keywords

    // FROM "FeedbackEmbedding" fe

    // JOIN "FeedbackAnalysis" fa

    // ON fa."feedbackId" = fe."feedbackId"

    // JOIN "Feedback" f

    // ON f.id = fe."feedbackId"

    // WHERE

    // f."workspaceId" = ${workspaceId}

    // AND

    // 1 - (fe.embedding <=> ${JSON.stringify(
    //         embedding
    //     )}::vector)

    // >= ${similarityThreshold}

    // ORDER BY

    // fe.embedding <=> ${JSON.stringify(
    //         embedding
    //     )}::vector

    // LIMIT ${limit}
    // `;
        `
    SELECT
        fe."feedbackId",
        1 - (fe.embedding <=> ${JSON.stringify(embedding)}::vector) AS similarity,
        fa.sentiment,
        fa."sentimentScore",
        fa.summary,
        fa."featureArea",
        fa.keywords,
        COALESCE(
            ARRAY_AGG(t.name) FILTER (WHERE t.name IS NOT NULL), 
            ARRAY[]::text[]
        ) AS themes
    FROM "FeedbackEmbedding" fe
    JOIN "FeedbackAnalysis" fa ON fa."feedbackId" = fe."feedbackId"
    JOIN "Feedback" f ON f.id = fe."feedbackId"
    LEFT JOIN "FeedbackTheme" ft ON ft."feedbackId" = fe."feedbackId"
    LEFT JOIN "Theme" t ON t.id = ft."themeId"
    WHERE
        f."workspaceId" = ${workspaceId}
        AND 1 - (fe.embedding <=> ${JSON.stringify(embedding)}::vector) >= ${similarityThreshold}
    GROUP BY fe."feedbackId", fe.embedding, fa.sentiment, fa."sentimentScore", fa.summary, fa."featureArea", fa.keywords
    ORDER BY fe.embedding <=> ${JSON.stringify(embedding)}::vector
    LIMIT ${limit}
    `;

    return rows.map((row) => ({
        feedbackId: row.feedbackId,

        similarity: Number(row.similarity),

        analysis: {
            sentiment: row.sentiment as Sentiment,

            sentimentScore: row.sentimentScore,

            summary: row.summary,

            featureArea: row.featureArea as FeatureArea,

            keywords: row.keywords,

            // themes: [],
            themes: row.themes,
        },
}))};
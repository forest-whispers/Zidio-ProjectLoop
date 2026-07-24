import { prisma } from "@/server/config/db";
import { SimilarFeedback } from "./vector-search-interface";
import { ANALYSIS_CONSTANTS } from "@/server/modules/analysis/analysis.constants";
import { FeatureArea, FeedbackChannel, Sentiment } from "@prisma/client";
import { FindNearestFeedbackInput } from "./vector-search-interface";

export async function findNearestFeedbacks({
    workspaceId,
    embedding,
    limit = 1,
    similarityThreshold = ANALYSIS_CONSTANTS.DEFAULT_SIMILARITY_THRESHOLD,
}: FindNearestFeedbackInput): Promise<SimilarFeedback[]> {
    const rows = await prisma.$queryRaw<
        Array<{
            feedbackId: string;

            similarity: number;

            sentiment: string;

            sentimentScore: number;

            content: string;

            channel: FeedbackChannel;

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
        f.content,
        f.channel,
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

        content: row.content,

        channel: row.channel,

        analysis: {
            sentiment: row.sentiment as Sentiment,

            sentimentScore: row.sentimentScore,

            summary: row.summary,

            featureArea: row.featureArea as FeatureArea,

            keywords: row.keywords,

            // themes: [],
            themes: row.themes,
        },
    }))
};
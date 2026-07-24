import { prisma } from "@/server/config/db";

import { normalizeFeedback } from "./analysis.normalize";

import {
    analyzeFeedback,
    generateEmbedding,
} from "./analysis.client";

import {
    saveEmbedding,
    findNearestFeedbacks,
} from "./analysis.cache";

import type { AnalysisResult } from "./analysis.types";

import { ANALYSIS_CONSTANTS } from "./analysis.constants";
import { NotFoundError } from "@/server/shared/errors/errors";

async function persistAnalysis(
    feedbackId: string,
    workspaceId: string,
    analysis: AnalysisResult
) {
    return prisma.$transaction(async (tx) => {
        // create analysis
        const savedAnalysis = await tx.feedbackAnalysis.create({
                data: {
                    feedbackId,

                    sentiment:
                        analysis.sentiment,

                    sentimentScore:
                        analysis.sentimentScore,

                    summary:
                        analysis.summary,

                    featureArea:
                        analysis.featureArea,

                    keywords:
                        analysis.keywords,

                    provider:
                        ANALYSIS_CONSTANTS.ANALYSIS_PROVIDER,

                    model:
                        ANALYSIS_CONSTANTS.ANALYSIS_MODEL_NAME,
                },
            });

        for (const name of analysis.themes) {
            const theme = await tx.theme.upsert({
                    where: {
                        workspaceId_name: {
                            workspaceId,
                            name,
                        },
                    },

                    update: {},

                    create: {
                        workspaceId,

                        name,

                        color:
                            ANALYSIS_CONSTANTS.DEFAULT_THEME_COLOR,
                    },
                });

            await tx.feedbackTheme.create({
                data: {
                    feedbackId,

                    themeId: theme.id,
                },
                });
        }
        return savedAnalysis;
    });
}

async function reuseCachedAnalysis(
    feedbackId: string,
    workspaceId: string,
    cached: AnalysisResult
) {

    // TODO:
    // Copy FeedbackTheme relations from the cached feedback instead of
    // relying on AnalysisResult.themes.

    return persistAnalysis(
        feedbackId,
        workspaceId,
        cached
    );
}

export async function analyzeFeedbackById(
    feedbackId: string
) {
    // Load feedback
    const feedback = await prisma.feedback.findUnique({
        where: {
            id: feedbackId,
        },
        include: {
            analysis: true,
        },
    });

    if (!feedback) {
        throw new NotFoundError("Feedback not found.");
    }

    // Already analyzed? Return existing
    if (feedback.analysis) {
        console.log("feedback already analyzed, returning cached")
        return feedback.analysis;
    }

    // normalize feedback for better and fast similarity searches(before storing)
    const normalized = normalizeFeedback(
        feedback.content
    );

    // Generate embedding
    const embedding = await generateEmbedding(
        normalized
    );
    console.log("generated embeddings", embedding)

    // Semantic cache
    const [cached] = await findNearestFeedbacks({
        workspaceId: feedback.workspaceId,
        embedding,
        limit: 1,
    });

    // Save embedding immediately insetead of waiting for analysis to finish, anyhow where failed or not, cache hit can occur if failed
    await saveEmbedding({
        feedbackId,

        provider: ANALYSIS_CONSTANTS.EMBEDDING_PROVIDER,

        model: ANALYSIS_CONSTANTS.EMBEDDING_MODEL_NAME,

        embedding,
    });

    // Cache hit? Reuse analysis
    if (
        cached &&
        cached.similarity >=
        ANALYSIS_CONSTANTS.DEFAULT_SIMILARITY_THRESHOLD
    ) {
        console.log("feedback analysis returned from cached similarities")
        return reuseCachedAnalysis(
            feedbackId,
            feedback.workspaceId,
            cached.analysis
        );
    }

    // otherwise make analysis
    const analysis = await analyzeFeedback(
        normalized
    );

    console.log("feedback analyzed")

    // persist analysis
    return persistAnalysis(
        feedbackId,
        feedback.workspaceId,
        analysis
    );
}

// Analyzes all unanalyzed feedback entries within a given workspace.
export async function analyzeWorkspace(workspaceId: string) {
    // Get all feedback without analysis in the workspace
    const unanalyzedFeedbacks = await prisma.feedback.findMany({
        where: {
            workspaceId,
            analysis: null,
        },
        select: {
            id: true,
        },
    });

    const results = [];

    // Iterate sequentially to process each feedback item
    for (const feedback of unanalyzedFeedbacks) {
        try {
            const analysis = await analyzeFeedbackById(feedback.id);
            results.push(analysis);
        } catch (error) {
            console.error(
                `[analyzeWorkspace] Failed to analyze feedback ${feedback.id}:`,
                error
            );
        }
    }

    return results;
}
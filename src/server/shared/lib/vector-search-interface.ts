import { AnalysisResult } from "@/server/modules/analysis/analysis.types";
import { FeedbackChannel } from "@prisma/client";

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

    content: string;

    channel: FeedbackChannel;
}
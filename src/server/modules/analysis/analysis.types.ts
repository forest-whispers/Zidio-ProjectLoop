import { FeatureArea, Sentiment } from "@prisma/client";

export interface AnalysisResult {
    sentiment: Sentiment;

    sentimentScore: number;

    featureArea: FeatureArea;

    themes: string[];

    keywords: string[];

    summary: string;
}

export interface CachedAnalysis {
    similarity: number;

    analysis: AnalysisResult;
}

export interface AnalyzeFeedbackInput {
    feedbackId: string;

    workspaceId: string;
}

export interface EmbeddingMetadata {
    provider: string;

    model: string;
}

export interface AnalysisMetadata {
    provider: string;

    model: string;

    processingTimeMs: number;

    cached: boolean;
}
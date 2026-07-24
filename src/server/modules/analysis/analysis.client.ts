import { embed, generateText, Output, APICallError } from "ai";
import { google } from "@ai-sdk/google";

import { analysisSchema } from "./analysis.validation";
import { buildAnalysisPrompt } from "./analysis.prompts";
import type { AnalysisResult } from "./analysis.types";
import { ANALYSIS_CONSTANTS } from "./analysis.constants";

const ANALYSIS_MODEL = google(ANALYSIS_CONSTANTS.ANALYSIS_MODEL_NAME);

// // FIX: Use google.textEmbedding or google.embedding instead of textEmbeddingModel
// const EMBEDDING_MODEL = google.textEmbedding("text-embedding-004");

// FIX 1: Use 'google.embedding' and the updated 'gemini-embedding-001' or 'gemini-embedding-2' model
const EMBEDDING_MODEL = google.embedding(ANALYSIS_CONSTANTS.EMBEDDING_MODEL_NAME);

export async function analyzeFeedback(
    feedback: string
): Promise<AnalysisResult> {
    try {
        // FIX 2: Use generateText with Output.object instead of generateObject
        const { output } = await generateText({
            model: ANALYSIS_MODEL,

            output: Output.object({
                schema: analysisSchema,
            }),

            prompt: buildAnalysisPrompt(feedback),

            temperature: 0.2,

            maxRetries: 2
        });

        return output;
    } catch (error) {
        if (APICallError.isInstance(error) && error.statusCode === 429) {
            console.warn("Gemini API rate limit exceeded. Please wait before trying again.");
        }
        throw new Error("Failed to analyze feedback.", {
            cause: error,
        });
    }
}

export async function generateEmbedding(
    text: string
): Promise<number[]> {
    try {
        const { embedding } = await embed({
            model: EMBEDDING_MODEL,

            value: text,

            providerOptions: {
                google: {
                    outputDimensionality: 768,
                },
            },
        });

        return embedding;
    } catch (error) {
        throw new Error("Failed to generate embedding.", {
            cause: error,
        });
    }
}
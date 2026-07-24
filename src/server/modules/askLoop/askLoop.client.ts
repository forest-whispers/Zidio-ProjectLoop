import { embed, generateText, APICallError } from "ai";
import { google } from "@ai-sdk/google";

import { ANALYSIS_CONSTANTS } from "@/server/modules/analysis/analysis.constants";

const MODEL = google(ANALYSIS_CONSTANTS.ANALYSIS_MODEL_NAME);
const EMBEDDING_MODEL = google.embedding(ANALYSIS_CONSTANTS.EMBEDDING_MODEL_NAME);

export async function generateGroundedAnswer(
    prompt: string
) {
    try {
        const { text } = await generateText({

            model: MODEL,

            prompt,
        });

        return text;
    } catch (error) {
        if (APICallError.isInstance(error) && error.statusCode === 429) {
            console.warn("Gemini API rate limit exceeded. Please wait before trying again.");
        }
        throw new Error("Failed to analyze feedback.", {
            cause: error,
        });
    }
}

export async function generateQuestionEmbedding(
    question: string
) {
    try {
        const { embedding } = await embed({

            model: EMBEDDING_MODEL,

            value: question,

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
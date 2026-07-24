import { generateText, APICallError } from "ai";
import { google } from "@ai-sdk/google";

import { ANALYSIS_CONSTANTS } from "@/server/modules/analysis/analysis.constants";

const MODEL = google(ANALYSIS_CONSTANTS.ANALYSIS_MODEL_NAME);

export async function generateExecutiveReport(
    prompt: string
) {

    try {

        const { text } = await generateText({
                model: MODEL,
                prompt,
            });

        return text;

    } catch (error) {

        if (APICallError.isInstance(error) &&error.statusCode === 429) {

            console.warn("Gemini API rate limit exceeded.");

        }

        throw new Error(
            "Failed to generate executive report.",
            {
                cause: error,
            }
        );
    }
}
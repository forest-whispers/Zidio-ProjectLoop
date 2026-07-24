import {
    generateQuestionEmbedding,
    generateGroundedAnswer,
} from "./askLoop.client";

import { buildAskLoopPrompt } from "./askLoop.prompt";

import type {
    AskLoopResponse,
    Citation,
} from "./askLoop.types";
import { findNearestFeedbacks } from "@/server/shared/lib/vector-search";

export async function askLoop(
    workspaceId: string,
    question: string
): Promise<AskLoopResponse> {

    const embedding = await generateQuestionEmbedding(
            question
        );

    const feedbacks = await findNearestFeedbacks({
            workspaceId,
            embedding,
            limit: 8,
        });

    const citations: Citation[] =
        feedbacks.map(feedback => ({

            feedbackId:
                feedback.feedbackId,

            similarity:
                Number(
                    feedback.similarity.toFixed(2)
                ),

            content:
                feedback.content,

            summary:
                feedback.analysis.summary,

            sentiment:
                feedback.analysis.sentiment,

            featureArea:
                feedback.analysis.featureArea,

            channel:
                feedback.channel,

            themes:
                feedback.analysis.themes,
        }));

    if (!citations.length) {

        return {
            answer:
                "I couldn't find enough relevant feedback to answer this question.",
            citations: [],
        };
    }

    const prompt = buildAskLoopPrompt(
            question,
            citations
        );

    const answer = await generateGroundedAnswer(prompt);

    return {

        answer,

        citations,
    };
}
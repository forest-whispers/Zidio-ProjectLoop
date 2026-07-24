import type { Citation } from "./askLoop.types";

export function buildAskLoopPrompt(
    question: string,
    feedbacks: Citation[]
) {

    const context = feedbacks.map((feedback, index) =>
`
Feedback ${index + 1}

Channel: ${feedback.channel}

Sentiment: ${feedback.sentiment}

Feature Area: ${feedback.featureArea}

Themes:
${feedback.themes.map(theme => `- ${theme}`).join("\n")}

Summary:
${feedback.summary}

Original Feedback:
${feedback.content}

----------------------------------------
`
        )
        .join("\n");

    return `
You are LOOP, an AI product feedback intelligence assistant.

Use ONLY the feedback provided below.

Rules:

- Answer only from the provided context.
- Never invent information.
- If there is insufficient evidence, explicitly say:
"I couldn't find enough evidence in the available feedback."
- Prefer summaries over quoting raw feedback.
- If multiple feedback items agree, mention that they consistently indicate the same issue.
- Keep answers concise, factual and actionable.

========================================

${context}

========================================

User Question:

${question}
`;
}
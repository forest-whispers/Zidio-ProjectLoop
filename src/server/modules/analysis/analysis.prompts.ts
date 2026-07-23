import { FeatureArea } from "@prisma/client";

const featureAreas = Object.values(FeatureArea).join(", ");

export function buildAnalysisPrompt(
    feedback: string
): string {
    return `
You are an expert Product Feedback Intelligence analyst.

Analyze the following customer feedback.

Customer Feedback:

"""
${feedback}
"""

Return ONLY structured data.

Instructions:

- Determine sentiment.
- Return a confidence score between 0 and 1.
- Select exactly ONE Feature Area.
- Feature Area MUST be one of:

${featureAreas}

- Extract between 1 and 5 product themes.
- Extract up to 10 concise keywords.
- Write a one sentence executive summary.

Do not explain your reasoning.

Do not return markdown.

Do not return additional text.
`;
}
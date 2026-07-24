import type {
    AnalyticsResponse
} from "../analytics/analytics.types";

export function buildExecutiveReportPrompt(
    analytics: AnalyticsResponse,
    feedback: {
        summary: string;
        sentiment: string;
        featureArea: string;
        themes: string[];
    }[]
) {

    return `
You are an experienced Product Manager preparing an executive report.

Generate a professional markdown report.

The report should contain these sections.

# Executive Summary

# Customer Sentiment

# Key Pain Points

# Positive Highlights

# Emerging Trends

# Recommended Priorities

# Product Recommendations

Only use the information provided.

Never invent data.

Analytics

${JSON.stringify(analytics, null, 2)}

Representative Feedback

${feedback.map(feedback =>
`
Summary:
${feedback.summary}

Sentiment:
${feedback.sentiment}

Feature Area:
${feedback.featureArea}

Themes:
${feedback.themes.join(", ")}
`
            )
            .join("\n")}
`;
}
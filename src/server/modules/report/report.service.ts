import { prisma } from "@/server/config/db";

import { getAnalytics } from "../analytics/analytics.service";

import {
    buildExecutiveReportPrompt,
} from "./report.prompt";

import {
    generateExecutiveReport,
} from "./report.client";

import type {
    ExecutiveReportResponse,
    ReportRange,
} from "./report.types";

export async function generateReport(
    workspaceId: string,
    range: ReportRange
): Promise<ExecutiveReportResponse> {

    const analytics = await getAnalytics(
            workspaceId,
            range
        );

    const feedback = await prisma.feedback.findMany({
        where: {
            workspaceId,
        },

        include: {
            analysis: {
                select: {
                    summary: true,
                    sentiment: true,
                    featureArea: true,
                },
            },

            themes: {
                include: {
                    theme: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },

        take: 30,
    });

    const representativeFeedback = feedback
        .filter(item => item.analysis)
        .map(item => ({
            summary: item.analysis!.summary,
            sentiment: item.analysis!.sentiment,
            featureArea: item.analysis!.featureArea,
            themes: item.themes.map(t => t.theme.name),
    }));

    const prompt = buildExecutiveReportPrompt(
            analytics,
            representativeFeedback
        );

    const report = await generateExecutiveReport(
            prompt
        );

    return {
        title: "Executive Product Feedback Report",
        generatedAt: new Date().toISOString(),
        range,
        report,
    };
}
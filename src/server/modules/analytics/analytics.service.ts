import { Prisma } from "@prisma/client";

import { prisma } from "@/server/config/db";

import type {
    AnalyticsResponse,
    AnalyticsRange,
    Distribution,
    OverviewMetrics,
    VolumeTrend,
    ThemeDistribution,
    NegativeFeedback,
    AIInsights,
    NewThisWeek,
    ThemeTrend,
} from "./analytics.types";

function percentage(value: number, total: number) {
    if (total === 0) return 0;

    return Number(((value / total) * 100).toFixed(1));
}

function getDateRange(range: AnalyticsRange) {
    const endDate = new Date();
    const startDate = new Date();

    switch (range) {
        case "7d":
            startDate.setDate(endDate.getDate() - 7);
            break;

        case "30d":
            startDate.setDate(endDate.getDate() - 30);
            break;

        case "90d":
            startDate.setDate(endDate.getDate() - 90);
            break;

        case "1y":
            startDate.setFullYear(endDate.getFullYear() - 1);
            break;

        case "all":
            return undefined;
    }

    return {
        gte: startDate,
        lte: endDate,
    };
}

function buildWhereClause(
    workspaceId: string,
    range: AnalyticsRange
): Prisma.FeedbackWhereInput {

    const dateRange = getDateRange(range);

    return {
        workspaceId,

        ...(dateRange && {
            createdAt: dateRange,
        }),
    };
}

async function getOverview(
    where: Prisma.FeedbackWhereInput
): Promise<OverviewMetrics> {

    const [
        totalFeedback,
        analyzedFeedback,
        reviewedFeedback,
        sentiments,
        themeDistribution
    ] = await Promise.all([

        prisma.feedback.count({
            where,
        }),

        prisma.feedbackAnalysis.count({
            where: {
                feedback: where,
            },
        }),

        prisma.feedback.count({
            where: {
                ...where,
                status: "RESOLVED",
            },
        }),

        prisma.feedbackAnalysis.groupBy({
            by: ["sentiment"],

            _count: true,

            where: {
                feedback: where,
            },
        }),

        getThemeDistribution(where)
    ]);

    const positive = sentiments.find(
            s => s.sentiment === "POSITIVE"
        )?._count ?? 0;

    const negative = sentiments.find(
            s => s.sentiment === "NEGATIVE"
        )?._count ?? 0;

    const activeThemes = themeDistribution.length;

    return {
        totalFeedback,

        analyzedFeedback,

        positivePercentage:
            percentage(
                positive,
                analyzedFeedback
            ),

        negativePercentage:
            percentage(
                negative,
                analyzedFeedback
            ),

        reviewedPercentage:
            percentage(
                reviewedFeedback,
                totalFeedback
            ),

        activeThemes,
    };
}

async function getSentimentDistribution(
    where: Prisma.FeedbackWhereInput
): Promise<Distribution[]> {

    const sentiments = await prisma.feedbackAnalysis.groupBy({

            by: ["sentiment"],

            _count: true,

            where: {
                feedback: where,
            },
        });

    const total = sentiments.reduce(
            (sum, item) => sum + item._count,
            0
        );

    return sentiments.map(item => ({
        label: item.sentiment,

        value: item._count,

        percentage:
            percentage(
                item._count,
                total
            ),
    }));
}

async function getFeatureAreaDistribution(
    where: Prisma.FeedbackWhereInput
): Promise<Distribution[]> {

    const features = await prisma.feedbackAnalysis.groupBy({

            by: ["featureArea"],

            _count: true,

            where: {
                feedback: where,
            },
        });

    const total = features.reduce(
            (sum, item) => sum + item._count,
            0
        );

    return features.map(item => ({
        label: item.featureArea,

        value: item._count,

        percentage:
            percentage(
                item._count,
                total
            ),
    }));
}

async function getVolumeTrend(
    where: Prisma.FeedbackWhereInput
): Promise<VolumeTrend[]> {

    const createdAt = where.createdAt as
        | Prisma.DateTimeFilter
        | undefined;

    const rows = await prisma.$queryRaw<
        {
            date: Date;
            count: bigint;
        }[]
    >`
        SELECT
            date_trunc('day', "createdAt") AS date,
            COUNT(*)::bigint AS count
        FROM "Feedback"
        WHERE
            "workspaceId" = ${where.workspaceId as string}
            ${createdAt
            ? Prisma.sql`
                        AND "createdAt"
                        BETWEEN ${createdAt.gte as Date}
                        AND ${createdAt.lte as Date}
                    `
            : Prisma.empty
        }
        GROUP BY date
        ORDER BY date ASC
    `;

    return rows.map(row => ({
        date: row.date.toISOString().split("T")[0],
        count: Number(row.count),
    }));
}

async function getThemeDistribution(
    where: Prisma.FeedbackWhereInput
): Promise<ThemeDistribution[]> {

    const themes = await prisma.feedbackTheme.groupBy({

        by: ["themeId"],

        _count: true,

        where: {
            feedback: where,
        },
    });

    if (!themes.length) {
        return [];
    }

    const total = themes.reduce(
        (sum, item) => sum + item._count,
        0
    );

    const themeDetails = await prisma.theme.findMany({

        where: {
            id: {
                in: themes.map(theme => theme.themeId),
            },
        },

        select: {
            id: true,
            name: true,
            color: true,
        },
    });

    const themeMap = new Map(
        themeDetails.map(theme => [
            theme.id,
            theme,
        ])
    );

    return themes
        .map(item => {

            const theme = themeMap.get(item.themeId);

            if (!theme) {
                return null;
            }

            return {

                id: theme.id,

                name: theme.name,

                color: theme.color,

                count: item._count,

                percentage: percentage(
                    item._count,
                    total
                ),
            };

        })
        .filter(
            (theme): theme is ThemeDistribution =>
                theme !== null
        )
        .sort(
            (a, b) =>
                b.count - a.count
        );
}

async function getThemeTrends(
    workspaceId: string,
    range: AnalyticsRange
): Promise<ThemeTrend[]> {

    if (range === "all") {
        return [];
    }

    const currentRange = getDateRange(range);

    if (!currentRange) {
        return [];
    }

    const start = currentRange.gte;
    const end = currentRange.lte;

    const duration = end.getTime() - start.getTime();

    const previousStart = new Date( start.getTime() - duration);

    const previousEnd = new Date(start);

    const currentThemes = await getThemeDistribution({
            workspaceId,
            createdAt: {
                gte: start,
                lte: end,
            },
        });

    const previousThemes = await getThemeDistribution({
            workspaceId,
            createdAt: {
                gte: previousStart,
                lte: previousEnd,
            },
        });

    const previousMap = new Map(
        previousThemes.map(theme => [
            theme.id,
            theme,
        ])
    );

    return currentThemes.map(theme => {

        const previous = previousMap.get(theme.id);

        const previousCount = previous?.count ?? 0;

        let percentageChange = 100;

        if (previousCount > 0) {

            percentageChange = Number(
                (
                    ((theme.count - previousCount) /
                        previousCount) *
                    100
                ).toFixed(1)
            );
        }

        return {

            id: theme.id,

            name: theme.name,

            color: theme.color,

            currentCount: theme.count,

            previousCount,

            percentageChange,
        };

    }).sort(
        (a, b) =>
            Math.abs(b.percentageChange) -
            Math.abs(a.percentageChange)
    );
}

async function getChannelDistribution(
    where: Prisma.FeedbackWhereInput
): Promise<Distribution[]> {

    const channels = await prisma.feedback.groupBy({

            by: ["channel"],

            _count: true,

            where,
        });

    const total = channels.reduce(
            (sum, item) =>
                sum + item._count,
            0
        );

    return channels.map(item => ({
        label: item.channel,

        value: item._count,

        percentage:
            percentage(
                item._count,
                total
            ),
    }));
}

async function getStatusDistribution(
    where: Prisma.FeedbackWhereInput
): Promise<Distribution[]> {

    const statuses = await prisma.feedback.groupBy({

            by: ["status"],

            _count: true,

            where,
        });

    const total = statuses.reduce(
            (sum, item) =>
                sum + item._count,
            0
        );

    return statuses.map(item => ({
        label: item.status,

        value: item._count,

        percentage:
            percentage(
                item._count,
                total
            ),
    }));
}

async function getTopNegativeFeedback(
    where: Prisma.FeedbackWhereInput
): Promise<NegativeFeedback[]> {

    const feedbacks = await prisma.feedback.findMany({

            where: {
                ...where,

                analysis: {
                    sentiment: "NEGATIVE",
                },
            },

            include: {
                analysis: {
                    select: {
                        sentimentScore: true,
                    },
                },
            },

            orderBy: {
                analysis: {
                    sentimentScore: "desc",
                },
            },

            take: 5,
        });

    return feedbacks.map(feedback => ({
        id: feedback.id,

        content: feedback.content,

        channel: feedback.channel,

        createdAt: feedback.createdAt,

        sentimentScore:
            feedback.analysis!.sentimentScore,
    }));
}

async function getAIInsights(
    where: Prisma.FeedbackWhereInput,
    themeDistribution: ThemeDistribution[]
): Promise<AIInsights> {

    const [

        positiveArea,

        negativeArea,

        average,
    ] = await Promise.all([

        prisma.feedbackAnalysis.groupBy({

            by: ["featureArea"],

            _avg: {
                sentimentScore: true,
            },

            where: {
                feedback: where,

                sentiment: "POSITIVE",
            },

            orderBy: {
                _avg: {
                    sentimentScore: "desc",
                },
            },

            take: 1,
        }),

        prisma.feedbackAnalysis.groupBy({

            by: ["featureArea"],

            _avg: {
                sentimentScore: true,
            },

            where: {
                feedback: where,

                sentiment: "NEGATIVE",
            },

            orderBy: {
                _avg: {
                    sentimentScore: "desc",
                },
            },

            take: 1,
        }),

        prisma.feedbackAnalysis.aggregate({

            _avg: {
                sentimentScore: true,
            },

            where: {
                feedback: where,
            },
        }),
    ]);

    const mostCommonComplaint = themeDistribution[0]?.name ?? "N/A";

    return {

        mostCommonComplaint,

        mostPositiveArea:
            positiveArea[0]?.featureArea ??
            "N/A",

        mostNegativeArea:
            negativeArea[0]?.featureArea ??
            "N/A",

        averageSentiment:
            Number(
                (
                    average._avg
                        .sentimentScore ?? 0
                ).toFixed(2)
            ),
    };
}

async function getNewThisWeek(
    workspaceId: string
): Promise<NewThisWeek> {

    const start = new Date();

    start.setDate(
        start.getDate() - 7
    );

    const where = {

        workspaceId,

        createdAt: {
            gte: start,
            lte: new Date(),
        },
    };

    const count = await prisma.feedback.count({
            where,
        });

    const sentimentDistribution = await getSentimentDistribution(
            where
        );

    return {

        count,

        sentimentDistribution,
    };
}

export async function getAnalytics(
    workspaceId: string,
    range: AnalyticsRange
): Promise<AnalyticsResponse> {

    const where = buildWhereClause(
        workspaceId,
        range
    );

    const [
        overview,
        volumeTrend,
        sentimentDistribution,
        featureAreaDistribution,
        themeDistribution,
        channelDistribution,
        statusDistribution,
        topNegativeFeedback,
        newThisWeek,
        themeTrends,
    ] = await Promise.all([
        getOverview(where),
        getVolumeTrend(where),
        getSentimentDistribution(where),
        getFeatureAreaDistribution(where),
        getThemeDistribution(where),
        getChannelDistribution(where),
        getStatusDistribution(where),
        getTopNegativeFeedback(where),
        getNewThisWeek(workspaceId),
        getThemeTrends(workspaceId, range),
    ]);

    const aiInsights = await getAIInsights(
            where,
            themeDistribution
        );

    return {

        overview,

        volumeTrend,

        sentimentDistribution,

        featureAreaDistribution,

        themeDistribution,

        channelDistribution,

        statusDistribution,

        themeTrends,

        topNegativeFeedback,

        aiInsights,

        newThisWeek:
            range === "all"
                || range === "30d"
                || range === "90d"
                ? newThisWeek
                : undefined,
    };
}
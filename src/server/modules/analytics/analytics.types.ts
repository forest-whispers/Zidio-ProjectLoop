export interface AnalyticsResponse {
    overview: OverviewMetrics;

    volumeTrend: VolumeTrend[];

    sentimentDistribution: Distribution[];

    featureAreaDistribution: Distribution[];

    themeDistribution: ThemeDistribution[];

    channelDistribution: Distribution[];

    statusDistribution: Distribution[];

    themeTrends: ThemeTrend[];

    topNegativeFeedback: NegativeFeedback[];

    aiInsights: AIInsights;

    newThisWeek?: NewThisWeek;
}

export interface OverviewMetrics {
    totalFeedback: number;

    analyzedFeedback: number;

    positivePercentage: number;

    negativePercentage: number;

    reviewedPercentage: number;

    activeThemes: number;
}

export interface Distribution {
    label: string;

    value: number;

    percentage: number;
}

export interface VolumeTrend {
    date: string;

    count: number;
}

export interface ThemeDistribution {

    id: string;

    name: string;

    color: string;

    count: number;

    percentage: number;
}

export interface ThemeTrend {
    name: string;

    color: string;

    currentCount: number;

    previousCount: number;

    percentageChange: number;
}

export interface AIInsights {
    mostCommonComplaint: string;

    mostPositiveArea: string;

    mostNegativeArea: string;

    averageSentiment: number;
}

export interface NegativeFeedback {
    id: string;

    content: string;

    channel: string;

    createdAt: Date;

    sentimentScore: number;
}

export interface NewThisWeek {
    count: number;

    sentimentDistribution: Distribution[];
}

export const ANALYTICS_RANGES = [
    "7d",
    "30d",
    "90d",
    "1y",
    "all",
] as const;

export type AnalyticsRange = typeof ANALYTICS_RANGES[number];
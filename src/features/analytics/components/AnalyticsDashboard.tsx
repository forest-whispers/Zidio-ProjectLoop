"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
    BarChart3,
    TrendingUp,
    TrendingDown,
    Smile,
    Frown,
    MessageSquare,
    CheckCircle2,
    Tags,
    Brain,
    AlertCircle,
    Calendar,
    ArrowRight,
    Loader2,
    RefreshCw,
    Inbox
} from "lucide-react";
import { analyticsApi } from "../services/analytics.api";
import { AnalyticsRange } from "@/server/modules/analytics/analytics.types";
import { LineChartWrapper } from "./LineChartWrapper";
import { DonutChartWrapper } from "./DonutChartWrapper";
import { HorizontalBarChartWrapper } from "./HorizontalBarChartWrapper";
import { VerticalBarChartWrapper } from "./VerticalBarChartWrapper";
import { formatFeatureArea } from "@/features/feedback/components/AnalysisSummaryCard";
import { formatChannel } from "@/features/feedback/components/FeedbackList";

export function AnalyticsDashboard() {
    const router = useRouter();
    const [range, setRange] = useState<AnalyticsRange>("30d");

    // TanStack Query configured with 5m staleTime and refetchOnWindowFocus disabled
    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ["analytics", range],
        queryFn: () => analyticsApi.getAnalytics(range),
        staleTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
    });

    const handleRetry = () => {
        refetch();
    };

    // Range selector label helper
    const getRangeLabel = (r: AnalyticsRange) => {
        switch (r) {
            case "7d": return "Last 7 Days";
            case "30d": return "Last 30 Days";
            case "90d": return "Last 90 Days";
            case "1y": return "Last Year";
            case "all": return "All Time";
            default: return r;
        }
    };

    // Render Loading State
    if (isLoading) {
        return (
            <main className="grow max-w-6xl w-full mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
                {/* Header Skeleton */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="space-y-2">
                        <div className="h-7 bg-zinc-200 dark:bg-zinc-800 rounded w-48" />
                        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-72" />
                    </div>
                    <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded w-96" />
                </div>

                {/* KPI Skeleton Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3.5">
                            <div className="h-3.5 bg-zinc-200 dark:bg-zinc-800 rounded w-16" />
                            <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-24" />
                        </div>
                    ))}
                </div>

                {/* Layout Grid Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Trend Chart Skeleton */}
                        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-85" />
                        {/* Grid Skeletons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-70" />
                            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-70" />
                        </div>
                    </div>
                    <div className="space-y-6">
                        {/* Insights Skeleton */}
                        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-80" />
                        {/* Trends Skeleton */}
                        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-95" />
                    </div>
                </div>
            </main>
        );
    }

    // Render Error State
    if (error) {
        return (
            <main className="grow max-w-xl w-full mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center text-red-500 border border-red-100 dark:border-red-900/50 mb-4 animate-bounce">
                    <AlertCircle className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-black text-zinc-900 dark:text-white tracking-tight">Failed to load analytics</h2>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 max-w-sm">
                    {error instanceof Error ? error.message : "An unexpected network error occurred while communicating with the analytics service."}
                </p>
                <button
                    onClick={handleRetry}
                    className="inline-flex items-center space-x-1.5 px-4.5 py-2 mt-6 rounded-lg bg-zinc-900 dark:bg-white hover:bg-zinc-850 dark:hover:bg-zinc-50 text-white dark:text-zinc-900 text-xs font-semibold shadow-md cursor-pointer transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                </button>
            </main>
        );
    }

    if (!data) return null;

    // Check if the workspace is entirely empty for this range
    const isWorkspaceEmpty = data.overview.totalFeedback === 0;

    return (
        <main className="grow max-w-6xl w-full mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
            
            {/* Header / Filter Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                    <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                        <BarChart3 className="w-5.5 h-5.5 text-indigo-500 shrink-0" />
                        <span>Analytics Dashboard</span>
                    </h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Workspace aggregation insights and classification metrics
                    </p>
                </div>

                {/* Range Selector */}
                <div className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-800 p-1 bg-white dark:bg-zinc-900 shadow-2xs">
                    {(["7d", "30d", "90d", "1y", "all"] as AnalyticsRange[]).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            disabled={isFetching}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                                range === r
                                    ? "bg-zinc-100 dark:bg-zinc-805 text-zinc-900 dark:text-white shadow-3xs"
                                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                            } disabled:opacity-50`}
                        >
                            {r === "all" ? "All Time" : r.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* If empty, render empty state instead of broken visualizations */}
            {isWorkspaceEmpty ? (
                <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 p-12 text-center shadow-xs">
                    <div className="flex flex-col items-center justify-center space-y-3.5 max-w-md mx-auto">
                        <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 text-zinc-400">
                            <Inbox className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-sm text-zinc-900 dark:text-white">No feedback available for this period</h3>
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                We couldn't find any feedback entries in your workspace for {getRangeLabel(range)}. Add or import feedback items to populate the analytics report.
                            </p>
                        </div>
                        <button
                            onClick={() => router.push("/dashboard/feedback/new")}
                            className="px-3.5 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors shadow-sm cursor-pointer"
                        >
                            Create Feedback
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Overview KPI Cards (Responsive grid) */}
                    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 transition-all duration-200 ${isFetching ? "opacity-50 scale-[0.99]" : ""}`}>
                        {/* Total Feedback */}
                        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-3xs flex flex-col justify-between h-24">
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Total Feedback</span>
                            <span className="text-xl font-black text-zinc-900 dark:text-white leading-none mt-2">{data.overview.totalFeedback}</span>
                        </div>

                        {/* Analyzed Feedback */}
                        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-3xs flex flex-col justify-between h-24">
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Analyzed</span>
                            <div className="mt-2 space-y-1">
                                <span className="text-xl font-black text-zinc-900 dark:text-white leading-none block">{data.overview.analyzedFeedback}</span>
                                <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-medium">({Math.round((data.overview.analyzedFeedback / data.overview.totalFeedback) * 100)}% of total)</span>
                            </div>
                        </div>

                        {/* Positive % */}
                        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-3xs flex flex-col justify-between h-24">
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                <Smile className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span>Positive %</span>
                            </span>
                            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 leading-none mt-2">{data.overview.positivePercentage}%</span>
                        </div>

                        {/* Negative % */}
                        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-3xs flex flex-col justify-between h-24">
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                <Frown className="w-3.5 h-3.5 text-red-500 shrink-0" />
                                <span>Negative %</span>
                            </span>
                            <span className="text-xl font-black text-red-650 dark:text-red-400 leading-none mt-2">{data.overview.negativePercentage}%</span>
                        </div>

                        {/* Active Themes */}
                        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-3xs flex flex-col justify-between h-24">
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                <Tags className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                <span>Active Themes</span>
                            </span>
                            <span className="text-xl font-black text-zinc-900 dark:text-white leading-none mt-2">{data.overview.activeThemes}</span>
                        </div>

                        {/* Reviewed % */}
                        <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-3xs flex flex-col justify-between h-24">
                            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                <span>Reviewed %</span>
                            </span>
                            <span className="text-xl font-black text-zinc-900 dark:text-white leading-none mt-2">{data.overview.reviewedPercentage}%</span>
                        </div>
                    </div>

                    {/* Main Layout Grid */}
                    <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-200 ${isFetching ? "opacity-50 scale-[0.99]" : ""}`}>
                        
                        {/* Charts Area (2 Columns wide) */}
                        <div className="lg:col-span-2 space-y-6">
                            
                            {/* Trend Line Chart */}
                            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                                <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-250 uppercase tracking-wider mb-4">Feedback Volume Trend</h3>
                                <LineChartWrapper data={data.volumeTrend} height={240} />
                            </div>

                            {/* Donut distributions (Grid layout) */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Sentiment */}
                                <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                                    <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-250 uppercase tracking-wider mb-4">Sentiment Distribution</h3>
                                    <DonutChartWrapper data={data.sentimentDistribution} height={130} variant="sentiment" />
                                </div>
                                {/* Channel */}
                                <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                                    <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-250 uppercase tracking-wider mb-4">Channel Distribution</h3>
                                    <DonutChartWrapper data={data.channelDistribution} height={130} variant="channel" />
                                </div>
                            </div>

                            {/* Bar charts Distributions */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Feature Area (Vertical Bar) */}
                                <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                                    <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-250 uppercase tracking-wider mb-4">Top Feature Areas</h3>
                                    <VerticalBarChartWrapper data={data.featureAreaDistribution} height={200} />
                                </div>
                                {/* Themes Distribution (Horizontal Bar) */}
                                <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                                    <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-250 uppercase tracking-wider mb-4">Top Themes</h3>
                                    <HorizontalBarChartWrapper data={data.themeDistribution} height={200} />
                                </div>
                            </div>

                            {/* Feedback Status distribution */}
                            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                                <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-250 uppercase tracking-wider mb-4">Feedback Status Distribution</h3>
                                <DonutChartWrapper data={data.statusDistribution} height={130} variant="status" />
                            </div>

                            {/* Top Negative Feedbacks */}
                            {data.topNegativeFeedback && data.topNegativeFeedback.length > 0 && (
                                <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
                                    <div>
                                        <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-250 uppercase tracking-wider">Top Urgent Negative Feedback</h3>
                                        <p className="text-[10px] text-zinc-400 mt-0.5">Highly critical complaints requiring immediate action</p>
                                    </div>
                                    <div className="divide-y divide-zinc-250/60 dark:divide-zinc-800">
                                        {data.topNegativeFeedback.slice(0, 3).map((item) => (
                                            <div
                                                key={item.id}
                                                onClick={() => router.push(`/dashboard/feedback?search=${encodeURIComponent(item.id)}`)}
                                                className="py-3 flex items-start justify-between gap-4 cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-950/20 px-2 rounded-lg transition-colors group"
                                            >
                                                <div className="space-y-1 truncate grow">
                                                    <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                                        {item.content}
                                                    </p>
                                                    <div className="flex items-center space-x-2.5 text-[9px] font-bold text-zinc-450 uppercase">
                                                        <span className="bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.2 rounded">
                                                            {formatChannel(item.channel as any)}
                                                        </span>
                                                        <span>
                                                            {format(new Date(item.createdAt), "MMM d, yyyy")}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2 shrink-0 pl-2">
                                                    <span className="px-2 py-0.5 border border-red-200/50 dark:border-red-950/30 bg-red-50 dark:bg-red-950/20 text-[10px] font-bold font-mono text-red-500 rounded-md">
                                                        {item.sentimentScore.toFixed(2)}
                                                    </span>
                                                    <ArrowRight className="w-3.5 h-3.5 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sidebar Column */}
                        <div className="space-y-6">
                            
                            {/* Conditional: New This Week Card */}
                            {data.newThisWeek && (
                                <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
                                    <div className="flex items-center space-x-2.5 pb-3 border-b border-zinc-150 dark:border-zinc-850">
                                        <Calendar className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
                                        <div>
                                            <h3 className="text-xs font-black text-zinc-900 dark:text-white leading-none">New This Week</h3>
                                            <p className="text-[9px] text-zinc-400 mt-0.5">Metrics for the current calendar week</p>
                                        </div>
                                    </div>
                                    <div className="text-center py-2">
                                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">Weekly Count</span>
                                        <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none mt-1 block">
                                            {data.newThisWeek.count}
                                        </span>
                                    </div>
                                    {data.newThisWeek.count > 0 && (
                                        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-850">
                                            <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block mb-2 text-center">Weekly Sentiment</span>
                                            <DonutChartWrapper data={data.newThisWeek.sentimentDistribution} height={100} variant="sentiment" />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* AI Insights Card */}
                            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
                                <div className="flex items-center space-x-2.5 pb-3 border-b border-zinc-150 dark:border-zinc-850">
                                    <Brain className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
                                    <div>
                                        <h3 className="text-xs text-zinc-900 dark:text-white leading-none font-extrabold">AI Insights Summary</h3>
                                        <p className="text-[9px] text-zinc-400 mt-0.5">Synthesized using LLM models</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* Sentiment score */}
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">Average sentiment score</span>
                                        <div className="flex items-center space-x-2">
                                            <span className="text-lg font-black font-mono text-zinc-900 dark:text-white">
                                                {data.aiInsights.averageSentiment >= 0 ? `+${data.aiInsights.averageSentiment.toFixed(2)}` : data.aiInsights.averageSentiment.toFixed(2)}
                                            </span>
                                            <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                                                data.aiInsights.averageSentiment > 0.1 
                                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450" 
                                                    : data.aiInsights.averageSentiment < -0.1
                                                    ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-450"
                                                    : "bg-amber-50 text-amber-700 dark:bg-amber-955/20 dark:text-amber-450"
                                            }`}>
                                                {data.aiInsights.averageSentiment > 0.1 ? "Positive" : data.aiInsights.averageSentiment < -0.1 ? "Negative" : "Neutral"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Most Common Complaint */}
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">Common Pain Point</span>
                                        <p className="text-xs text-zinc-700 dark:text-zinc-300 font-medium leading-relaxed bg-zinc-50/50 dark:bg-zinc-950/30 p-2.5 rounded-lg border border-zinc-150 dark:border-zinc-850">
                                            {data.aiInsights.mostCommonComplaint || "None identified."}
                                        </p>
                                    </div>

                                    {/* Positive Area */}
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">Highest Rated Product Area</span>
                                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase">
                                            {formatFeatureArea(data.aiInsights.mostPositiveArea) || "None identified."}
                                        </span>
                                    </div>

                                    {/* Negative Area */}
                                    <div className="space-y-1">
                                        <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">Most Criticized Product Area</span>
                                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400 text-[10px] font-bold uppercase">
                                            {formatFeatureArea(data.aiInsights.mostNegativeArea) || "None identified."}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Theme Trends Section */}
                            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
                                <div className="flex items-center space-x-2.5 pb-3 border-b border-zinc-150 dark:border-zinc-850">
                                    <TrendingUp className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
                                    <div>
                                        <h3 className="text-xs font-black text-zinc-900 dark:text-white leading-none">Theme Activity Shifts</h3>
                                        <p className="text-[9px] text-zinc-400 mt-0.5">Sorted by highest absolute percentage change</p>
                                    </div>
                                </div>

                                <div className="divide-y divide-zinc-250/60 dark:divide-zinc-800 max-h-75 overflow-y-auto pr-1">
                                    {[...data.themeTrends]
                                        .sort((a, b) => Math.abs(b.percentageChange) - Math.abs(a.percentageChange))
                                        .map((t) => {
                                            const themeColor = t.color || "#71717a";
                                            const isIncrease = t.percentageChange > 0;
                                            const isZero = t.percentageChange === 0;

                                            return (
                                                <div key={t.name} className="py-2.5 flex items-center justify-between gap-4">
                                                    <div className="flex items-center space-x-2 truncate">
                                                        <span 
                                                            className="w-2 h-2 rounded-full shrink-0" 
                                                            style={{ backgroundColor: themeColor }} 
                                                        />
                                                        <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 truncate">{t.name}</span>
                                                    </div>
                                                    <div className="flex items-center space-x-3 shrink-0">
                                                        <div className="text-right text-[10px] text-zinc-400 font-semibold font-mono">
                                                            {t.currentCount} <span className="font-normal">vs</span> {t.previousCount}
                                                        </div>
                                                        <span className={`inline-flex items-center space-x-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                                            isZero 
                                                                ? "bg-zinc-50 text-zinc-500 dark:bg-zinc-800" 
                                                                : isIncrease
                                                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-450"
                                                                : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-450"
                                                        }`}>
                                                            {!isZero && (
                                                                isIncrease ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />
                                                            )}
                                                            <span>{isZero ? "0%" : `${isIncrease ? "+" : ""}${t.percentageChange}%`}</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}
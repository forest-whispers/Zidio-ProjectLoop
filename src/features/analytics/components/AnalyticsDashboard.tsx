"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
    BarChart3,
    TrendingUp,
    Brain,
    AlertCircle,
    Calendar,
    RefreshCw,
    Inbox,
    Sparkles,
} from "lucide-react";
import { analyticsApi } from "../services/analytics.api";
import { AnalyticsRange } from "@/server/modules/analytics/analytics.types";
import { LineChartWrapper } from "./LineChartWrapper";
import { DonutChartWrapper } from "./DonutChartWrapper";
import { VerticalBarChartWrapper } from "./VerticalBarChartWrapper";
import { formatFeatureArea } from "@/features/feedback/components/AnalysisSummaryCard";
import { formatChannel } from "@/features/feedback/components/FeedbackList";

export function AnalyticsDashboard() {
    const router = useRouter();
    const [range, setRange] = useState<AnalyticsRange>("30d");
    const [isHoveredNewWeek, setIsHoveredNewWeek] = useState(false);

    // TanStack Query configured with 5m staleTime and refetchOnWindowFocus disabled
    const { data, isLoading, error, refetch, isFetching } = useQuery({
        queryKey: ["analytics", range],
        queryFn: () => analyticsApi.getAnalytics(range),
        staleTime: 5 * 60 * 1000,
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
                        <div className="h-7 bg-zinc-250/50 dark:bg-zinc-805 rounded w-48 animate-pulse" />
                        <div className="h-4 bg-zinc-250/50 dark:bg-zinc-805 rounded w-72 animate-pulse" />
                    </div>
                    <div className="h-10 bg-zinc-250/50 dark:bg-zinc-805 rounded w-96 animate-pulse" />
                </div>

                {/* Main grid skeletons */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-44 animate-pulse" />
                            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-44 animate-pulse" />
                        </div>
                        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-80 animate-pulse" />
                        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-64 animate-pulse" />
                    </div>
                    <div className="space-y-6">
                        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-96 animate-pulse" />
                        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-80 animate-pulse" />
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

    // Compute sentiment text label based on score
    const avgSentiment = data.aiInsights.averageSentiment;
    const sentimentLabel = avgSentiment > 0.4 
        ? "Excellent" 
        : avgSentiment > 0.1 
        ? "Good" 
        : avgSentiment >= -0.1 
        ? "Neutral" 
        : "Needs Work";

    // Convert sentiment score (-1 to +1) to percentage (0 to 100)
    const sentimentScore100 = Math.round((avgSentiment + 1) * 50);

    // AI Confidence / Coverage rate
    const aiConfidence = data.overview.totalFeedback > 0 
        ? Math.round((data.overview.analyzedFeedback / data.overview.totalFeedback) * 1000) / 10 
        : 0;

    // Semicircular gauge constants
    const r = 40;
    const strokeWidth = 8;
    const cLength = Math.PI * r; // 125.66
    const dashOffset = cLength - (cLength * (sentimentScore100 / 100));

    // Colors for user initials avatars
    const avatarColors = [
        "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400",
        "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400",
        "bg-violet-100 text-violet-800 dark:bg-violet-950/40 dark:text-violet-400",
        "bg-pink-100 text-pink-800 dark:bg-pink-950/40 dark:text-pink-400",
        "bg-orange-100 text-orange-800 dark:bg-orange-950/40 dark:text-orange-400",
    ];

    return (
        <main className="grow max-w-6xl w-full mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
            
            {/* Header / Filter Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200/60 dark:border-zinc-800">
                <div className="space-y-1">
                    <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2.5">
                        <BarChart3 className="w-5.5 h-5.5 text-indigo-500 shrink-0" />
                        <span>Insight Center</span>
                    </h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        Analyze and drill down on workspace sentiment and trends
                    </p>
                </div>

                {/* Range Selector */}
                <div className="inline-flex rounded-lg border border-zinc-200 dark:border-zinc-800 p-1 bg-white dark:bg-zinc-900 shadow-3xs">
                    {(["7d", "30d", "90d", "1y", "all"] as AnalyticsRange[]).map((r) => (
                        <button
                            key={r}
                            onClick={() => setRange(r)}
                            disabled={isFetching}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                                range === r
                                    ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-950 dark:text-white shadow-4xs"
                                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                            } disabled:opacity-50`}
                        >
                            {r === "all" ? "All Time" : r.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* If empty, render empty state */}
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
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left/Middle Column (2/3 width) */}
                    <div className={`lg:col-span-2 space-y-6 transition-all duration-200 ${isFetching ? "opacity-60 scale-[0.99]" : ""}`}>
                        
                        {/* Row 1: Current Sentiment and Total Feedback KPI cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            
                            {/* Card 1: Current Sentiment Card (2/3 width) */}
                            <div className="md:col-span-2 p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-3xs flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="space-y-4 grow">
                                    <div className="space-y-1">
                                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">Current Sentiment</span>
                                        <span className="text-2xl font-black text-zinc-900 dark:text-white leading-none tracking-tight block">
                                            {sentimentLabel}
                                        </span>
                                    </div>
                                    <div className="space-y-2.5">
                                        {/* Positive Feedback Progress Bar */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] font-bold">
                                                <span className="text-zinc-500">Positive Feedback</span>
                                                <span className="text-zinc-800 dark:text-zinc-200">{data.overview.positivePercentage}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                <div 
                                                    style={{ width: `${data.overview.positivePercentage}%` }} 
                                                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                                                />
                                            </div>
                                        </div>
                                        {/* Reviewed Rate Progress Bar */}
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-[10px] font-bold">
                                                <span className="text-zinc-500">Reviewed Rate</span>
                                                <span className="text-zinc-800 dark:text-zinc-200">{data.overview.reviewedPercentage}%</span>
                                            </div>
                                            <div className="w-full h-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                <div 
                                                    style={{ width: `${data.overview.reviewedPercentage}%` }} 
                                                    className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Custom Semicircular SVG Gauge */}
                                <div className="flex flex-col items-center justify-center shrink-0 w-32 h-16 self-center relative mt-4 md:mt-0">
                                    <svg viewBox="0 0 100 50" className="w-28 h-14">
                                        <defs>
                                            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" stopColor="#ef4444" />
                                                <stop offset="50%" stopColor="#f59e0b" />
                                                <stop offset="100%" stopColor="#10b981" />
                                            </linearGradient>
                                        </defs>
                                        {/* Track */}
                                        <path
                                            d="M 10 50 A 40 40 0 0 1 90 50"
                                            fill="none"
                                            stroke="#e4e4e7"
                                            strokeWidth={strokeWidth}
                                            strokeLinecap="round"
                                            className="dark:stroke-zinc-800"
                                        />
                                        {/* Value */}
                                        <path
                                            d="M 10 50 A 40 40 0 0 1 90 50"
                                            fill="none"
                                            stroke="url(#gaugeGrad)"
                                            strokeWidth={strokeWidth}
                                            strokeLinecap="round"
                                            strokeDasharray={cLength}
                                            strokeDashoffset={dashOffset}
                                            className="transition-all duration-500"
                                        />
                                    </svg>
                                    <div className="absolute bottom-0 inset-x-0 text-center flex flex-col items-center">
                                        <span className="text-lg font-black text-zinc-900 dark:text-white leading-none">
                                            {sentimentScore100}
                                        </span>
                                        <span className="text-[8px] text-zinc-400 uppercase tracking-widest font-black leading-none mt-0.5">Score</span>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Total Feedback & Coverage Card (1/3 width) */}
                            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-3xs flex flex-col justify-between h-44">
                                <div className="space-y-1">
                                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">Total Feedback</span>
                                    <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none tracking-tight block mt-2">
                                        {data.overview.totalFeedback.toLocaleString()}
                                    </span>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">AI Tagging Coverage</span>
                                    <div className="flex items-center space-x-1.5 mt-1.5">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                                        </span>
                                        <span className="text-xs font-black text-zinc-850 dark:text-zinc-200 leading-none">{aiConfidence}%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Sentiment Over Time Line Chart */}
                        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-250 uppercase tracking-wider">Sentiment Over Time</h3>
                                <div className="text-[9px] text-zinc-400 font-semibold">Weekly volume aggregated</div>
                            </div>
                            <LineChartWrapper data={data.volumeTrend} height={240} />
                        </div>

                        {/* Distributions grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Feature Area */}
                            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                                <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-250 uppercase tracking-wider mb-4">Feature Area Distribution</h3>
                                <VerticalBarChartWrapper data={data.featureAreaDistribution} height={180} />
                            </div>
                            {/* Channel */}
                            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
                                <h3 className="text-xs font-bold text-zinc-800 dark:text-zinc-250 uppercase tracking-wider mb-4">Channel Distribution</h3>
                                <DonutChartWrapper data={data.channelDistribution} height={120} variant="channel" />
                            </div>
                        </div>

                        {/* Row 3: Recent Insights (Top Negative Feedbacks as Testimonial Quotes) */}
                        {data.topNegativeFeedback && data.topNegativeFeedback.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-205 uppercase tracking-wider">Recent Critical Insights</h3>
                                        <p className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-0.5 font-medium">Testimonial quotes from verified customers requiring attention</p>
                                    </div>
                                    <button 
                                        onClick={() => router.push("/dashboard/feedback")}
                                        className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline cursor-pointer"
                                    >
                                        View All Inbox
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {data.topNegativeFeedback.slice(0, 3).map((item, index) => {
                                        const initials = item.content.slice(0, 2).toUpperCase();
                                        const colorClass = avatarColors[index % avatarColors.length];
                                        return (
                                            <div
                                                key={item.id}
                                                onClick={() => router.push(`/dashboard/feedback/${item.id}`)}
                                                className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-350 dark:hover:border-zinc-700 shadow-3xs cursor-pointer flex flex-col justify-between gap-4 transition-all hover:scale-[1.01]"
                                            >
                                                <div className="space-y-2.5">
                                                    {/* User header */}
                                                    <div className="flex items-center space-x-2.5">
                                                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 ${colorClass}`}>
                                                            {initials}
                                                        </div>
                                                        <div className="truncate grow min-w-0">
                                                            <span className="text-[11px] font-bold text-zinc-900 dark:text-white truncate block">
                                                                Customer Label
                                                            </span>
                                                            <span className="text-[9px] text-zinc-400 dark:text-zinc-500 block truncate">
                                                                {format(new Date(item.createdAt), "MMM d, yyyy")}
                                                            </span>
                                                        </div>
                                                        <span className="px-1.5 py-0.5 bg-red-50 text-red-750 dark:bg-red-950/20 dark:text-red-400 border border-red-100 dark:border-red-900/30 text-[8px] font-black rounded uppercase tracking-wider shrink-0">
                                                            Critical
                                                        </span>
                                                    </div>
                                                    {/* Quote content */}
                                                    <p className="text-[11px] text-zinc-650 dark:text-zinc-350 leading-relaxed font-medium line-clamp-3">
                                                        "{item.content}"
                                                    </p>
                                                </div>

                                                <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-850 pt-2.5 text-[9px] text-zinc-400 font-bold uppercase">
                                                    <span>{formatChannel(item.channel as any)}</span>
                                                    <span className="text-red-500 font-mono">Score: {item.sentimentScore.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Sidebar Column (1/3 width) */}
                    <div className={`space-y-6 transition-all duration-200 ${isFetching ? "opacity-60 scale-[0.99]" : ""}`}>
                        
                        {/* Conditional: New This Week */}
                        {data.newThisWeek && (
                            <div 
                                onMouseEnter={() => setIsHoveredNewWeek(true)}
                                onMouseLeave={() => setIsHoveredNewWeek(false)}
                                className="relative p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm transition-all duration-300 min-h-60 flex flex-col justify-between overflow-hidden cursor-pointer"
                            >
                                {isHoveredNewWeek ? (
                                    <div className="space-y-4 animate-in fade-in duration-300 w-full grow flex flex-col justify-between">
                                        <div className="flex items-center space-x-2.5 pb-2.5 border-b border-zinc-150 dark:border-zinc-850">
                                            <Sparkles className="w-4.5 h-4.5 text-indigo-500 shrink-0 animate-pulse" />
                                            <div>
                                                <h3 className="text-xs font-black text-zinc-900 dark:text-white leading-none">Weekly Product Breakdown</h3>
                                                <p className="text-[9px] text-zinc-450 mt-0.5 font-medium">Feature Area Distribution (%)</p>
                                            </div>
                                        </div>
                                        <div className="grow flex items-center justify-center py-2">
                                            <DonutChartWrapper data={data.featureAreaDistribution} height={100} variant="default" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-in fade-in duration-300 w-full">
                                        <div className="flex items-center space-x-2.5 pb-3 border-b border-zinc-150 dark:border-zinc-850">
                                            <Calendar className="w-4.5 h-4.5 text-indigo-500 shrink-0" />
                                            <div>
                                                <h3 className="text-xs font-black text-zinc-900 dark:text-white leading-none">New This Week</h3>
                                                <p className="text-[9px] text-zinc-450 mt-0.5 font-medium">Metrics for the current calendar week</p>
                                            </div>
                                        </div>
                                        <div className="text-center py-1">
                                            <span className="text-[10px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider block">Weekly Count</span>
                                            <span className="text-3xl font-black text-zinc-900 dark:text-white leading-none mt-1 block">
                                                {data.newThisWeek.count}
                                            </span>
                                        </div>
                                        {data.newThisWeek.count > 0 && (
                                            <div className="pt-2 border-t border-zinc-100 dark:border-zinc-850">
                                                <span className="text-[9px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider block mb-2.5 text-center">Weekly Sentiment</span>
                                                <DonutChartWrapper data={data.newThisWeek.sentimentDistribution} height={90} variant="sentiment" />
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Widget 1: Top Trending Topics (Themes) */}
                        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
                            <div className="flex items-center justify-between pb-3 border-b border-zinc-150 dark:border-zinc-850">
                                <div>
                                    <h3 className="text-xs font-black text-zinc-900 dark:text-white leading-none">Top Trending Topics</h3>
                                    <p className="text-[9px] text-zinc-400 mt-0.5">Sorted by absolute activity shift</p>
                                </div>
                                <TrendingUp className="w-4 h-4 text-indigo-500 shrink-0" />
                            </div>

                            {/* Themes list styled with rank badges */}
                            <div className="space-y-3.5 max-h-75 overflow-y-auto pr-1">
                                {[...data.themeTrends]
                                    .sort((a, b) => Math.abs(b.percentageChange) - Math.abs(a.percentageChange))
                                    .slice(0, 5)
                                    .map((t, idx) => {
                                        const themeColor = t.color || "#71717a";
                                        const isIncrease = t.percentageChange > 0;
                                        const isZero = t.percentageChange === 0;

                                        return (
                                            <div key={t.name} className="flex items-center justify-between gap-4">
                                                <div className="flex items-center space-x-2.5 truncate">
                                                    <span className="w-5 h-5 rounded-md bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/50 dark:border-zinc-800/80 flex items-center justify-center text-[10px] font-black text-zinc-450 dark:text-zinc-500 shrink-0">
                                                        {idx + 1}
                                                    </span>
                                                    <div className="flex items-center space-x-1.5 truncate">
                                                        <span 
                                                            className="w-1.5 h-1.5 rounded-full shrink-0" 
                                                            style={{ backgroundColor: themeColor }} 
                                                        />
                                                        <span className="text-[11px] font-bold text-zinc-800 dark:text-zinc-200 truncate">{t.name}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2.5 shrink-0 pl-2">
                                                    <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500">
                                                        {t.currentCount}
                                                    </span>
                                                    <span className={`inline-flex items-center px-1 py-0.5 rounded text-[9px] font-bold ${
                                                        isZero 
                                                            ? "bg-zinc-50 text-zinc-500 dark:bg-zinc-800" 
                                                            : isIncrease
                                                            ? "text-emerald-600 font-bold"
                                                            : "text-red-650 font-bold"
                                                    }`}>
                                                        {isZero ? "" : isIncrease ? "+" : ""}
                                                        {t.percentageChange}%
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    })}
                            </div>

                            {/* AI Suggestions keyword cloud */}
                            {data.themeDistribution && data.themeDistribution.length > 0 && (
                                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-850 space-y-2">
                                    <span className="text-[9px] text-zinc-450 dark:text-zinc-500 font-bold uppercase tracking-wider block">AI Suggestions</span>
                                    <div className="flex flex-wrap gap-1">
                                        {data.themeDistribution.slice(0, 6).map((item) => (
                                            <span 
                                                key={item.id}
                                                onClick={() => router.push(`/dashboard/feedback?search=${encodeURIComponent(item.name)}`)}
                                                className="px-2 py-0.8 rounded-md bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/50 dark:border-zinc-800 text-[9px] font-semibold text-zinc-550 dark:text-zinc-400 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800/80 transition-colors"
                                            >
                                                {item.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Widget 2: AI Recommended Fix (Premium dark accent card matching mock) */}
                        <div className="p-6 rounded-xl border border-zinc-850 dark:border-zinc-800 bg-[#141416] text-white shadow-lg space-y-5">
                            <div className="flex items-center space-x-2 pb-3 border-b border-zinc-800">
                                <Brain className="w-5 h-5 text-indigo-400 shrink-0" />
                                <div>
                                    <h3 className="text-xs font-black text-white leading-none">AI Recommended Fix</h3>
                                    <p className="text-[8px] text-zinc-500 mt-0.5">Strategic platform adjustment suggestion</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {/* Pain point */}
                                <div className="space-y-1">
                                    <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider block">Primary Pain Point</span>
                                    <p className="text-xs text-zinc-300 font-medium leading-relaxed bg-zinc-900/60 p-3 rounded-lg border border-zinc-800/50">
                                        "{data.aiInsights.mostCommonComplaint || "No common complaint identified."}"
                                    </p>
                                </div>

                                {/* Actions list */}
                                <div className="space-y-2.5">
                                    {/* Action 1 */}
                                    <div className="flex items-start space-x-2 text-[10px]">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0 mt-1" />
                                        <div>
                                            <span className="text-zinc-400 font-bold block uppercase tracking-wider text-[8px]">Immediate Action</span>
                                            <p className="text-zinc-200 font-medium mt-0.5">
                                                Address negative reviews around <code className="px-1 py-0.2 bg-zinc-900 border border-zinc-800 rounded font-mono text-[9px]">{formatFeatureArea(data.aiInsights.mostNegativeArea)}</code> queue.
                                            </p>
                                        </div>
                                    </div>
                                    {/* Action 2 */}
                                    <div className="flex items-start space-x-2 text-[10px]">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 mt-1" />
                                        <div>
                                            <span className="text-zinc-400 font-bold block uppercase tracking-wider text-[8px]">Strategic Shift</span>
                                            <p className="text-zinc-200 font-medium mt-0.5">
                                                Leverage positive feedback regarding <code className="px-1 py-0.2 bg-zinc-900 border border-zinc-800 rounded font-mono text-[9px]">{formatFeatureArea(data.aiInsights.mostPositiveArea)}</code> as core product strength.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Spec button */}
                            <button
                                type="button"
                                onClick={() => router.push(`/dashboard/feedback`)}
                                className="w-full inline-flex items-center justify-center space-x-1.5 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md active:scale-[0.98] transition-all cursor-pointer"
                            >
                                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                                <span>Generate Implementation Specs</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
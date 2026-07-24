"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/features/dashboard/services/dashboard.api";
import { DashboardSkeletons } from "@/features/dashboard/components/DashboardSkeletons";
import { DashboardMemberCard } from "@/features/dashboard/components/DashboardMemberCard";
import { WorkspaceActions } from "@/features/dashboard/components/WorkspaceActions";
import { SentimentBadge } from "@/features/feedback/components/SentimentBadge";
import { formatFeatureArea } from "@/features/feedback/components/AnalysisSummaryCard";
import { formatChannel } from "@/features/feedback/components/FeedbackList";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
    MessageSquare, 
    Sparkles, 
    TrendingUp, 
    Layers, 
    Users,
    Activity,
    ArrowRight,
    Inbox,
    Brain,
    Upload,
    Plus,
    AlertCircle
} from "lucide-react";

export default function DashboardPage() {
    const router = useRouter();
    const { data: session, status: sessionStatus } = useSession();

    // Fetch dashboard dataset
    const { data: dashboard, isLoading, error, refetch } = useQuery({
        queryKey: ["dashboard"],
        queryFn: () => dashboardApi.getDashboard(),
        enabled: sessionStatus === "authenticated",
    });

    if (sessionStatus === "loading" || (isLoading && sessionStatus === "authenticated")) {
        return (
            <main className="grow max-w-5xl w-full mx-auto px-6 py-10">
                <DashboardSkeletons />
            </main>
        );
    }

    if (!session?.user) {
        return (
            <div className="flex-1 flex flex-col justify-center items-center min-h-screen bg-[#fafaf6] dark:bg-[#0a0a09] text-zinc-600 dark:text-zinc-400">
                <span className="text-sm font-semibold text-red-500">Access Denied: No active session.</span>
            </div>
        );
    }

    if (error) {
        return (
            <main className="grow max-w-5xl w-full mx-auto px-6 py-10 space-y-6">
                <div className="flex items-center space-x-3 p-5 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <div className="grow">
                        <h4 className="text-sm font-semibold">Error loading workspace overview</h4>
                        <p className="text-xs text-red-700 dark:text-red-400">{(error as Error)?.message || "An unexpected error occurred."}</p>
                    </div>
                    <button
                        onClick={() => refetch()}
                        className="px-3.5 py-1.5 rounded-lg border border-red-200 bg-white dark:bg-red-900/30 text-xs font-semibold text-red-800 dark:text-red-300 hover:bg-red-100 transition-all cursor-pointer"
                    >
                        Retry
                    </button>
                </div>
            </main>
        );
    }

    const { user } = session;
    const isViewer = user.role === "VIEWER";
    
    // If query succeeded but data is empty, set defaults
    const overview = dashboard?.overview || {
        totalFeedback: 0,
        analyzedFeedback: 0,
        pendingAnalysis: 0,
        activeThemes: 0,
        workspaceMembers: 0,
    };
    const members = dashboard?.members || [];
    const recentFeedback = dashboard?.recentFeedback || [];
    const recentAnalyses = dashboard?.recentAnalyses || [];

    // Helper: Truncate text utility
    const truncateText = (text: string, limit: number) => {
        if (!text) return "";
        return text.length > limit ? text.slice(0, limit) + "..." : text;
    };

    return (
        <main className="grow max-w-5xl w-full mx-auto px-6 py-10 space-y-8 animate-in fade-in duration-300">
            
            {/* 1. PERSONALIZED GREETING HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200/60 dark:border-zinc-800">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                        <span>Welcome back, {user.name}</span>
                        <span className="animate-bounce select-none">👋</span>
                    </h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-bold flex items-center gap-1.5">
                        <span>Workspace:</span>
                        <span className="text-zinc-850 dark:text-zinc-200 font-black">{user.workspace?.name}</span>
                        <span className="text-zinc-300 dark:text-zinc-700">|</span>
                        <span>Here's what's happening in your workspace today.</span>
                    </p>
                </div>

                {/* User Role Badge */}
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[10px] font-black uppercase tracking-wider self-start sm:self-center shrink-0 shadow-xs border border-zinc-900 dark:border-white">
                    <Activity className="w-3 h-3 shrink-0 animate-pulse text-indigo-500" />
                    <span>{user.role} Account</span>
                </span>
            </div>

            {/* 2. ONBOARDING EMPTY STATE: NO FEEDBACK YET */}
            {overview.totalFeedback === 0 ? (
                <div className="p-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center space-y-5 bg-white/40 dark:bg-zinc-900/40 shadow-4xs max-w-2xl mx-auto animate-in fade-in duration-300">
                    <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-850 flex items-center justify-center border border-zinc-250/50 dark:border-zinc-800/80 text-zinc-400 mx-auto">
                        <Inbox className="w-5.5 h-5.5 text-indigo-500" />
                    </div>
                    <div className="space-y-1.5">
                        <h3 className="font-black text-sm text-zinc-900 dark:text-white">No Feedback Collected Yet</h3>
                        <p className="text-xs text-zinc-555 dark:text-zinc-400 max-w-md mx-auto leading-relaxed font-semibold">
                            Get started by creating a new manual feedback item or import CSV log files to unlock AI categorizations, analytics, and reports.
                        </p>
                    </div>
                    {!isViewer && (
                        <div className="flex items-center justify-center gap-3 pt-2">
                            <Link
                                href="/dashboard/feedback"
                                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:border-zinc-350 dark:hover:border-zinc-700 text-xs font-bold text-zinc-755 dark:text-zinc-300 transition-colors shadow-3xs cursor-pointer"
                            >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Import Feedback</span>
                            </Link>
                            <Link
                                href="/dashboard/feedback/new"
                                className="inline-flex items-center space-x-1.5 px-4.5 py-2 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-850 dark:hover:bg-zinc-50 text-xs font-bold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Create Feedback</span>
                            </Link>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* 3. METRICS OVERVIEW CARDS GRID */}
                    <div className="space-y-3.5">
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                            {/* Card 1: Total Feedback */}
                            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-3xs flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-750 hover:shadow-2xs transition-all duration-200 group">
                                <div className="flex items-center justify-between pb-1.5 text-zinc-400 group-hover:text-indigo-500 transition-colors">
                                    <span className="text-[9px] font-black uppercase tracking-wider">Total</span>
                                    <MessageSquare className="w-4 h-4 shrink-0" />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xl font-black text-zinc-955 dark:text-white block font-mono">{overview.totalFeedback}</span>
                                    <span className="text-[9px] text-zinc-450 dark:text-zinc-500 block font-bold leading-none">Feedback collected</span>
                                </div>
                            </div>

                            {/* Card 2: AI Analyzed */}
                            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-3xs flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-750 hover:shadow-2xs transition-all duration-200 group">
                                <div className="flex items-center justify-between pb-1.5 text-zinc-400 group-hover:text-indigo-500 transition-colors">
                                    <span className="text-[9px] font-black uppercase tracking-wider">Analyzed</span>
                                    <Sparkles className="w-4 h-4 shrink-0" />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xl font-black text-zinc-955 dark:text-white block font-mono">{overview.analyzedFeedback}</span>
                                    <span className="text-[9px] text-zinc-450 dark:text-zinc-500 block font-bold leading-none">Successfully analyzed</span>
                                </div>
                            </div>

                            {/* Card 3: Pending Analysis */}
                            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-3xs flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-750 hover:shadow-2xs transition-all duration-200 group">
                                <div className="flex items-center justify-between pb-1.5 text-zinc-400 group-hover:text-indigo-500 transition-colors">
                                    <span className="text-[9px] font-black uppercase tracking-wider">Pending</span>
                                    <TrendingUp className="w-4 h-4 shrink-0" />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xl font-black text-zinc-955 dark:text-white block font-mono">{overview.pendingAnalysis}</span>
                                    <span className="text-[9px] text-zinc-450 dark:text-zinc-500 block font-bold leading-none">Awaiting AI processing</span>
                                </div>
                            </div>

                            {/* Card 4: Active Themes */}
                            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-3xs flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-750 hover:shadow-2xs transition-all duration-200 group">
                                <div className="flex items-center justify-between pb-1.5 text-zinc-400 group-hover:text-indigo-500 transition-colors">
                                    <span className="text-[9px] font-black uppercase tracking-wider">Themes</span>
                                    <Layers className="w-4 h-4 shrink-0" />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xl font-black text-zinc-955 dark:text-white block font-mono">{overview.activeThemes}</span>
                                    <span className="text-[9px] text-zinc-450 dark:text-zinc-500 block font-bold leading-none">Workspace categorizations</span>
                                </div>
                            </div>

                            {/* Card 5: Workspace Members */}
                            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-3xs flex flex-col justify-between hover:border-zinc-300 dark:hover:border-zinc-750 hover:shadow-2xs transition-all duration-200 group">
                                <div className="flex items-center justify-between pb-1.5 text-zinc-400 group-hover:text-indigo-500 transition-colors">
                                    <span className="text-[9px] font-black uppercase tracking-wider">Members</span>
                                    <Users className="w-4 h-4 shrink-0" />
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xl font-black text-zinc-955 dark:text-white block font-mono">{overview.workspaceMembers}</span>
                                    <span className="text-[9px] text-zinc-450 dark:text-zinc-500 block font-bold leading-none">Team collaborators</span>
                                </div>
                            </div>
                        </div>

                        {/* Snapshot Subtitle */}
                        <div className="text-[10px] text-zinc-555 dark:text-zinc-400 font-bold flex items-center space-x-1.5 pl-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                            <span>Workspace Snapshot:</span>
                            <span className="text-zinc-850 dark:text-zinc-200 font-black">
                                {overview.analyzedFeedback} of {overview.totalFeedback} feedback items analyzed
                            </span>
                            <span>·</span>
                            <span className="text-zinc-800 dark:text-zinc-305">
                                {overview.pendingAnalysis} awaiting AI analysis
                            </span>
                        </div>
                    </div>

                    {/* 4. SPLIT LAYOUT: ACTIONS + MEMBERS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Quick Actions Panel */}
                        <div className="md:col-span-2 space-y-3">
                            <h2 className="text-xs font-bold text-zinc-850 dark:text-zinc-205 uppercase tracking-wider">
                                Quick Actions
                            </h2>
                            <WorkspaceActions role={user.role} />
                        </div>

                        {/* Workspace Members Column */}
                        <div className="space-y-3">
                            <h2 className="text-xs font-bold text-zinc-850 dark:text-zinc-205 uppercase tracking-wider">
                                Workspace Members
                            </h2>
                            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs space-y-3 max-h-75 overflow-y-auto">
                                {members.map((m) => (
                                    <DashboardMemberCard
                                        key={m.id}
                                        member={m}
                                        isCurrentUser={m.id === user.id}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 5. SPLIT LAYOUT: RECENT ADDED + RECENT ANALYZED */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Recently Added Feedback */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xs font-bold text-zinc-850 dark:text-zinc-205 uppercase tracking-wider">
                                    Recently Added Feedback
                                </h2>
                                <Link
                                    href="/dashboard/feedback"
                                    className="inline-flex items-center space-x-1 text-[9px] font-black text-indigo-650 dark:text-indigo-400 hover:underline uppercase tracking-wider"
                                >
                                    <span>View Inbox</span>
                                    <ArrowRight className="w-3 h-3" />
                                </Link>
                            </div>

                            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-850">
                                {recentFeedback.length > 0 ? (
                                    recentFeedback.slice(0, 3).map((item) => (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => router.push(`/dashboard/feedback/${item.id}`)}
                                            className="w-full p-4 text-left hover:bg-zinc-50/50 dark:hover:bg-zinc-850/10 transition-colors duration-150 flex flex-col justify-between gap-2.5 outline-none focus-visible:bg-zinc-50/80 dark:focus-visible:bg-zinc-850/20 group cursor-pointer"
                                        >
                                            <p className="text-xs text-zinc-705 dark:text-zinc-300 font-semibold leading-relaxed wrap-break-word">
                                                {truncateText(item.content, 120)}
                                            </p>
                                            <div className="flex items-center justify-between text-[9px] font-bold text-zinc-450 dark:text-zinc-550">
                                                <span className="px-2 py-0.5 rounded bg-zinc-50 dark:bg-zinc-800 border border-zinc-250/50 dark:border-zinc-700/60 uppercase">
                                                    {formatChannel(item.channel as any)}
                                                </span>
                                                <span className="font-mono text-zinc-400 dark:text-zinc-500">
                                                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-zinc-455 text-xs font-bold bg-zinc-50/20 dark:bg-zinc-950/10">
                                        No recent feedback items found.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recently Analyzed Feedback */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xs font-bold text-zinc-850 dark:text-zinc-205 uppercase tracking-wider">
                                    Recently Analyzed Feedback
                                </h2>
                            </div>

                            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-850">
                                {recentAnalyses.length > 0 ? (
                                    recentAnalyses.slice(0, 2).map((analysis) => (
                                        <button
                                            key={analysis.id}
                                            type="button"
                                            onClick={() => router.push(`/dashboard/feedback/${analysis.feedbackId}`)}
                                            className="w-full p-4 text-left hover:bg-zinc-50/50 dark:hover:bg-zinc-850/10 transition-colors duration-150 flex flex-col gap-3 outline-none focus-visible:bg-zinc-50/80 dark:focus-visible:bg-zinc-850/20 group cursor-pointer"
                                        >
                                            <div className="space-y-1">
                                                <span className="text-[8px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">AI Summary</span>
                                                <p className="text-xs text-zinc-705 dark:text-zinc-300 font-semibold leading-relaxed wrap-break-word">
                                                    {truncateText(analysis.summary, 130)}
                                                </p>
                                            </div>

                                            <div className="flex flex-wrap items-center justify-between gap-2.5">
                                                <div className="flex items-center gap-1.5">
                                                    <SentimentBadge sentiment={analysis.sentiment.toUpperCase() as any} />
                                                    <span className="px-2 py-0.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-550 dark:text-zinc-300 text-[9px] font-black uppercase rounded border border-zinc-250/50 dark:border-zinc-700/60">
                                                        {formatFeatureArea(analysis.featureArea)}
                                                    </span>
                                                </div>
                                                <span className="text-[9px] font-bold text-zinc-450 dark:text-zinc-550 font-mono">
                                                    {formatDistanceToNow(new Date(analysis.analyzedAt), { addSuffix: true })}
                                                </span>
                                            </div>
                                        </button>
                                    ))
                                ) : (
                                    /* ONBOARDING EMPTY STATE: NO ANALYSES YET */
                                    <div className="p-8 text-center space-y-4 bg-zinc-50/20 dark:bg-zinc-950/10 h-full flex flex-col items-center justify-center">
                                        <Brain className="w-8 h-8 text-indigo-400 shrink-0 animate-pulse" />
                                        <div className="space-y-1">
                                            <h4 className="text-xs font-black text-zinc-905 dark:text-white">No AI Analysis Conducted</h4>
                                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
                                                Run sentiment analysis on your feedback inbox to unlock AI-powered dashboards and briefings.
                                            </p>
                                        </div>
                                        {!isViewer && (
                                            <Link
                                                href="/dashboard/feedback"
                                                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 text-[10px] font-black transition-all hover:bg-zinc-850 dark:hover:bg-zinc-50 shadow-xs cursor-pointer uppercase"
                                            >
                                                <span>Analyze Feedback</span>
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}
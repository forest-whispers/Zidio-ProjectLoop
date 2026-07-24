"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
    Search, 
    Filter, 
    ChevronLeft, 
    ChevronRight, 
    Plus, 
    RefreshCw, 
    MessageSquare, 
    AlertCircle, 
    Sparkles, 
    FileSpreadsheet, 
    Download,
    Loader2,
    Brain,
    Inbox,
    Upload
} from "lucide-react";
import { format } from "date-fns";
import { FeedbackChannel, FeedbackStatus, Sentiment } from "@prisma/client";
import { feedbackApi, FeedbackFilters, Feedback } from "../services/feedback.api";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "./toast";
import { ImportFeedbackDialog } from "./ImportFeedbackDialog";
import { AnalysisStatus } from "./AnalysisStatus";
import { FeedbackAnalysisDialog } from "./FeedbackAnalysisDialog";
import { CustomSelect } from "@/features/shared/ui/CustomSelect";

// Status Badge Styling Helper
export function getStatusBadgeStyles(status: FeedbackStatus) {
    switch (status) {
        case "SUBMITTED":
            return "bg-blue-50 text-blue-700 border-blue-200/60 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30";
        case "UNDER_REVIEW":
            return "bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/30";
        case "IN_PROGRESS":
            return "bg-indigo-50 text-indigo-700 border-indigo-200/60 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/30";
        case "RESOLVED":
            return "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30";
        case "CLOSED":
            return "bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800/50 dark:text-zinc-400 dark:border-zinc-700/50";
        default:
            return "bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-950/30 dark:text-zinc-400 dark:border-zinc-800/30";
    }
}

// Status Display Text Helper
export function formatStatus(status: FeedbackStatus) {
    switch (status) {
        case "SUBMITTED": return "Submitted";
        case "UNDER_REVIEW": return "Under Review";
        case "IN_PROGRESS": return "In Progress";
        case "RESOLVED": return "Resolved";
        case "CLOSED": return "Closed";
        default: return status;
    }
}

// Channel Display Text Helper
export function formatChannel(channel: FeedbackChannel) {
    switch (channel) {
        case "SUPPORT_TICKET": return "Support Ticket";
        case "APP_STORE": return "App Store";
        case "PLAY_STORE": return "Play Store";
        case "TWITTER": return "Twitter";
        case "SALES_CALL": return "Sales Call";
        case "SURVEY": return "Survey";
        case "COMMUNITY": return "Community";
        case "CSV_IMPORT": return "CSV Import";
        case "MANUAL": return "Manual";
        default: return channel;
    }
}

const STATUS_OPTIONS = [
    { value: "", label: "All Statuses" },
    { value: "SUBMITTED", label: "Submitted" },
    { value: "UNDER_REVIEW", label: "Under Review" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "RESOLVED", label: "Resolved" },
    { value: "CLOSED", label: "Closed" }
];

const CHANNEL_OPTIONS = [
    { value: "", label: "All Channels" },
    { value: "SUPPORT_TICKET", label: "Support Ticket" },
    { value: "APP_STORE", label: "App Store" },
    { value: "PLAY_STORE", label: "Play Store" },
    { value: "TWITTER", label: "Twitter" },
    { value: "SALES_CALL", label: "Sales Call" },
    { value: "SURVEY", label: "Survey" },
    { value: "COMMUNITY", label: "Community" },
    { value: "CSV_IMPORT", label: "CSV Import" },
    { value: "MANUAL", label: "Manual" }
];

const SENTIMENT_OPTIONS = [
    { value: "", label: "All Sentiments" },
    { value: "POSITIVE", label: "Positive" },
    { value: "NEUTRAL", label: "Neutral" },
    { value: "NEGATIVE", label: "Negative" }
];

export function FeedbackList() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryClient = useQueryClient();
    const { toast } = useToast();
    const { data: session } = useSession();
    const isViewer = session?.user?.role === "VIEWER";

    // Dialog state
    const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
    const [selectedFeedbackForAnalysis, setSelectedFeedbackForAnalysis] = useState<Feedback | null>(null);
    const [isAnalysisDialogOpen, setIsAnalysisDialogOpen] = useState(false);

    // Read initial filters from URL params
    const searchVal = searchParams.get("search") || "";
    const statusVal = (searchParams.get("status") || "") as FeedbackStatus | "";
    const channelVal = (searchParams.get("channel") || "") as FeedbackChannel | "";
    const sentimentVal = (searchParams.get("sentiment") || "") as Sentiment | "";
    const pageVal = parseInt(searchParams.get("page") || "1", 10);

    const [searchInput, setSearchInput] = useState(searchVal);

    // Keep state in sync with URL changes (e.g. when filters are reset)
    useEffect(() => {
        setSearchInput(searchVal);
    }, [searchVal]);

    const filters: FeedbackFilters = {
        page: pageVal,
        limit: 10,
        ...(searchVal ? { search: searchVal } : {}),
        ...(statusVal ? { status: statusVal } : {}),
        ...(channelVal ? { channel: channelVal } : {}),
        ...(sentimentVal ? { sentiment: sentimentVal } : {}),
    };

    // TanStack Query
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["feedbacks", filters],
        queryFn: () => feedbackApi.getFeedbacks(filters),
    });

    const hasActiveFilters = !!(searchVal || statusVal || channelVal || sentimentVal);
    const isInboxEmpty = data?.pagination.totalItems === 0;

    // Demo Data Import Mutation
    const demoMutation = useMutation({
        mutationFn: feedbackApi.importDemo,
        onSuccess: (res) => {
            if (res.imported === 0) {
                toast({
                    title: "No Demo Data Imported",
                    description: "All demo items are already imported or dataset is empty.",
                    variant: "default",
                });
            } else {
                toast({
                    title: "Demo Data Imported",
                    description: `Successfully imported ${res.imported} demo feedback entries.`,
                    variant: "success",
                });
            }
            // Invalidate query feedbacks prefix key to trigger a refetch
            queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
        },
        onError: (err: any) => {
            toast({
                title: "Demo Import Failed",
                description: err.message || "Failed to trigger demo data import.",
                variant: "destructive",
            });
        },
    });

    // AI Single Feedback Analysis Mutation
    const analyzeSingleMutation = useMutation({
        mutationFn: feedbackApi.analyzeFeedback,
        onSuccess: (res, feedbackId) => {
            toast({
                title: "Feedback Analyzed",
                description: "AI analysis completed successfully for this feedback item.",
                variant: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
            queryClient.invalidateQueries({ queryKey: ["feedback", feedbackId] });
        },
        onError: (err: any) => {
            toast({
                title: "Analysis Failed",
                description: err.message || "Failed to analyze feedback item.",
                variant: "destructive",
            });
        },
    });

    // AI Workspace Bulk Analysis Mutation
    const workspaceAnalysisMutation = useMutation({
        mutationFn: feedbackApi.analyzeWorkspace,
        onSuccess: (res) => {
            const newlyAnalyzed = res.length;
            const totalItems = data?.pagination.totalItems || 0;
            const alreadyAnalyzed = Math.max(0, totalItems - newlyAnalyzed);

            toast({
                title: "Analysis Completed",
                description: `Analysis complete. ${newlyAnalyzed} feedback items analyzed. ${alreadyAnalyzed} were already analyzed.`,
                variant: "success",
            });
            queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
        },
        onError: (err: any) => {
            toast({
                title: "Bulk Analysis Failed",
                description: err.message || "Failed to analyze workspace feedback items.",
                variant: "destructive",
            });
        },
    });

    // Update URL helper
    const updateUrl = (newParams: Record<string, string | number | null | undefined>) => {
        const params = new URLSearchParams(searchParams.toString());
        
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === null || value === undefined || value === "") {
                params.delete(key);
            } else {
                params.set(key, value.toString());
            }
        });

        // Always reset to page 1 on filter changes unless changing page directly
        if (!("page" in newParams) && pageVal !== 1) {
            params.set("page", "1");
        }

        router.push(`/dashboard/feedback?${params.toString()}`);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateUrl({ search: searchInput });
    };

    const handleClearFilters = () => {
        setSearchInput("");
        router.push("/dashboard/feedback");
    };

    return (
        <div className="grow max-w-6xl w-full mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-300">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <div className="space-y-1">
                    <h1 className="text-xl md:text-2xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2.5">
                        <MessageSquare className="w-5.5 h-5.5 text-indigo-500 shrink-0" />
                        <span>Feedback Inbox</span>
                    </h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
                        Collect, analyze, and organize customer feedback requests
                    </p>
                </div>
                {!isViewer && (
                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* Import Buttons */}
                        <button
                            type="button"
                            onClick={() => setIsImportDialogOpen(true)}
                            disabled={demoMutation.isPending || workspaceAnalysisMutation.isPending}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300 text-xs font-semibold bg-white dark:bg-zinc-900 shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
                        >
                            <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-500" />
                            <span>CSV Import</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => demoMutation.mutate()}
                            disabled={demoMutation.isPending || workspaceAnalysisMutation.isPending}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300 text-xs font-semibold bg-white dark:bg-zinc-900 shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
                        >
                            {demoMutation.isPending ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                            ) : (
                                <Download className="w-3.5 h-3.5 text-indigo-500" />
                            )}
                            <span>Demo Import</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => workspaceAnalysisMutation.mutate()}
                            disabled={workspaceAnalysisMutation.isPending || demoMutation.isPending}
                            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-700 dark:text-zinc-300 text-xs font-semibold bg-white dark:bg-zinc-900 shadow-xs cursor-pointer disabled:opacity-50 transition-colors"
                        >
                            {workspaceAnalysisMutation.isPending ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                            ) : (
                                <Brain className="w-3.5 h-3.5 text-indigo-500" />
                            )}
                            <span>Analyze Remaining</span>
                        </button>

                        <Link
                            href="/dashboard/feedback/new"
                            className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold shadow-md dark:shadow-zinc-900/20 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all active:scale-[0.98] cursor-pointer"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>New Feedback</span>
                        </Link>
                    </div>
                )}
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                    {/* Search Field */}
                    <form onSubmit={handleSearchSubmit} className="grow relative flex">
                        <div className="relative grow">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-zinc-400 dark:text-zinc-500">
                                <Search className="w-4 h-4" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search by feedback content..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 dark:focus:ring-white/10 dark:focus:border-white transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            className="ml-2 px-3.5 py-2 rounded-lg bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition-colors"
                        >
                            Search
                        </button>
                    </form>

                    {/* Filter Selects */}
                    <div className="flex flex-wrap items-center gap-2">
                        {/* Status Select */}
                        <CustomSelect
                            value={statusVal}
                            onChange={(val) => updateUrl({ status: val })}
                            options={STATUS_OPTIONS}
                            placeholder="All Statuses"
                        />

                        {/* Channel Select */}
                        <CustomSelect
                            value={channelVal}
                            onChange={(val) => updateUrl({ channel: val })}
                            options={CHANNEL_OPTIONS}
                            placeholder="All Channels"
                        />

                        {/* Sentiment Select */}
                        <CustomSelect
                            value={sentimentVal}
                            onChange={(val) => updateUrl({ sentiment: val })}
                            options={SENTIMENT_OPTIONS}
                            placeholder="All Sentiments"
                        />

                        {/* Clear Filters Link */}
                        {(searchVal || statusVal || channelVal || sentimentVal) && (
                            <button
                                onClick={handleClearFilters}
                                className="text-xs text-zinc-550 hover:text-red-500 font-semibold transition-colors cursor-pointer"
                            >
                                Clear filters
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Error State */}
            {error && (
                <div className="flex items-start space-x-3 p-4 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    <div className="grow space-y-1">
                        <h4 className="text-sm font-semibold">Failed to fetch feedback</h4>
                        <p className="text-xs text-red-700 dark:text-red-400">{(error as Error).message || "An unexpected error occurred."}</p>
                    </div>
                    <button
                        onClick={() => refetch()}
                        className="flex items-center space-x-1 px-2.5 py-1 rounded bg-white hover:bg-red-100 dark:bg-red-900/40 dark:hover:bg-red-900/60 border border-red-200 dark:border-red-800 text-xs font-semibold transition-all cursor-pointer"
                    >
                        <RefreshCw className="w-3 h-3" />
                        <span>Retry</span>
                    </button>
                </div>
            )}

            {/* Main Content Area */}
            {!error && (
                isInboxEmpty && !hasActiveFilters ? (
                    <div className="p-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center space-y-5 bg-white/40 dark:bg-zinc-900/40 shadow-4xs max-w-2xl mx-auto py-16 animate-in fade-in duration-300">
                        <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-850 flex items-center justify-center border border-zinc-250/50 dark:border-zinc-800/80 text-zinc-400 mx-auto">
                            <Inbox className="w-6 h-6 text-indigo-500" />
                        </div>
                        <div className="space-y-1.5">
                            <h3 className="font-black text-sm text-zinc-900 dark:text-white">Your Feedback Inbox is Empty</h3>
                            <p className="text-xs text-zinc-555 dark:text-zinc-400 max-w-md mx-auto leading-relaxed font-semibold">
                                Get started by creating a new manual feedback entry or upload your bulk client reports using our CSV Import tool.
                            </p>
                        </div>
                        {!isViewer && (
                            <div className="flex items-center justify-center gap-3 pt-2">
                                <button
                                    onClick={() => setIsImportDialogOpen(true)}
                                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:border-zinc-350 dark:hover:border-zinc-700 text-xs font-bold text-zinc-755 dark:text-zinc-300 transition-colors shadow-3xs cursor-pointer"
                                >
                                    <Upload className="w-3.5 h-3.5" />
                                    <span>Import CSV</span>
                                </button>
                                <Link
                                    href="/dashboard/feedback/new"
                                    className="inline-flex items-center space-x-1.5 px-4.5 py-2 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-zinc-800 dark:hover:bg-zinc-100 text-xs font-bold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Create Feedback</span>
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden animate-in fade-in duration-300">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                                        <th className="py-3.5 px-4 font-semibold w-1/3 md:w-1/2">Content</th>
                                        <th className="py-3.5 px-4 font-semibold">Channel</th>
                                        <th className="py-3.5 px-4 font-semibold">Customer Label</th>
                                        <th className="py-3.5 px-4 font-semibold">Status</th>
                                        <th className="py-3.5 px-4 font-semibold">Sentiment</th>
                                        <th className="py-3.5 px-4 font-semibold text-right">Created At</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 text-xs text-zinc-600 dark:text-zinc-300">
                                    {isLoading ? (
                                        // Skeletons matching layout to prevent shifts
                                        Array.from({ length: 6 }).map((_, i) => (
                                            <tr key={i} className="animate-pulse">
                                                <td className="py-4 px-4">
                                                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-11/12" />
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-16" />
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-20" />
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="h-5 bg-zinc-200 dark:bg-zinc-800 rounded-full w-20" />
                                                </td>
                                                <td className="py-4 px-4">
                                                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-12" />
                                                </td>
                                                <td className="py-4 px-4 text-right">
                                                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-20 ml-auto" />
                                                </td>
                                            </tr>
                                        ))
                                    ) : data?.items.length === 0 ? (
                                        // Empty State inside Table when filters are active
                                        <tr>
                                            <td colSpan={6} className="py-12 px-4 text-center">
                                                <div className="flex flex-col items-center justify-center space-y-3">
                                                    <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 text-zinc-400">
                                                        <MessageSquare className="w-6 h-6" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h3 className="font-bold text-sm text-zinc-900 dark:text-white">No feedback found</h3>
                                                        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
                                                            No entries matched your filter parameters. Try expanding your search.
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={handleClearFilters}
                                                        className="px-3.5 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-bold text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer"
                                                    >
                                                        Clear Filters
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        // Feedbacks List
                                        data?.items.map((item) => (
                                            <tr
                                                key={item.id}
                                                onClick={() => router.push(`/dashboard/feedback/${item.id}`)}
                                                className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-all duration-200 group/row"
                                            >
                                                {/* Content with readable layout */}
                                                <td className="py-3.5 px-4 font-semibold max-w-50 md:max-w-xs relative">
                                                    <div className="relative group/tooltip inline-block max-w-full">
                                                        <span className="block truncate text-zinc-900 dark:text-white group-hover/row:text-indigo-650 dark:group-hover/row:text-indigo-400 transition-colors">
                                                            {item.content}
                                                        </span>
                                                        <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block z-50 w-72 p-3 bg-zinc-900 text-zinc-150 dark:bg-white dark:text-zinc-900 text-xs rounded-lg shadow-lg border border-zinc-800 dark:border-zinc-200 pointer-events-none wrap-break-word font-medium leading-relaxed">
                                                            {item.content}
                                                        </div>
                                                    </div>
                                                </td>
                                                
                                                {/* Channel */}
                                                <td className="py-3.5 px-4 text-zinc-500 dark:text-zinc-455 font-semibold">
                                                    {formatChannel(item.channel)}
                                                </td>
                                                
                                                {/* Customer Label */}
                                                <td className="py-3.5 px-4">
                                                    {item.customerLabel ? (
                                                        <span className="inline-block px-2.5 py-0.5 rounded bg-zinc-50 dark:bg-zinc-850 border border-zinc-250 dark:border-zinc-750 text-[10px] font-semibold text-zinc-700 dark:text-zinc-350">
                                                            {item.customerLabel}
                                                        </span>
                                                    ) : (
                                                        <span className="text-zinc-400 dark:text-zinc-600 font-semibold">—</span>
                                                    )}
                                                </td>

                                                {/* Status Badge */}
                                                <td className="py-3.5 px-4">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadgeStyles(item.status)}`}>
                                                        {formatStatus(item.status)}
                                                    </span>
                                                </td>

                                                {/* Sentiment / Analysis Status */}
                                                <td className="py-3.5 px-4">
                                                    <AnalysisStatus
                                                        status={
                                                            analyzeSingleMutation.isPending &&
                                                            analyzeSingleMutation.variables === item.id
                                                                ? "loading"
                                                                : item.analysis
                                                                ? "completed"
                                                                : "idle"
                                                        }
                                                        analysis={item.analysis}
                                                        onAnalyze={() => analyzeSingleMutation.mutate(item.id)}
                                                        onView={() => {
                                                            setSelectedFeedbackForAnalysis(item);
                                                            setIsAnalysisDialogOpen(true);
                                                        }}
                                                        disabled={
                                                            analyzeSingleMutation.isPending ||
                                                            workspaceAnalysisMutation.isPending ||
                                                            demoMutation.isPending
                                                        }
                                                    />
                                                </td>

                                                {/* Created Date */}
                                                <td className="py-3.5 px-4 text-right text-zinc-400 dark:text-zinc-500 font-mono">
                                                    {format(new Date(item.createdAt), "MMM d, yyyy")}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Controls */}
                        {data && data.pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/30 dark:bg-zinc-900/30">
                                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
                                    Showing{" "}
                                    <span className="font-extrabold text-zinc-900 dark:text-white font-mono">
                                        {(data.pagination.page - 1) * data.pagination.limit + 1}
                                    </span>{" "}
                                    to{" "}
                                    <span className="font-extrabold text-zinc-900 dark:text-white font-mono">
                                        {Math.min(
                                            data.pagination.page * data.pagination.limit,
                                            data.pagination.totalItems
                                        )}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-extrabold text-zinc-900 dark:text-white font-mono">
                                        {data.pagination.totalItems}
                                    </span>{" "}
                                    feedbacks
                                </span>
                                <div className="flex items-center space-x-1.5">
                                    <button
                                        onClick={() => updateUrl({ page: data.pagination.page - 1 })}
                                        disabled={data.pagination.page <= 1}
                                        className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200 disabled:opacity-40 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent cursor-pointer"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="text-xs text-zinc-650 dark:text-zinc-400 font-bold px-2 font-mono">
                                        Page {data.pagination.page} of {data.pagination.totalPages}
                                    </span>
                                    <button
                                        onClick={() => updateUrl({ page: data.pagination.page + 1 })}
                                        disabled={data.pagination.page >= data.pagination.totalPages}
                                        className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-800 dark:hover:text-zinc-200 disabled:opacity-40 disabled:hover:bg-transparent dark:disabled:hover:bg-transparent cursor-pointer"
                                    >
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )
            )}

            {/* Import Feedback Dialog Modal */}
            <ImportFeedbackDialog 
                isOpen={isImportDialogOpen} 
                onClose={() => setIsImportDialogOpen(false)} 
                onSuccess={() => queryClient.invalidateQueries({ queryKey: ["feedbacks"] })}
            />

            {/* AI Analysis Dialog Modal */}
            <FeedbackAnalysisDialog
                isOpen={isAnalysisDialogOpen}
                onClose={() => {
                    setIsAnalysisDialogOpen(false);
                    setSelectedFeedbackForAnalysis(null);
                }}
                feedback={selectedFeedbackForAnalysis}
                analysis={selectedFeedbackForAnalysis?.analysis || null}
            />
        </div>
    );
}
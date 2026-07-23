"use client";

import { useQuery } from "@tanstack/react-query";
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
    Download 
} from "lucide-react";
import { format } from "date-fns";
import { FeedbackChannel, FeedbackStatus } from "@prisma/client";
import { feedbackApi, FeedbackFilters } from "../services/feedback.api";
import { useState, useEffect } from "react";

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

export function FeedbackList() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Read initial filters from URL params
    const searchVal = searchParams.get("search") || "";
    const statusVal = (searchParams.get("status") || "") as FeedbackStatus | "";
    const channelVal = (searchParams.get("channel") || "") as FeedbackChannel | "";
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
    };

    // TanStack Query
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ["feedbacks", filters],
        queryFn: () => feedbackApi.getFeedbacks(filters),
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-zinc-200 dark:border-zinc-800">
                <div>
                    <h1 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                        Feedback Inbox
                    </h1>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                        Collect, analyze, and organize customer feedback requests
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Placeholder Import Buttons */}
                    <button
                        disabled
                        title="CSV Import coming in future update"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 text-xs font-semibold bg-zinc-50 dark:bg-zinc-900 opacity-60 cursor-not-allowed"
                    >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span>CSV Import</span>
                    </button>
                    <button
                        disabled
                        title="Demo Import coming in future update"
                        className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-600 text-xs font-semibold bg-zinc-50 dark:bg-zinc-900 opacity-60 cursor-not-allowed"
                    >
                        <Download className="w-3.5 h-3.5" />
                        <span>Demo Import</span>
                    </button>

                    <Link
                        href="/dashboard/feedback/new"
                        className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-semibold shadow-md dark:shadow-zinc-900/20 hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-all active:scale-[0.98] cursor-pointer"
                    >
                        <Plus className="w-3.5 h-3.5" />
                        <span>New Feedback</span>
                    </Link>
                </div>
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
                        <div className="flex items-center space-x-1.5">
                            <select
                                value={statusVal}
                                onChange={(e) => updateUrl({ status: e.target.value })}
                                className="pl-3 pr-8 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30 text-zinc-800 dark:text-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 dark:focus:ring-white/10 dark:focus:border-white appearance-none cursor-pointer"
                            >
                                <option value="">All Statuses</option>
                                <option value="SUBMITTED">Submitted</option>
                                <option value="UNDER_REVIEW">Under Review</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div>

                        {/* Channel Select */}
                        <div className="flex items-center space-x-1.5">
                            <select
                                value={channelVal}
                                onChange={(e) => updateUrl({ channel: e.target.value })}
                                className="pl-3 pr-8 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/30 text-zinc-800 dark:text-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-zinc-950/10 focus:border-zinc-950 dark:focus:ring-white/10 dark:focus:border-white appearance-none cursor-pointer"
                            >
                                <option value="">All Channels</option>
                                <option value="SUPPORT_TICKET">Support Ticket</option>
                                <option value="APP_STORE">App Store</option>
                                <option value="PLAY_STORE">Play Store</option>
                                <option value="TWITTER">Twitter</option>
                                <option value="SALES_CALL">Sales Call</option>
                                <option value="SURVEY">Survey</option>
                                <option value="COMMUNITY">Community</option>
                                <option value="CSV_IMPORT">CSV Import</option>
                                <option value="MANUAL">Manual</option>
                            </select>
                        </div>

                        {/* Sentiment Select (Disabled AI Placeholder) */}
                        <div className="flex items-center space-x-1.5 relative group">
                            <select
                                disabled
                                className="pl-3 pr-8 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900 text-zinc-400 dark:text-zinc-600 text-xs cursor-not-allowed appearance-none"
                            >
                                <option>AI Sentiment (Coming in AI Phase)</option>
                            </select>
                            <Sparkles className="w-3.5 h-3.5 absolute right-2.5 text-zinc-400 dark:text-zinc-600 pointer-events-none" />
                        </div>

                        {/* Clear Filters Link */}
                        {(searchVal || statusVal || channelVal) && (
                            <button
                                onClick={handleClearFilters}
                                className="text-xs text-zinc-500 hover:text-red-500 font-medium transition-colors cursor-pointer"
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
                <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
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
                                    // Skeletons
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
                                            <td className="py-4 px-4">
                                                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-20 ml-auto" />
                                            </td>
                                        </tr>
                                    ))
                                ) : data?.items.length === 0 ? (
                                    // Empty State inside Table
                                    <tr>
                                        <td colSpan={6} className="py-12 px-4 text-center">
                                            <div className="flex flex-col items-center justify-center space-y-3">
                                                <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center border border-zinc-200 dark:border-zinc-800 text-zinc-400">
                                                    <MessageSquare className="w-6 h-6" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-bold text-sm text-zinc-900 dark:text-white">No feedback found</h3>
                                                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                                        No entries matched your filter parameters. Try expanding your search.
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={handleClearFilters}
                                                    className="px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition-colors cursor-pointer"
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
                                            className="hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors group/row"
                                        >
                                            {/* Truncated Content + Custom CSS Tooltip */}
                                            <td className="py-3.5 px-4 font-medium max-w-50 md:max-w-xs relative">
                                                <div className="relative group/tooltip inline-block max-w-full">
                                                    <span className="block truncate text-zinc-900 dark:text-white group-hover/row:text-indigo-600 dark:group-hover/row:text-indigo-400 transition-colors font-medium">
                                                        {item.content}
                                                    </span>
                                                    {/* Tooltip Popup */}
                                                    <div className="absolute left-0 bottom-full mb-2 hidden group-hover/tooltip:block z-50 w-72 p-3 bg-zinc-900 text-zinc-100 dark:bg-white dark:text-zinc-900 text-xs rounded-lg shadow-lg border border-zinc-800 dark:border-zinc-200 pointer-events-none wrap-break-word font-normal">
                                                        {item.content}
                                                    </div>
                                                </div>
                                            </td>
                                            
                                            {/* Channel */}
                                            <td className="py-3.5 px-4 text-zinc-500 dark:text-zinc-400">
                                                {formatChannel(item.channel)}
                                            </td>

                                            {/* Customer Label */}
                                            <td className="py-3.5 px-4">
                                                {item.customerLabel ? (
                                                    <span className="inline-block px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/50 dark:border-zinc-700/50 text-[10px] font-semibold text-zinc-600 dark:text-zinc-300">
                                                        {item.customerLabel}
                                                    </span>
                                                ) : (
                                                    <span className="text-zinc-400 dark:text-zinc-600">—</span>
                                                )}
                                            </td>

                                            {/* Status Badge */}
                                            <td className="py-3.5 px-4">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadgeStyles(item.status)}`}>
                                                    {formatStatus(item.status)}
                                                </span>
                                            </td>

                                            {/* Sentiment Badge (AI Placeholder) */}
                                            <td className="py-3.5 px-4">
                                                <span 
                                                    title="Sentiment will be classified automatically by AI in the next phase"
                                                    className="inline-flex items-center space-x-1 text-[10px] text-zinc-400 dark:text-zinc-600 font-semibold"
                                                >
                                                    <Sparkles className="w-3 h-3 text-zinc-300 dark:text-zinc-700" />
                                                    <span>Pending AI</span>
                                                </span>
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
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">
                                Showing{" "}
                                <span className="font-semibold text-zinc-900 dark:text-white">
                                    {(data.pagination.page - 1) * data.pagination.limit + 1}
                                </span>{" "}
                                to{" "}
                                <span className="font-semibold text-zinc-900 dark:text-white">
                                    {Math.min(
                                        data.pagination.page * data.pagination.limit,
                                        data.pagination.totalItems
                                    )}
                                </span>{" "}
                                of{" "}
                                <span className="font-semibold text-zinc-900 dark:text-white">
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
                                <span className="text-xs text-zinc-600 dark:text-zinc-400 font-semibold px-2">
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
            )}
        </div>
    );
}
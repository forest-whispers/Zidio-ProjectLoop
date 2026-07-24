"use client";

import React, { useState } from "react";
import { Citation } from "@/server/modules/askLoop/askLoop.types";
import { SentimentBadge } from "@/features/feedback/components/SentimentBadge";
import { formatFeatureArea } from "@/features/feedback/components/AnalysisSummaryCard";
import { formatChannel } from "@/features/feedback/components/FeedbackList";
import { ChevronDown, ChevronUp, Link as LinkIcon, Quote } from "lucide-react";
import { useRouter } from "next/navigation";

interface CitationCardProps {
    citation: Citation;
    index: number;
}

export function CitationCard({ citation, index }: CitationCardProps) {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);

    // Convert similarity score e.g. 0.88 to 88%
    const similarityPercent = Math.round(citation.similarity * 100);

    return (
        <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-3xs overflow-hidden flex flex-col justify-between transition-all duration-200 hover:border-zinc-350 dark:hover:border-zinc-755 hover:shadow-2xs">
            {/* Header info bar */}
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-850 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-zinc-50/20 dark:bg-zinc-950/10">
                <div className="flex items-center space-x-2 shrink-0">
                    <span className="w-5 h-5 rounded-md bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center text-[10px] font-black text-indigo-650 dark:text-indigo-400">
                        #{index + 1}
                    </span>
                    <span className="px-2 py-0.5 border border-zinc-250 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-850 text-[10px] font-black font-mono text-zinc-600 dark:text-zinc-400 rounded-md">
                        {similarityPercent}% Match
                    </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <SentimentBadge sentiment={citation.sentiment.toUpperCase() as any} />
                    <span className="px-2 py-0.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-350 text-[9px] font-bold uppercase rounded border border-zinc-200/50 dark:border-zinc-700">
                        {formatFeatureArea(citation.featureArea)}
                    </span>
                    <span className="px-2 py-0.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-350 text-[9px] font-bold uppercase rounded border border-zinc-200/50 dark:border-zinc-700">
                        {formatChannel(citation.channel as any)}
                    </span>
                </div>
            </div>

            {/* Core citation content block */}
            <div className="p-4 space-y-3.5 flex-1">
                {/* AI Summary of the quote */}
                <div className="space-y-1">
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">Insight Summary</span>
                    <p className="text-xs text-zinc-800 dark:text-zinc-200 font-bold leading-relaxed">
                        {citation.summary}
                    </p>
                </div>

                {/* Theme Badges */}
                {citation.themes && citation.themes.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                        {citation.themes.map((theme) => (
                            <span 
                                key={theme} 
                                className="px-2 py-0.5 rounded bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/50 dark:border-zinc-800/80 text-[9px] font-bold text-zinc-500 dark:text-zinc-450"
                            >
                                {theme}
                            </span>
                        ))}
                    </div>
                )}

                {/* Original Content Preview - Expandable */}
                <div className="border-t border-zinc-100 dark:border-zinc-850 pt-3">
                    <button
                        type="button"
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="inline-flex items-center space-x-1.5 text-[9px] font-black text-indigo-650 dark:text-indigo-400 uppercase hover:underline cursor-pointer tracking-wider"
                    >
                        {isExpanded ? (
                            <>
                                <ChevronUp className="w-3 h-3 shrink-0" />
                                <span>Hide Original Feedback</span>
                            </>
                        ) : (
                            <>
                                <ChevronDown className="w-3 h-3 shrink-0" />
                                <span>Show Original Feedback</span>
                            </>
                        )}
                    </button>

                    {isExpanded && (
                        <div className="mt-3 p-3.5 bg-zinc-50/50 dark:bg-zinc-950/20 rounded-xl border border-zinc-150 dark:border-zinc-850 relative text-[11px] text-zinc-650 dark:text-zinc-350 leading-relaxed font-semibold italic whitespace-pre-wrap animate-in slide-in-from-top-2 duration-200">
                            <Quote className="absolute top-2.5 left-2.5 w-4 h-4 text-zinc-200 dark:text-zinc-800 pointer-events-none" />
                            <div className="pl-6 pt-1">
                                {citation.content}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Citation Actions */}
            <div className="p-3 border-t border-zinc-100 dark:border-zinc-850 bg-zinc-50/50 dark:bg-zinc-950/5 flex items-center justify-end">
                <button
                    type="button"
                    onClick={() => router.push(`/dashboard/feedback/${citation.feedbackId}`)}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:border-zinc-350 dark:hover:border-zinc-700 text-[10px] font-bold text-zinc-700 dark:text-zinc-300 transition-colors shadow-3xs cursor-pointer"
                >
                    <LinkIcon className="w-3 h-3 shrink-0" />
                    <span>View Detail View</span>
                </button>
            </div>
        </div>
    );
}
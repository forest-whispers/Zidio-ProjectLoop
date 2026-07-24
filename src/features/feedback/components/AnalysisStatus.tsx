import React from "react";
import { Sparkles, Loader2, Eye } from "lucide-react";
import { SentimentBadge } from "./SentimentBadge";
import { FeedbackAnalysis } from "../services/feedback.api";

interface AnalysisStatusProps {
    status: "idle" | "loading" | "completed";
    analysis?: FeedbackAnalysis | null;
    onAnalyze: (e: React.MouseEvent) => void;
    onView: (e: React.MouseEvent) => void;
    disabled?: boolean;
}

export function AnalysisStatus({
    status,
    analysis,
    onAnalyze,
    onView,
    disabled = false,
}: AnalysisStatusProps) {
    if (status === "loading") {
        return (
            <div 
                onClick={(e) => e.stopPropagation()} 
                className="inline-flex items-center space-x-1.5 text-[11px] font-bold text-zinc-500"
            >
                <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                <span>Analyzing...</span>
            </div>
        );
    }

    if (status === "completed" && analysis) {
        return (
            <div className="flex items-center gap-2">
                <SentimentBadge sentiment={analysis.sentiment} />
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onView(e);
                    }}
                    className="inline-flex items-center space-x-1 px-2 py-0.8 rounded-md border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-[10px] font-bold shadow-2xs hover:text-zinc-900 transition-colors cursor-pointer"
                >
                    <Eye className="w-3 h-3 text-indigo-500 shrink-0" />
                    <span>View Analysis</span>
                </button>
            </div>
        );
    }

    // Default: idle state
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={(e) => {
                e.stopPropagation();
                onAnalyze(e);
            }}
            className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md border border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:border-zinc-400 text-zinc-750 dark:text-zinc-300 text-[10px] font-bold shadow-2xs active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
        >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>Analyze</span>
        </button>
    );
}
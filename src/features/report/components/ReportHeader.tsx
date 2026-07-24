import React from "react";
import { Sparkles, Calendar, Clock } from "lucide-react";
import { ReportRange } from "@/server/modules/report/report.types";

interface ReportHeaderProps {
    title: string;
    range: ReportRange;
    generatedAt: string;
}

export const getRangeLabel = (range: ReportRange) => {
    switch (range) {
        case "7d": return "7 Days";
        case "30d": return "30 Days";
        case "90d": return "90 Days";
        case "1y": return "1 Year";
        case "all": return "All Time";
        default: return range;
    }
};

export function ReportHeader({ title, range, generatedAt }: ReportHeaderProps) {
    const formattedDate = new Date(generatedAt).toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
    });

    return (
        <div className="space-y-4 pb-6 border-b border-zinc-200 dark:border-zinc-800">
            {/* Title & Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-lg font-black text-zinc-950 dark:text-white tracking-tight leading-snug">
                    {title}
                </h2>
                
                <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-150/40 dark:border-indigo-900/30 text-[9px] font-black text-indigo-650 dark:text-indigo-400 uppercase tracking-wider self-start sm:self-center shrink-0 shadow-3xs">
                    <Sparkles className="w-3 h-3 shrink-0" />
                    <span>AI Generated · Powered by Gemini</span>
                </span>
            </div>

            {/* Timeframe & Timestamp details */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[10px] text-zinc-500 dark:text-zinc-450 font-bold">
                <div className="flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Timeframe:</span>
                    <span className="text-zinc-850 dark:text-zinc-200">{getRangeLabel(range)}</span>
                </div>
                
                <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Compiled:</span>
                    <span className="text-zinc-850 dark:text-zinc-200">{formattedDate}</span>
                </div>
            </div>
        </div>
    );
}
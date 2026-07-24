"use client";

import React, { useEffect, useRef } from "react";
import { ReportRange } from "@/server/modules/report/report.types";
import { getRangeLabel } from "./ReportHeader";
import { Play, RotateCw, Download, Copy, Check } from "lucide-react";

interface ReportToolbarProps {
    selectedRange: ReportRange;
    onRangeSelect: (range: ReportRange) => void;
    onGenerate: () => void;
    onDownloadPDF: () => void;
    onCopyMarkdown: () => void;
    isGenerating: boolean;
    hasReport: boolean;
    isCopied: boolean;
}

const RANGES: ReportRange[] = ["7d", "30d", "90d", "1y", "all"];

export function ReportToolbar({
    selectedRange,
    onRangeSelect,
    onGenerate,
    onDownloadPDF,
    onCopyMarkdown,
    isGenerating,
    hasReport,
    isCopied,
}: ReportToolbarProps) {
    const generateBtnRef = useRef<HTMLButtonElement>(null);

    // Auto-focus the generate button when the selected range changes
    useEffect(() => {
        generateBtnRef.current?.focus();
    }, [selectedRange]);

    return (
        <div className="p-4 border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-xl shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4 transition-all print:hidden">
            {/* Range Selector */}
            <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mr-1.5">Timeframe:</span>
                {RANGES.map((r) => {
                    const active = selectedRange === r;
                    return (
                        <button
                            key={r}
                            type="button"
                            disabled={isGenerating}
                            onClick={() => onRangeSelect(r)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                                active
                                    ? "bg-zinc-950 text-white dark:bg-white dark:text-zinc-950 border-zinc-900 dark:border-white shadow-xs"
                                    : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:text-zinc-900 dark:hover:text-white border-transparent"
                            }`}
                        >
                            {getRangeLabel(r)}
                        </button>
                    );
                })}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
                {/* Generate / Regenerate button */}
                <button
                    ref={generateBtnRef}
                    type="button"
                    disabled={isGenerating}
                    onClick={onGenerate}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-850 dark:hover:bg-zinc-50 text-xs font-bold shadow-xs transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                >
                    {isGenerating ? (
                        <RotateCw className="w-3.5 h-3.5 animate-spin" />
                    ) : hasReport ? (
                        <RotateCw className="w-3.5 h-3.5" />
                    ) : (
                        <Play className="w-3.5 h-3.5" />
                    )}
                    <span>{hasReport ? "Regenerate Report" : "Generate Report"}</span>
                </button>

                {/* Download PDF button */}
                <button
                    type="button"
                    disabled={isGenerating || !hasReport}
                    onClick={onDownloadPDF}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:border-zinc-350 dark:hover:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-350 transition-colors shadow-3xs disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download PDF</span>
                </button>

                {/* Copy Markdown button */}
                <button
                    type="button"
                    disabled={isGenerating || !hasReport}
                    onClick={onCopyMarkdown}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:border-zinc-350 dark:hover:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-350 transition-colors shadow-3xs disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
                >
                    {isCopied ? (
                        <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                        </>
                    ) : (
                        <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Markdown</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
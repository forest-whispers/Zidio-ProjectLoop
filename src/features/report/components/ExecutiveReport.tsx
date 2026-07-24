"use client";

import React, { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { ReportRange, ExecutiveReportResponse } from "@/server/modules/report/report.types";
import { reportApi } from "../services/report.api";
import { exportReportToPDF } from "../services/pdfExporter";
import { ReportHeader, getRangeLabel } from "./ReportHeader";
import { ReportToolbar } from "./ReportToolbar";
import { MarkdownReport } from "./MarkdownReport";
import { EmptyState } from "./EmptyState";
import { LoadingState } from "./LoadingState";
import { useToast } from "@/features/feedback/components/toast";
import { FileText, Sparkles, Loader2, AlertCircle } from "lucide-react";

export function ExecutiveReport() {
    const { toast } = useToast();
    const reportRef = useRef<HTMLDivElement>(null);

    const [selectedRange, setSelectedRange] = useState<ReportRange>("30d");
    const [reportData, setReportData] = useState<ExecutiveReportResponse | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    // Mutation to generate the executive report
    const { mutate: runGenerate, isPending: isGenerating, error } = useMutation({
        mutationFn: (range: ReportRange) => reportApi.generateReport(range),
        onSuccess: (data) => {
            setReportData(data);
            toast({ title: "✓ Report generated successfully", variant: "success" });
            
            // Smooth scroll to the report container on generation success
            setTimeout(() => {
                reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 150);
        },
        onError: (err) => {
            toast({ title: `Failed to generate report: ${err.message}`, variant: "destructive" });
        }
    });

    const handleGenerate = () => {
        if (isGenerating) return;
        runGenerate(selectedRange);
    };

    const handleDownloadPDF = () => {
        if (!reportData) return;
        try {
            exportReportToPDF(
                reportData.title,
                getRangeLabel(reportData.range),
                reportData.generatedAt,
                reportData.report
            );
            toast({ title: "✓ PDF downloaded successfully", variant: "success" });
        } catch (err: any) {
            toast({ title: `PDF export failed: ${err.message}`, variant: "destructive" });
        }
    };

    const handleCopyMarkdown = () => {
        if (!reportData) return;
        navigator.clipboard.writeText(reportData.report);
        setIsCopied(true);
        toast({ title: "✓ Report Markdown copied to clipboard", variant: "success" });
        setTimeout(() => setIsCopied(false), 2000);
    };

    const hasReport = reportData !== null;

    return (
        <main className="grow max-w-4xl w-full mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300 relative">
            {/* Global Print Styling Overlay */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    body {
                        background: white !important;
                        color: black !important;
                    }
                    header, footer, nav, .print-hide {
                        display: none !important;
                    }
                    .print-container {
                        max-width: 100% !important;
                        padding: 0 !important;
                        box-shadow: none !important;
                        border: none !important;
                        background: transparent !important;
                    }
                }
            `}} />

            {/* Header Title toolbar */}
            <div className="pb-2 border-b border-zinc-200/60 dark:border-zinc-800 print-hide">
                <h1 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                    <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
                    <span>Executive Report</span>
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                    Summarize product feedback trends into an executive-ready intelligence briefing
                </p>
            </div>

            {/* Sticky Actions & Range Selector */}
            <ReportToolbar
                selectedRange={selectedRange}
                onRangeSelect={setSelectedRange}
                onGenerate={handleGenerate}
                onDownloadPDF={handleDownloadPDF}
                onCopyMarkdown={handleCopyMarkdown}
                isGenerating={isGenerating}
                hasReport={hasReport}
                isCopied={isCopied}
            />

            {/* Error Indicator Banner */}
            {error && (
                <div className="p-5 border border-red-200/50 dark:border-red-950/20 bg-red-50/50 dark:bg-red-950/10 rounded-xl flex items-start space-x-3.5 text-left animate-in fade-in duration-300 print-hide">
                    <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <h4 className="text-xs font-black text-red-800 dark:text-red-400">Generation Failed</h4>
                        <p className="text-[10px] text-red-700 dark:text-red-500 font-medium">
                            {error instanceof Error ? error.message : "An unexpected error occurred."}
                        </p>
                        <button
                            type="button"
                            onClick={handleGenerate}
                            className="mt-2 text-[10px] font-black text-red-700 dark:text-red-450 hover:underline uppercase tracking-wider cursor-pointer"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}

            {/* Content view toggle */}
            <div className="relative">
                {/* 1. Loading state overlay during active generation */}
                {isGenerating && (
                    <div className="absolute inset-0 z-20 bg-[#fafaf6]/60 dark:bg-[#0a0a09]/60 backdrop-blur-3xs rounded-xl flex items-center justify-center min-h-75 animate-in fade-in duration-200">
                        <LoadingState />
                    </div>
                )}

                {/* 2. Main Page Render */}
                {hasReport ? (
                    /* Document-like wrapper container */
                    <div 
                        ref={reportRef}
                        className="print-container max-w-3xl mx-auto shadow-sm rounded-xl p-8 md:p-10 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-6 animate-in slide-in-from-bottom-4 duration-300"
                    >
                        {/* Report metadata header */}
                        <ReportHeader
                            title={reportData.title}
                            range={reportData.range}
                            generatedAt={reportData.generatedAt}
                        />

                        {/* Rendered report block */}
                        <div className="pt-2">
                            <MarkdownReport content={reportData.report} />
                        </div>
                    </div>
                ) : (
                    /* Show initial empty briefing context help card if no report exists */
                    !isGenerating && <EmptyState />
                )}
            </div>
        </main>
    );
}
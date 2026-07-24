"use client";

import { X, Brain, Calendar, Info, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { Feedback, FeedbackAnalysis } from "../services/feedback.api";
import { SentimentBadge } from "./SentimentBadge";
import { ThemeBadgeList } from "./ThemeBadgeList";
import { KeywordBadgeList } from "./KeywordBadgeList";
import { AnalysisSummaryCard, formatFeatureArea } from "./AnalysisSummaryCard";

interface FeedbackAnalysisDialogProps {
    isOpen: boolean;
    onClose: () => void;
    feedback: Feedback | null;
    analysis: FeedbackAnalysis | null;
}

export function FeedbackAnalysisDialog({
    isOpen,
    onClose,
    feedback,
    analysis,
}: FeedbackAnalysisDialogProps) {
    if (!isOpen || !feedback || !analysis) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
            {/* Dialog Panel */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl max-w-lg w-full shadow-2xl flex flex-col max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="p-5 border-b border-zinc-150 dark:border-zinc-800 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-950/20">
                    <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center text-indigo-500 shrink-0">
                            <Brain className="w-4.5 h-4.5" />
                        </div>
                        <div>
                            <h2 className="font-extrabold text-sm text-zinc-900 dark:text-white tracking-tight leading-none">
                                AI Analysis Report
                            </h2>
                            <p className="text-[10px] text-zinc-400 dark:text-zinc-500 font-semibold mt-1">
                                Automatically generated classification for customer feedback
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg text-zinc-450 hover:text-zinc-800 dark:hover:text-white hover:bg-zinc-150 dark:hover:bg-zinc-805 transition-colors cursor-pointer"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Dialog Body */}
                <div className="p-5 overflow-y-auto grow space-y-4.5">
                    
                    {/* Customer Info / Date Metadata */}
                    <div className="flex flex-wrap gap-y-2 justify-between items-center text-[10px] text-zinc-400 dark:text-zinc-500 font-bold border-b border-zinc-100 dark:border-zinc-850 pb-3">
                        <div className="flex items-center space-x-1.5">
                            <span className="uppercase tracking-wider">Customer:</span>
                            <span className="text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded font-mono">
                                {feedback.customerLabel || "Anonymous"}
                            </span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                            <Calendar className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                            <span>
                                Analyzed on {format(new Date(analysis.analyzedAt), "MMM d, yyyy")}
                            </span>
                        </div>
                    </div>

                    {/* Original Feedback Section */}
                    <div className="space-y-1.5">
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                            Original Feedback
                        </span>
                        <div className="p-3.5 rounded-lg border border-zinc-150 dark:border-zinc-850 bg-zinc-50/30 dark:bg-zinc-950/10 text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium max-h-32 overflow-y-auto">
                            {feedback.content}
                        </div>
                    </div>

                    {/* AI Summary Card (Summary, featureArea, sentimentScore) */}
                    <div className="space-y-1.5">
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                            AI Synthesis
                        </span>
                        <AnalysisSummaryCard 
                            summary={analysis.summary} 
                            featureArea={analysis.featureArea} 
                            sentimentScore={analysis.sentimentScore} 
                        />
                    </div>

                    {/* Metadata Grid (Sentiment, Feature Area) */}
                    <div className="grid grid-cols-2 gap-3.5">
                        {/* Sentiment */}
                        <div className="p-3 rounded-lg border border-zinc-150 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-950/10 space-y-1.5">
                            <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-wider block">
                                Sentiment
                            </span>
                            <div>
                                <SentimentBadge sentiment={analysis.sentiment} />
                            </div>
                        </div>

                        {/* Feature Area */}
                        <div className="p-3 rounded-lg border border-zinc-150 dark:border-zinc-850 bg-zinc-50/20 dark:bg-zinc-950/10 space-y-1.5">
                            <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-black uppercase tracking-wider block">
                                Classification Area
                            </span>
                            <span className="inline-block text-[10px] font-bold text-zinc-750 dark:text-zinc-300">
                                {formatFeatureArea(analysis.featureArea)}
                            </span>
                        </div>
                    </div>

                    {/* Themes list */}
                    <div className="space-y-1.5 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                            Assigned Themes
                        </span>
                        <ThemeBadgeList themes={feedback.themes} />
                    </div>

                    {/* Keywords list */}
                    <div className="space-y-1.5 border-t border-zinc-100 dark:border-zinc-850 pt-3">
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider block">
                            Extracted Keywords
                        </span>
                        <KeywordBadgeList keywords={analysis.keywords} />
                    </div>

                    {/* Model Details */}
                    <div className="flex items-center justify-between text-[9px] text-zinc-400 dark:text-zinc-500 font-semibold border-t border-zinc-100 dark:border-zinc-850 pt-3 opacity-80">
                        <div className="flex items-center space-x-1">
                            <Info className="w-3 h-3 shrink-0 text-zinc-400" />
                            <span>Powered by {analysis.provider} ({analysis.model})</span>
                        </div>
                        {analysis.processingTimeMs && (
                            <span>Time: {analysis.processingTimeMs}ms</span>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 flex items-center justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4.5 py-1.8 rounded-lg bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold shadow-md transition-colors cursor-pointer"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
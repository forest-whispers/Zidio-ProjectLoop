"use client";

import React, { useState, useEffect, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { askLoopApi } from "../services/askLoop.api";
import { SuggestedQuestionCard } from "./SuggestedQuestionCard";
import { CitationCard } from "./CitationCard";
import { Markdown } from "./Markdown";
import { 
    Sparkles, 
    Send, 
    AlertCircle, 
    Brain, 
    Layers, 
    HelpCircle, 
    Inbox,
    Clock,
    Loader2
} from "lucide-react";
import { AskLoopResponse } from "@/server/modules/askLoop/askLoop.types";

const SUGGESTED_PROMPTS = [
    "What are the biggest customer pain points?",
    "What feature receives the most praise?",
    "Summarize recent negative feedback.",
    "Which feature should we prioritize next?",
    "What authentication issues are users reporting?",
    "What payment problems are customers facing?"
];

export function AskLoop() {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const answerRef = useRef<HTMLDivElement>(null);

    const [question, setQuestion] = useState("");
    const [response, setResponse] = useState<AskLoopResponse | null>(null);
    const [loadingMessageIdx, setLoadingMessageIdx] = useState(0);

    // TanStack Query mutation to ask question
    const { mutate, isPending: isLoading, error, reset } = useMutation({
        mutationFn: (q: string) => askLoopApi.askQuestion(q),
        onSuccess: (data) => {
            setResponse(data);
            // Scroll Answer card into view on success
            setTimeout(() => {
                answerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
        },
    });

    // Auto-focus textarea on page load
    useEffect(() => {
        textareaRef.current?.focus();
    }, []);

    // Rotate loading messages while query is running
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isLoading) {
            interval = setInterval(() => {
                setLoadingMessageIdx((prev) => (prev + 1) % 3);
            }, 3000);
        } else {
            setLoadingMessageIdx(0);
        }
        return () => clearInterval(interval);
    }, [isLoading]);

    const loadingMessages = [
        "Searching feedback...",
        "Retrieving relevant insights...",
        "Generating grounded response..."
    ];

    const handleAsk = (e?: React.FormEvent) => {
        e?.preventDefault();
        const trimmed = question.trim();
        if (!trimmed || trimmed.length > 500 || isLoading) return;
        reset();
        setResponse(null);
        mutate(trimmed);
    };

    const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleAsk();
        }
    };

    const handleSuggestionClick = (prompt: string) => {
        if (isLoading) return;
        setQuestion(prompt);
        reset();
        setResponse(null);
        mutate(prompt);
    };

    const isQuestionEmpty = question.trim().length === 0;
    const isQuestionTooLong = question.length > 500;

    return (
        <main className="grow max-w-4xl w-full mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-300">
            
            {/* Header toolbar */}
            <div className="pb-2 border-b border-zinc-200/60 dark:border-zinc-800">
                <h1 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-500 shrink-0" />
                    <span>Ask AI Assistant</span>
                </h1>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-medium">
                    Query grounded insights using workspace context
                </p>
            </div>

            {/* Question Input Panel */}
            <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4">
                <form onSubmit={handleAsk} className="space-y-4">
                    <div className="relative">
                        <textarea
                            ref={textareaRef}
                            rows={3}
                            disabled={isLoading}
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            onKeyDown={handleTextareaKeyDown}
                            placeholder="Ask any question about customer feedback (e.g. What features do users love?)"
                            maxLength={500}
                            className="w-full px-4 py-3 text-xs font-semibold placeholder-zinc-400 dark:placeholder-zinc-650 bg-[#fafaf6]/40 dark:bg-[#0a0a09]/40 border border-zinc-200 dark:border-zinc-800 focus:outline-none resize-none transition-all"
                        />
                        {/* Length counter badge */}
                        <div className={`absolute bottom-2.5 right-3 text-[9px] font-bold ${
                            isQuestionTooLong ? "text-red-500" : "text-zinc-400"
                        }`}>
                            {question.length}/500
                        </div>
                    </div>

                    {/* Suggested questions horizontally just above the Ask button */}
                    {!isLoading && !response && (
                        <div className="flex flex-wrap gap-2 pt-1.5 border-t border-zinc-100 dark:border-zinc-850">
                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block self-center">Suggestions:</span>
                            {SUGGESTED_PROMPTS.map((prompt) => (
                                <button
                                    key={prompt}
                                    type="button"
                                    onClick={() => handleSuggestionClick(prompt)}
                                    className="px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-800 bg-[#fafaf6]/10 dark:bg-[#0a0a09]/10 text-[10px] font-bold text-zinc-600 dark:text-zinc-450 hover:bg-zinc-50 dark:hover:bg-zinc-850 hover:border-zinc-350 dark:hover:border-zinc-700 transition-all cursor-pointer"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-end items-center gap-3">
                        <button
                            type="submit"
                            disabled={isLoading || isQuestionEmpty || isQuestionTooLong}
                            className="inline-flex items-center space-x-1.5 px-4.5 py-2 rounded-lg bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-850 dark:hover:bg-zinc-50 text-xs font-bold shadow-sm transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
                        >
                            {isLoading ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Send className="w-3.5 h-3.5" />
                            )}
                            <span>Ask</span>
                        </button>
                    </div>
                </form>
            </div>

            {/* Loading / AI Thinking state */}
            {isLoading && (
                <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col items-center justify-center py-10 space-y-4 animate-in fade-in duration-300">
                    <div className="relative flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                        <Brain className="w-4 h-4 text-indigo-400 absolute shrink-0" />
                    </div>
                    <div className="text-center space-y-1">
                        <span className="text-[10px] font-bold text-zinc-805 dark:text-zinc-200 block animate-pulse">
                            {loadingMessages[loadingMessageIdx]}
                        </span>
                        <span className="text-[9px] font-semibold text-zinc-400 dark:text-zinc-500 block">
                            Synthesizing context sources...
                        </span>
                    </div>
                </div>
            )}

            {/* Error view */}
            {error && (
                <div className="p-5 border border-red-200/50 dark:border-red-950/20 bg-red-50/50 dark:bg-red-950/10 rounded-xl flex items-start space-x-3.5 text-left animate-in fade-in duration-300">
                    <AlertCircle className="w-4.5 h-4.5 text-red-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                        <h4 className="text-xs font-black text-red-800 dark:text-red-400">Failed to query assistant</h4>
                        <p className="text-[10px] text-red-700 dark:text-red-500 font-medium">
                            {error instanceof Error ? error.message : "An unexpected server-side RAG error occurred."}
                        </p>
                    </div>
                </div>
            )}

            {/* Empty landing state (Only before first query) */}
            {!response && !isLoading && !error && (
                <div className="p-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center space-y-4 bg-white/40 dark:bg-zinc-900/40 shadow-4xs animate-in fade-in duration-300">
                    <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-850 flex items-center justify-center border border-zinc-250/50 dark:border-zinc-800/80 text-zinc-400 mx-auto">
                        <Brain className="w-5.5 h-5.5 text-indigo-500" />
                    </div>
                    <div className="max-w-md mx-auto space-y-1">
                        <h3 className="font-bold text-sm text-zinc-900 dark:text-white">Ask your workspace data</h3>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                            Our grounding model retrieves semantic matches from your feedback inbox to construct verified, source-backed answers to your prompts.
                        </p>
                    </div>
                </div>
            )}

            {/* RAG GROUNDED RESULTS PANEL */}
            {response && !isLoading && (() => {
                const isFallbackResponse = 
                    response.answer.includes("I couldn't find enough evidence") ||
                    response.answer.includes("I couldn't find enough relevant feedback") || 
                    response.citations.length === 0;
                const displayAnswer = isFallbackResponse 
                    ? "I couldn't find enough evidence in the available feedback." 
                    : response.answer;

                return (
                    <div ref={answerRef} className="space-y-8 animate-in fade-in duration-300">
                        
                        {/* Grounded Answer Card */}
                        <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-5">
                            {/* Answer header indicator */}
                            <div className="flex items-center space-x-2.5 pb-4.5 border-b border-zinc-100 dark:border-zinc-850">
                                <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/30 flex items-center justify-center text-indigo-650 dark:text-indigo-400 shrink-0">
                                    <Brain className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-black text-zinc-900 dark:text-white leading-none">AI Assistant Response</h3>
                                    {isFallbackResponse ? (
                                        <div className="inline-flex items-center space-x-1 mt-0.8 text-[8px] font-bold text-zinc-550 dark:text-zinc-500 uppercase tracking-wider">
                                            <span className="w-1 h-1 rounded-full bg-zinc-400" />
                                            <span>Information · No context matches found</span>
                                        </div>
                                    ) : (
                                        <div className="inline-flex items-center space-x-1 mt-0.8 text-[8px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                                            <span className="w-1 h-1 rounded-full bg-emerald-500" />
                                            <span>Grounded Answer · Generated from retrieved feedback</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Text output */}
                            <div className="prose dark:prose-invert max-w-none pt-1">
                                <Markdown content={displayAnswer} />
                            </div>
                        </div>

                        {/* Citations / Sources Evidence list (Only if not a fallback response) */}
                        {!isFallbackResponse && response.citations.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                                    <div>
                                        <h3 className="text-xs font-bold text-zinc-850 dark:text-zinc-205 uppercase tracking-wider">Supporting Evidence</h3>
                                        <p className="text-[10px] text-zinc-450 dark:text-zinc-500 mt-0.5 font-medium">Original customer testimonies matched to context queries</p>
                                    </div>
                                    <span className="px-2 py-0.5 rounded-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-250 dark:border-zinc-800 text-[9px] font-black text-zinc-550 dark:text-zinc-400 uppercase self-start sm:self-center">
                                        {response.citations.length} Citations Retrieved
                                    </span>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {response.citations.map((citation, index) => (
                                        <CitationCard
                                            key={citation.feedbackId}
                                            citation={citation}
                                            index={index}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })()}
        </main>
    );
}
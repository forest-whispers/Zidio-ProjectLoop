import React from "react";
import { FileText, Award, AlertCircle, Sparkles, TrendingUp } from "lucide-react";

export function EmptyState() {
    return (
        <div className="p-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl text-center space-y-6 bg-white/40 dark:bg-zinc-900/40 shadow-4xs max-w-2xl mx-auto animate-in fade-in duration-300">
            <div className="w-12 h-12 rounded-xl bg-zinc-50 dark:bg-zinc-850 flex items-center justify-center border border-zinc-250/50 dark:border-zinc-800/80 text-zinc-400 mx-auto">
                <FileText className="w-5.5 h-5.5 text-indigo-500" />
            </div>

            <div className="space-y-1.5">
                <h3 className="font-black text-sm text-zinc-900 dark:text-white">Generate Executive Summary</h3>
                <p className="text-[11px] text-zinc-550 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                    Select a timeframe and build an executive-ready feedback intelligence summary designed to align stakeholders and back strategic product choices.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-lg mx-auto text-left pt-2">
                <div className="p-3.5 rounded-xl border border-zinc-150 dark:border-zinc-850 bg-white dark:bg-zinc-900 flex items-start space-x-3 shadow-3xs">
                    <Award className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-[10px] font-black text-zinc-850 dark:text-white uppercase tracking-wider">Executive Summary</h4>
                        <p className="text-[9.5px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal font-semibold">High-level insights highlighting the core takeaways and operational summaries.</p>
                    </div>
                </div>

                <div className="p-3.5 rounded-xl border border-zinc-150 dark:border-zinc-850 bg-white dark:bg-zinc-900 flex items-start space-x-3 shadow-3xs">
                    <TrendingUp className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-[10px] font-black text-zinc-850 dark:text-white uppercase tracking-wider">Customer Sentiment</h4>
                        <p className="text-[9.5px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal font-semibold">Quantitative sentiment distributions paired with qualitative client testimonies.</p>
                    </div>
                </div>

                <div className="p-3.5 rounded-xl border border-zinc-150 dark:border-zinc-850 bg-white dark:bg-zinc-900 flex items-start space-x-3 shadow-3xs">
                    <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-[10px] font-black text-zinc-850 dark:text-white uppercase tracking-wider">Major Pain Points</h4>
                        <p className="text-[9.5px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal font-semibold">Ranked classification of core problems reported across channel inputs.</p>
                    </div>
                </div>

                <div className="p-3.5 rounded-xl border border-zinc-150 dark:border-zinc-850 bg-white dark:bg-zinc-900 flex items-start space-x-3 shadow-3xs">
                    <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-[10px] font-black text-zinc-850 dark:text-white uppercase tracking-wider">Recommendations</h4>
                        <p className="text-[9.5px] text-zinc-500 dark:text-zinc-400 mt-0.5 leading-normal font-semibold">AI-backed roadmap priority actions based on customer needs.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
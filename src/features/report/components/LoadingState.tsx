"use client";

import React, { useState, useEffect } from "react";
import { Loader2, FileText, Brain } from "lucide-react";

export function LoadingState() {
    const [loadingMessageIdx, setLoadingMessageIdx] = useState(0);

    const loadingMessages = [
        "Analyzing feedback...",
        "Reviewing customer sentiment...",
        "Preparing executive summary..."
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setLoadingMessageIdx((prev) => (prev + 1) % loadingMessages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [loadingMessages.length]);

    return (
        <div className="p-8 border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-sm max-w-2xl mx-auto space-y-6 animate-in fade-in duration-300">
            {/* Spinning/Brain indicator */}
            <div className="flex flex-col items-center justify-center space-y-3.5 py-4">
                <div className="relative flex items-center justify-center">
                    <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                    <Brain className="w-5 h-5 text-indigo-400 absolute shrink-0" />
                </div>
                <div className="text-center">
                    <span className="text-xs font-black text-zinc-900 dark:text-white block animate-pulse">
                        {loadingMessages[loadingMessageIdx]}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 block mt-0.5">
                        Compiling intelligence report...
                    </span>
                </div>
            </div>

            {/* Skeleton blocks to mock text layout */}
            <div className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-850">
                <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-md w-1/3 animate-pulse" />
                <div className="space-y-2">
                    <div className="h-3 bg-zinc-50 dark:bg-zinc-850 rounded-md w-full animate-pulse" />
                    <div className="h-3 bg-zinc-50 dark:bg-zinc-850 rounded-md w-11/12 animate-pulse" />
                    <div className="h-3 bg-zinc-50 dark:bg-zinc-850 rounded-md w-4/5 animate-pulse" />
                </div>
                
                <div className="h-4 bg-zinc-100 dark:bg-zinc-800 rounded-md w-1/4 pt-2 animate-pulse" />
                <div className="space-y-2">
                    <div className="h-3 bg-zinc-50 dark:bg-zinc-850 rounded-md w-full animate-pulse" />
                    <div className="h-3 bg-zinc-50 dark:bg-zinc-850 rounded-md w-5/6 animate-pulse" />
                </div>
            </div>
        </div>
    );
}
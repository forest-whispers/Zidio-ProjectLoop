import React from "react";
import { MessageSquare } from "lucide-react";

interface SuggestedQuestionCardProps {
    question: string;
    onClick: () => void;
    disabled?: boolean;
}

export function SuggestedQuestionCard({ question, onClick, disabled = false }: SuggestedQuestionCardProps) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-3xs text-left cursor-pointer hover:border-zinc-350 dark:hover:border-zinc-700 hover:shadow-2xs active:scale-[0.99] transition-all flex items-start space-x-3 group disabled:opacity-50 disabled:pointer-events-none"
        >
            <div className="w-6 h-6 rounded-lg bg-zinc-50 dark:bg-zinc-850 border border-zinc-200/50 dark:border-zinc-800 flex items-center justify-center text-zinc-400 group-hover:text-indigo-500 group-hover:bg-indigo-50/20 dark:group-hover:bg-indigo-950/20 dark:group-hover:border-indigo-900/30 shrink-0 transition-colors">
                <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <span className="text-[11px] font-bold text-zinc-750 dark:text-zinc-300 leading-normal group-hover:text-zinc-950 dark:group-hover:text-white transition-colors">
                {question}
            </span>
        </button>
    );
}
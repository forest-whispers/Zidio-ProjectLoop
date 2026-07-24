import { Smile, Meh, Frown } from "lucide-react";

interface SentimentBadgeProps {
    sentiment: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
    className?: string;
}

export function SentimentBadge({ sentiment, className = "" }: SentimentBadgeProps) {
    let styles = "";
    let Icon = Smile;
    let label = "";

    switch (sentiment) {
        case "POSITIVE":
            styles = "bg-emerald-50 text-emerald-700 border-emerald-200/60 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30";
            Icon = Smile;
            label = "Positive";
            break;
        case "NEUTRAL":
            styles = "bg-amber-50 text-amber-700 border-amber-250 dark:bg-amber-955/30 dark:text-amber-400 dark:border-amber-900/30";
            Icon = Meh;
            label = "Neutral";
            break;
        case "NEGATIVE":
            styles = "bg-red-50 text-red-700 border-red-200/60 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30";
            Icon = Frown;
            label = "Negative";
            break;
        default:
            styles = "bg-zinc-50 text-zinc-600 border-zinc-200 dark:bg-zinc-950/30 dark:text-zinc-400 dark:border-zinc-800/30";
            Icon = Meh;
            label = sentiment || "Unknown";
    }

    return (
        <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md border text-[10px] font-bold shadow-xs tracking-tight uppercase ${styles} ${className}`}>
            <Icon className="w-3 h-3 shrink-0" />
            <span>{label}</span>
        </span>
    );
}
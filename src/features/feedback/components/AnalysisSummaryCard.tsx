import { Brain, Tag } from "lucide-react";

interface AnalysisSummaryCardProps {
    summary: string;
    featureArea: string;
    sentimentScore: number;
}

export function formatFeatureArea(area: string): string {
    if (!area) return "";
    if (area === "UI_UX") return "UI/UX";
    return area
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
}

export function AnalysisSummaryCard({ summary, featureArea, sentimentScore }: AnalysisSummaryCardProps) {
    // Format score into percentage (e.g. 0.85 -> +85%, -0.42 -> -42%)
    const formattedScore = sentimentScore >= 0 
        ? `+${Math.round(sentimentScore * 100)}%` 
        : `${Math.round(sentimentScore * 100)}%`;

    const scoreColor = sentimentScore > 0.1 
        ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20" 
        : sentimentScore < -0.1 
        ? "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20" 
        : "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-955/20";

    return (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900 shadow-xs overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-zinc-50/50 dark:bg-zinc-950/20 border-b border-zinc-150 dark:border-zinc-850 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">AI Summary</span>
                </div>
                <div className="flex items-center space-x-1.5">
                    {/* Feature Area Badge */}
                    <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/30 text-[10px] font-bold uppercase">
                        <Tag className="w-2.5 h-2.5 shrink-0" />
                        <span>{formatFeatureArea(featureArea)}</span>
                    </span>
                    {/* Sentiment Score Badge */}
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold font-mono border border-current/10 ${scoreColor}`}>
                        Score: {formattedScore}
                    </span>
                </div>
            </div>

            {/* Body */}
            <div className="p-4">
                <p className="text-xs text-zinc-650 dark:text-zinc-350 leading-relaxed font-medium">
                    {summary}
                </p>
            </div>
        </div>
    );
}
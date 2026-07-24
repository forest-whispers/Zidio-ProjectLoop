interface KeywordBadgeListProps {
    keywords: string[];
}

export function KeywordBadgeList({ keywords }: KeywordBadgeListProps) {
    if (!keywords || keywords.length === 0) {
        return (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 italic mt-0.5">
                No keywords extracted.
            </p>
        );
    }

    return (
        <div className="flex flex-wrap gap-1.5 mt-0.5">
            {keywords.map((kw, index) => (
                <span
                    key={index}
                    className="px-2 py-0.5 rounded-md border border-zinc-200 dark:border-zinc-800 text-[10px] font-semibold text-zinc-650 dark:text-zinc-400 bg-transparent"
                >
                    {kw}
                </span>
            ))}
        </div>
    );
}
import { FeedbackTheme } from "../services/feedback.api";

interface ThemeBadgeListProps {
    themes?: FeedbackTheme[];
}

export function ThemeBadgeList({ themes }: ThemeBadgeListProps) {
    if (!themes || themes.length === 0) {
        return (
            <p className="text-xs text-zinc-400 dark:text-zinc-500 italic mt-0.5">
                No themes associated with this feedback yet.
            </p>
        );
    }

    return (
        <div className="flex flex-wrap gap-1.5 mt-0.5">
            {themes.map((t) => {
                const color = t.theme.color || "#71717a";
                return (
                    <span
                        key={t.themeId}
                        style={{ backgroundColor: `${color}15`, color: color, borderColor: `${color}35` }}
                        className="px-2 py-0.5 rounded-md border text-[10px] font-bold shadow-2xs tracking-tight uppercase"
                    >
                        {t.theme.name}
                    </span>
                );
            })}
        </div>
    );
}
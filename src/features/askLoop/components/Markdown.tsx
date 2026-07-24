import React from "react";

export function Markdown({ content }: { content: string }) {
    if (!content) return null;

    // Split content by paragraphs or headings
    const blocks = content.split("\n\n");

    return (
        <div className="space-y-4 text-xs font-semibold text-zinc-805 dark:text-zinc-250 leading-relaxed">
            {blocks.map((block, idx) => {
                const trimmed = block.trim();
                if (!trimmed) return null;

                // Check for headings
                if (trimmed.startsWith("###")) {
                    return (
                        <h4 key={idx} className="text-xs font-extrabold text-zinc-950 dark:text-white pt-1">
                            {trimmed.replace(/^###\s*/, "")}
                        </h4>
                    );
                }
                if (trimmed.startsWith("##")) {
                    return (
                        <h3 key={idx} className="text-sm font-black text-zinc-950 dark:text-white pt-2">
                            {trimmed.replace(/^##\s*/, "")}
                        </h3>
                    );
                }
                if (trimmed.startsWith("#")) {
                    return (
                        <h2 key={idx} className="text-base font-black text-zinc-950 dark:text-white pt-3">
                            {trimmed.replace(/^#\s*/, "")}
                        </h2>
                    );
                }

                // Check for lists
                if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
                    const items = trimmed.split(/\n[-*]\s+/);
                    return (
                        <ul key={idx} className="list-disc pl-5 space-y-1.5 font-bold">
                            {items.map((item, itemIdx) => {
                                const text = item.replace(/^[-*]\s*/, "").trim();
                                return <li key={itemIdx}>{parseInlineMarkdown(text)}</li>;
                            })}
                        </ul>
                    );
                }

                // Standard paragraph
                return (
                    <p key={idx} className="text-zinc-750 dark:text-zinc-350 leading-relaxed font-semibold">
                        {parseInlineMarkdown(trimmed)}
                    </p>
                );
            })}
        </div>
    );
}

// Simple inline parser for bold/italic/code
function parseInlineMarkdown(text: string) {
    const parts = [];
    let currentText = text;
    let keyIdx = 0;

    while (currentText) {
        const boldIdx = currentText.indexOf("**");
        const codeIdx = currentText.indexOf("`");

        if (boldIdx === -1 && codeIdx === -1) {
            parts.push(<span key={keyIdx++}>{currentText}</span>);
            break;
        }

        // Determine which marker is first
        if (boldIdx !== -1 && (codeIdx === -1 || boldIdx < codeIdx)) {
            // Text before bold
            if (boldIdx > 0) {
                parts.push(<span key={keyIdx++}>{currentText.slice(0, boldIdx)}</span>);
            }
            const rest = currentText.slice(boldIdx + 2);
            const closeBoldIdx = rest.indexOf("**");
            if (closeBoldIdx !== -1) {
                parts.push(
                    <strong key={keyIdx++} className="font-extrabold text-zinc-950 dark:text-white">
                        {rest.slice(0, closeBoldIdx)}
                    </strong>
                );
                currentText = rest.slice(closeBoldIdx + 2);
            } else {
                parts.push(<span key={keyIdx++}>**</span>);
                currentText = rest;
            }
        } else {
            // Text before code
            if (codeIdx > 0) {
                parts.push(<span key={keyIdx++}>{currentText.slice(0, codeIdx)}</span>);
            }
            const rest = currentText.slice(codeIdx + 1);
            const closeCodeIdx = rest.indexOf("`");
            if (closeCodeIdx !== -1) {
                parts.push(
                    <code key={keyIdx++} className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded font-mono text-[10px] text-indigo-650 dark:text-indigo-400 font-bold">
                        {rest.slice(0, closeCodeIdx)}
                    </code>
                );
                currentText = rest.slice(closeCodeIdx + 1);
            } else {
                parts.push(<span key={keyIdx++}>`</span>);
                currentText = rest;
            }
        }
    }

    return parts;
}
import React from "react";

interface MarkdownReportProps {
    content: string;
}

export function MarkdownReport({ content }: MarkdownReportProps) {
    if (!content) return null;

    // Split content by paragraphs or major structural blocks
    const rawLines = content.split("\n");
    const blocks: React.ReactNode[] = [];
    
    let currentTableRows: string[][] = [];
    let isInsideTable = false;

    // Helper to render inline formatting (bold/italic/code)
    const parseInline = (text: string) => {
        const parts: React.ReactNode[] = [];
        let temp = text;
        let keyIdx = 0;

        while (temp) {
            const boldIdx = temp.indexOf("**");
            const italicIdx = temp.indexOf("*");
            const codeIdx = temp.indexOf("`");

            // Find first occurrence
            const indices = [
                { type: "bold" as const, index: boldIdx },
                { type: "italic" as const, index: italicIdx },
                { type: "code" as const, index: codeIdx }
            ].filter(o => o.index !== -1).sort((a, b) => a.index - b.index);

            if (indices.length === 0) {
                parts.push(<span key={keyIdx++}>{temp}</span>);
                break;
            }

            const first = indices[0];

            // Add plain text before match
            if (first.index > 0) {
                parts.push(<span key={keyIdx++}>{temp.slice(0, first.index)}</span>);
            }

            if (first.type === "bold") {
                const rest = temp.slice(first.index + 2);
                const closeIdx = rest.indexOf("**");
                if (closeIdx !== -1) {
                    parts.push(
                        <strong key={keyIdx++} className="font-extrabold text-zinc-950 dark:text-white">
                            {rest.slice(0, closeIdx)}
                        </strong>
                    );
                    temp = rest.slice(closeIdx + 2);
                } else {
                    parts.push(<span key={keyIdx++}>**</span>);
                    temp = rest;
                }
            } else if (first.type === "italic") {
                const rest = temp.slice(first.index + 1);
                const closeIdx = rest.indexOf("*");
                if (closeIdx !== -1) {
                    parts.push(
                        <em key={keyIdx++} className="italic text-zinc-800 dark:text-zinc-300">
                            {rest.slice(0, closeIdx)}
                        </em>
                    );
                    temp = rest.slice(closeIdx + 1);
                } else {
                    parts.push(<span key={keyIdx++}>*</span>);
                    temp = rest;
                }
            } else if (first.type === "code") {
                const rest = temp.slice(first.index + 1);
                const closeIdx = rest.indexOf("`");
                if (closeIdx !== -1) {
                    parts.push(
                        <code key={keyIdx++} className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded font-mono text-[10px] text-indigo-650 dark:text-indigo-400 font-bold">
                            {rest.slice(0, closeIdx)}
                        </code>
                    );
                    temp = rest.slice(closeIdx + 1);
                } else {
                    parts.push(<span key={keyIdx++}>`</span>);
                    temp = rest;
                }
            }
        }

        return parts;
    };

    // Helper to render table blocks
    const flushTable = (key: number) => {
        if (currentTableRows.length === 0) return null;

        const headers = currentTableRows[0];
        const bodyRows = currentTableRows.slice(1);

        const tableNode = (
            <div key={`table-${key}`} className="overflow-x-auto w-full my-5 rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-3xs">
                <table className="w-full text-xs text-left border-collapse bg-white dark:bg-zinc-900">
                    <thead>
                        <tr className="bg-zinc-50/50 dark:bg-zinc-950/20 border-b border-zinc-200 dark:border-zinc-800">
                            {headers.map((h, cIdx) => (
                                <th key={cIdx} className="px-4 py-3 font-bold text-zinc-900 dark:text-white uppercase tracking-wider text-[10px]">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100 dark:divide-zinc-850">
                        {bodyRows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-zinc-50/40 dark:hover:bg-zinc-850/20 transition-colors">
                                {row.map((cell, cIdx) => (
                                    <td key={cIdx} className="px-4 py-3 text-zinc-700 dark:text-zinc-350 font-medium">
                                        {parseInline(cell)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );

        currentTableRows = [];
        return tableNode;
    };

    let blockKey = 0;

    for (let i = 0; i < rawLines.length; i++) {
        const line = rawLines[i];
        const trimmed = line.trim();

        // 1. Table rows parsing
        if (trimmed.startsWith("|")) {
            isInsideTable = true;
            // Split columns and clean empty boundary entries
            const cols = line.split("|").map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
            
            // Skip the standard separator row like |---|---|
            if (cols.every(c => c.startsWith("-"))) {
                continue;
            }
            currentTableRows.push(cols);
            continue;
        } else if (isInsideTable) {
            // Finalize table
            isInsideTable = false;
            const tableNode = flushTable(blockKey++);
            if (tableNode) blocks.push(tableNode);
        }

        if (!trimmed) continue;

        // 2. Headings
        if (trimmed.startsWith("# ")) {
            blocks.push(
                <h3 key={blockKey++} className="text-base font-black text-indigo-650 dark:text-indigo-400 tracking-tight pt-5 pb-1 uppercase border-b border-zinc-100 dark:border-zinc-850">
                    {trimmed.replace(/^#\s+/, "")}
                </h3>
            );
            continue;
        }
        if (trimmed.startsWith("## ")) {
            blocks.push(
                <h4 key={blockKey++} className="text-sm font-black text-zinc-900 dark:text-white pt-4 pb-0.5">
                    {trimmed.replace(/^##\s+/, "")}
                </h4>
            );
            continue;
        }
        if (trimmed.startsWith("### ")) {
            blocks.push(
                <h5 key={blockKey++} className="text-xs font-bold text-zinc-850 dark:text-zinc-200 pt-3">
                    {trimmed.replace(/^###\s+/, "")}
                </h5>
            );
            continue;
        }

        // 3. Blockquotes
        if (trimmed.startsWith(">")) {
            blocks.push(
                <blockquote key={blockKey++} className="border-l-4 border-zinc-200 dark:border-zinc-800 pl-4 py-1 italic text-zinc-550 dark:text-zinc-400 text-xs font-medium my-4 bg-zinc-50/20 dark:bg-zinc-950/10 rounded-r-lg">
                    {parseInline(trimmed.replace(/^>\s*/, ""))}
                </blockquote>
            );
            continue;
        }

        // 4. Horizontal Separators
        if (trimmed === "---" || trimmed === "***") {
            blocks.push(<hr key={blockKey++} className="border-t border-zinc-150 dark:border-zinc-800 my-6" />);
            continue;
        }

        // 5. Unordered List Items
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
            blocks.push(
                <div key={blockKey++} className="flex items-start space-x-2 pl-4 py-0.5 text-xs text-zinc-750 dark:text-zinc-350 font-medium">
                    <span className="text-indigo-500 mt-1 select-none">•</span>
                    <span className="leading-relaxed">{parseInline(trimmed.replace(/^[-*]\s+/, ""))}</span>
                </div>
            );
            continue;
        }

        // 6. Ordered List Items
        const numListRegex = /^(\d+)\.\s+/;
        if (numListRegex.test(trimmed)) {
            const match = trimmed.match(numListRegex);
            const num = match ? match[1] : "1";
            blocks.push(
                <div key={blockKey++} className="flex items-start space-x-2 pl-4 py-0.5 text-xs text-zinc-750 dark:text-zinc-350 font-medium">
                    <span className="text-indigo-500 font-bold font-mono text-[10px] mt-0.5 select-none">{num}.</span>
                    <span className="leading-relaxed">{parseInline(trimmed.replace(numListRegex, ""))}</span>
                </div>
            );
            continue;
        }

        // 7. General paragraphs
        blocks.push(
            <p key={blockKey++} className="text-xs text-zinc-750 dark:text-zinc-350 leading-relaxed font-semibold">
                {parseInline(trimmed)}
            </p>
        );
    }

    // Flush any trailing table
    if (isInsideTable) {
        const tableNode = flushTable(blockKey++);
        if (tableNode) blocks.push(tableNode);
    }

    return (
        <div className="space-y-4 font-semibold text-zinc-800 dark:text-zinc-200">
            {blocks}
        </div>
    );
}
"use client";

import React from "react";
import { MessageSquare, BarChart3, Sparkles, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

interface WorkspaceActionsProps {
    role: "ADMIN" | "ANALYST" | "VIEWER";
}

export function WorkspaceActions({ role }: WorkspaceActionsProps) {
    const isViewer = role === "VIEWER";

    const actions = [
        {
            title: "Feedback Inbox",
            description: isViewer
                ? "Review customer feedback logs and monitor workflow statuses."
                : "Manage feedback submissions, import CSV sheets, or load demo datasets.",
            href: "/dashboard/feedback",
            icon: MessageSquare,
            color: "text-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-100 dark:border-indigo-900/30",
        },
        {
            title: "Analytics Dashboard",
            description: "View feedback volume trends, sentiment distributions, and trending themes.",
            href: "/dashboard/analytics",
            icon: BarChart3,
            color: "text-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/30",
        },
        {
            title: "Ask AI Assistant",
            description: "Query grounded insights using natural language workspace context.",
            href: "/dashboard/ask",
            icon: Sparkles,
            color: "text-purple-500 bg-purple-50/50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/30",
        },
        {
            title: "Executive Reports",
            description: isViewer
                ? "Read and export previously compiled executive product summaries."
                : "Generate and customize executive-ready product briefs and download PDFs.",
            href: "/dashboard/report",
            icon: FileText,
            color: "text-amber-500 bg-amber-50/50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/30",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {actions.map((act) => {
                const Icon = act.icon;
                return (
                    <Link
                        key={act.title}
                        href={act.href}
                        className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-3xs hover:border-zinc-350 dark:hover:border-zinc-700 hover:shadow-2xs active:scale-[0.99] transition-all flex flex-col justify-between group outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:border-indigo-500 text-left min-h-28"
                    >
                        <div className="space-y-2">
                            {/* Icon Header */}
                            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${act.color}`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            
                            {/* Text */}
                            <div className="space-y-0.8">
                                <h3 className="text-xs font-black text-zinc-900 dark:text-white tracking-tight flex items-center gap-1">
                                    <span>{act.title}</span>
                                </h3>
                                <p className="text-[10px] text-zinc-500 dark:text-zinc-450 leading-relaxed font-semibold">
                                    {act.description}
                                </p>
                            </div>
                        </div>

                        {/* Hover arrow trigger */}
                        <div className="flex items-center justify-end pt-2 text-zinc-400 group-hover:text-indigo-500 transition-colors">
                            <ArrowRight className="w-3.5 h-3.5 translate-x-0 group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                );
            })}
        </div>
    );
}
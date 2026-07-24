import React from "react";

export function DashboardSkeletons() {
    return (
        <div className="space-y-8 animate-pulse">
            {/* Header Skeleton */}
            <div className="space-y-2">
                <div className="h-7 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/3" />
                <div className="h-4 bg-zinc-150 dark:bg-zinc-850 rounded-md w-1/4" />
            </div>

            {/* Metrics Overview Grid Skeleton */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                        <div className="w-5 h-5 rounded bg-zinc-100 dark:bg-zinc-800" />
                        <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
                        <div className="h-3 bg-zinc-150 dark:bg-zinc-850 rounded w-3/4" />
                    </div>
                ))}
            </div>

            {/* Split layout: Actions + Members Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Actions Skeleton */}
                <div className="md:col-span-2 space-y-3">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/4" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 h-28 space-y-2" />
                        ))}
                    </div>
                </div>

                {/* Members Skeleton */}
                <div className="space-y-3">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
                    <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="flex items-center space-x-3">
                                <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 shrink-0" />
                                <div className="space-y-1.5 grow">
                                    <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-2/3" />
                                    <div className="h-2.5 bg-zinc-150 dark:bg-zinc-850 rounded w-1/2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Split layout: Recent Feedback + Recent Analysis Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Recent Feedback Skeleton */}
                <div className="space-y-3">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
                    <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="space-y-2 pb-3 border-b border-zinc-100 dark:border-zinc-850/60 last:border-none last:pb-0">
                                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                                <div className="flex items-center justify-between">
                                    <div className="h-4 bg-zinc-150 dark:bg-zinc-850 rounded w-16" />
                                    <div className="h-2 bg-zinc-100 dark:bg-zinc-900 rounded w-12" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Analysis Skeleton */}
                <div className="space-y-3">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
                    <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="space-y-2.5 pb-3 border-b border-zinc-100 dark:border-zinc-850/60 last:border-none last:pb-0">
                                <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded w-5/6" />
                                <div className="flex items-center gap-1.5">
                                    <div className="h-4 bg-zinc-150 dark:bg-zinc-850 rounded w-12" />
                                    <div className="h-4 bg-zinc-150 dark:bg-zinc-850 rounded w-16" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
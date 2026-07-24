"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface DistributionItem {
    label: string;
    value: number;
    percentage: number;
}

interface DonutChartWrapperProps {
    data: DistributionItem[];
    height?: number;
    variant?: "sentiment" | "status" | "channel" | "default";
}

// Color schemes
const SENTIMENT_COLORS: Record<string, string> = {
    POSITIVE: "#10b981", // Emerald-500
    NEUTRAL: "#f59e0b",  // Amber-500
    NEGATIVE: "#ef4444", // Red-500
};

const STATUS_COLORS: Record<string, string> = {
    SUBMITTED: "#3b82f6",    // Blue-500
    UNDER_REVIEW: "#f59e0b", // Amber-500
    IN_PROGRESS: "#6366f1",  // Indigo-500
    RESOLVED: "#10b981",     // Emerald-500
    CLOSED: "#71717a",       // Zinc-500
};

const GENERAL_COLORS = [
    "#6366f1", // Indigo
    "#3b82f6", // Blue
    "#10b981", // Emerald
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#f59e0b", // Amber
    "#06b6d4", // Cyan
    "#f97316", // Orange
];

export function DonutChartWrapper({ data, height = 240, variant = "default" }: DonutChartWrapperProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div 
                style={{ height }} 
                className="w-full bg-zinc-50/50 dark:bg-zinc-900/50 animate-pulse rounded-xl border border-zinc-200/50 dark:border-zinc-800/50" 
            />
        );
    }

    if (!data || data.length === 0 || data.every(d => d.value === 0)) {
        return (
            <div 
                style={{ height }} 
                className="w-full flex items-center justify-center text-xs text-zinc-400 dark:text-zinc-500 font-semibold border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl"
            >
                No feedback data available for this period.
            </div>
        );
    }

    // Function to get color based on variant
    const getColor = (item: DistributionItem, index: number) => {
        const key = item.label.toUpperCase().replace(/\s+/g, "_");
        if (variant === "sentiment") {
            return SENTIMENT_COLORS[key] || "#71717a";
        }
        if (variant === "status") {
            return STATUS_COLORS[key] || "#71717a";
        }
        return GENERAL_COLORS[index % GENERAL_COLORS.length];
    };

    const total = data.reduce((acc, curr) => acc + curr.value, 0);

    return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            {/* Chart */}
            <div style={{ height, width: height }} className="relative shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Tooltip
                            contentStyle={{
                                backgroundColor: "rgba(255, 255, 255, 0.95)",
                                borderRadius: "12px",
                                border: "1px solid #e4e4e7",
                                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05)",
                                fontSize: "11px",
                                fontWeight: "bold",
                                color: "#18181b",
                            }}
                            formatter={(value: any, name: any) => [`${value} items`, name]}
                        />
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={55}
                            outerRadius={75}
                            paddingAngle={3}
                            dataKey="value"
                            nameKey="label"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getColor(entry, index)} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Central Metric */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-bold uppercase tracking-wider">Total</span>
                    <span className="text-xl font-black text-zinc-900 dark:text-white leading-none mt-1">{total}</span>
                </div>
            </div>

            {/* Legend list */}
            <div className="grow space-y-2 w-full">
                {data.map((item, index) => {
                    const color = getColor(item, index);
                    return (
                        <div key={item.label} className="flex items-center justify-between text-[11px] font-semibold">
                            <div className="flex items-center space-x-2 truncate">
                                <span 
                                    className="w-2.5 h-2.5 rounded-full shrink-0" 
                                    style={{ backgroundColor: color }} 
                                />
                                <span className="text-zinc-700 dark:text-zinc-300 truncate">{item.label}</span>
                            </div>
                            <div className="flex items-center space-x-1.5 shrink-0 pl-2">
                                <span className="text-zinc-400 dark:text-zinc-500">({item.value})</span>
                                <span className="text-zinc-900 dark:text-white font-bold">{item.percentage}%</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
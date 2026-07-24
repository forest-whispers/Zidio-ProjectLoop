"use client";

import React, { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Cell,
    ResponsiveContainer,
} from "recharts";

interface ThemeDistributionItem {
    id: string;
    name: string;
    color: string;
    count: number;
    percentage: number;
}

interface HorizontalBarChartWrapperProps {
    data: ThemeDistributionItem[];
    height?: number;
}

export function HorizontalBarChartWrapper({ data, height = 280 }: HorizontalBarChartWrapperProps) {
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

    if (!data || data.length === 0 || data.every(d => d.count === 0)) {
        return (
            <div 
                style={{ height }} 
                className="w-full flex items-center justify-center text-xs text-zinc-400 dark:text-zinc-500 font-semibold border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl"
            >
                No theme distribution data available for this period.
            </div>
        );
    }

    // Sort themes by count descending to make the chart look structured
    const sortedData = [...data].sort((a, b) => b.count - a.count).slice(0, 8); // Top 8 themes

    return (
        <div style={{ height, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={sortedData}
                    layout="vertical"
                    margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
                >
                    <XAxis type="number" hide />
                    <YAxis
                        dataKey="name"
                        type="category"
                        stroke="#888888"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        width={90}
                    />
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
                        formatter={(value: any) => [`${value} items`, "Volume"]}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} barSize={12}>
                        {sortedData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color || "#6366f1"} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
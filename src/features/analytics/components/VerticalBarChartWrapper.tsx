"use client";

import React, { useState, useEffect } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { formatFeatureArea } from "@/features/feedback/components/AnalysisSummaryCard";

interface DistributionItem {
    label: string;
    value: number;
    percentage: number;
}

interface VerticalBarChartWrapperProps {
    data: DistributionItem[];
    height?: number;
}

export function VerticalBarChartWrapper({ data, height = 280 }: VerticalBarChartWrapperProps) {
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
                No classification area data available for this period.
            </div>
        );
    }

    // Format labels for Recharts display
    const formattedData = data.map(item => ({
        ...item,
        formattedLabel: formatFeatureArea(item.label) || item.label,
    })).sort((a, b) => b.value - a.value).slice(0, 8); // Top 8 feature areas

    return (
        <div style={{ height, width: "100%" }}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={formattedData}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800" />
                    <XAxis
                        dataKey="formattedLabel"
                        stroke="#888888"
                        fontSize={9}
                        tickLine={false}
                        axisLine={false}
                        dy={8}
                    />
                    <YAxis
                        stroke="#888888"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        dx={-5}
                        allowDecimals={false}
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
                    <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
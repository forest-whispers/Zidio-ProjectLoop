"use client";

import React, { useState, useEffect } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

interface LineChartWrapperProps {
    data: Array<{ date: string; count: number }>;
    height?: number;
}

export function LineChartWrapper({ data, height = 250 }: LineChartWrapperProps) {
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

    if (!data || data.length === 0) {
        return (
            <div 
                style={{ height }} 
                className="w-full flex items-center justify-center text-xs text-zinc-400 dark:text-zinc-500 font-semibold border border-zinc-200/50 dark:border-zinc-800/50 rounded-xl"
            >
                No feedback volume trend data available for this period.
            </div>
        );
    }

    return (
        <div style={{ height, width: "100%" }} className="relative">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" className="dark:stroke-zinc-800" />
                    <XAxis
                        dataKey="date"
                        stroke="#888888"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
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
                        labelStyle={{ color: "#71717a", marginBottom: "4px" }}
                        cursor={{ stroke: "#6366f1", strokeWidth: 1, strokeDasharray: "4 4" }}
                    />
                    <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#6366f1"
                        strokeWidth={2.5}
                        dot={{ r: 3, stroke: "#6366f1", strokeWidth: 1, fill: "#fff" }}
                        activeDot={{ r: 5, stroke: "#6366f1", strokeWidth: 2, fill: "#6366f1" }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { EntryData } from "@/services/db";

interface ActivityHeatmapProps {
    entries: EntryData[];
    color?: string; // Tailwind class, e.g., "bg-orange-500"
    showLegend?: boolean;
}

export default function ActivityHeatmap({
    entries,
    color = "bg-green-500",
    showLegend = false,
}: ActivityHeatmapProps) {
    // Generate dates for the last 365 days
    const weeks = useMemo(() => {
        const result = [];
        const today = new Date();
        // Align to previous Sunday/Monday to ensure nice grid?
        // Let's just go back 52 weeks * 7 days.
        const totalDays = 52 * 7;
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - totalDays + 1); // +1 to include today as last

        // We want an array of columns (Weeks).
        // Each column has 7 days (Sun-Sat or Mon-Sun).
        // Let's generate a flat list of days first, then group by week.

        // Actually, GitHub graph is columns of weeks (Mon -> Sun top to bottom).
        // Let's adjust startDate to be a Monday (or whatever start of week).
        // If today is Wednesday, we want the grid to end on Wednesday (or end of this week).
        // Let's keep it simple: List of days, CSS Grid will handle layout.
        // We will display as: grid-flow-col (columns first), 7 rows.

        const days = [];
        for (let i = 0; i < totalDays; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            const dateStr = d.toISOString().split("T")[0]; // YYYY-MM-DD
            days.push({
                date: dateStr,
                dateObj: d,
            });
        }
        return days;
    }, []);

    // Create a generic "count" map for fast lookup
    const entryMap = useMemo(() => {
        const map = new Map<string, number>();
        entries.forEach((e) => {
            // Only count if value is truthy (true, or non-zero number)
            if (e.value) {
                const current = map.get(e.date) || 0;
                map.set(e.date, current + 1);
            }
        });
        return map;
    }, [entries]);

    const getColor = (count: number) => {
        if (count === 0) return "bg-gray-100";
        if (color.startsWith("bg-")) {
            // If it's a specific brand color (e.g., bg-orange-500), we might just use opacity or shade?
            // For simple boolean/individual habit:
            return color;
        }
        // Fallback or Global Logic (Green scale)
        if (count >= 4) return "bg-green-700";
        if (count >= 3) return "bg-green-500";
        if (count >= 2) return "bg-green-400";
        return "bg-green-300";
    };

    // For single habit (passed specific color), we assume boolean-ish (0 or 1+).
    // If showLegend is true, we might use the graded scale.

    return (
        <div className="w-full overflow-x-auto pb-2">
            {/* 
                Grid Layout:
                - grid-rows-7: 7 days vertical
                - grid-flow-col: Fill columns first (weeks)
                - gap-1: Spacing
             */}
            <div className="grid grid-rows-7 grid-flow-col gap-[2px] w-max">
                {weeks.map((day) => {
                    const count = entryMap.get(day.date) || 0;
                    const intensityClass = showLegend
                        ? (count === 0 ? "bg-gray-100" : (count > 3 ? "bg-green-800" : (count > 1 ? "bg-green-500" : "bg-green-300")))
                        : (count > 0 ? color : "bg-gray-100");

                    return (
                        <div
                            key={day.date}
                            className={clsx(
                                "h-[10px] w-[10px] rounded-[2px] transition-all",
                                intensityClass
                            )}
                            title={`${day.date}: ${count} completed`}
                        />
                    );
                })}
            </div>
            {showLegend && (
                <div className="mt-2 flex items-center justify-end gap-1 text-xs text-gray-400">
                    <span>Less</span>
                    <div className="h-3 w-3 rounded-sm bg-gray-100" />
                    <div className="h-3 w-3 rounded-sm bg-green-300" />
                    <div className="h-3 w-3 rounded-sm bg-green-500" />
                    <div className="h-3 w-3 rounded-sm bg-green-800" />
                    <span>More</span>
                </div>
            )}
        </div>
    );
}

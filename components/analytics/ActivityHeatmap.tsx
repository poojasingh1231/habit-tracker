"use client";

import React, { useMemo, useRef, useEffect } from "react";
import clsx from "clsx";
import { EntryData } from "@/services/db";
import { TAILWIND_COLORS_MAP } from "@/lib/constants";

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

    // Generic count map

    // For single habit (passed specific color), we assume boolean-ish (0 or 1+).
    // If showLegend is true, we might use the graded scale.

    // Ref for the scroll container
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to the end (Today) on mount
    useEffect(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollContainerRef.current.scrollWidth;
        }
    }, [entries]); // Re-scroll if entries update (or just on mount)

    return (
        <div
            ref={scrollContainerRef}
            className="w-full overflow-x-auto pb-2"
        >
            {/*
                Grid Layout:
                - grid-rows-7: 7 days vertical
                - grid-flow-col: Fill columns first (weeks)
                - gap-1: Spacing
             */}
            <div className="grid grid-rows-7 grid-flow-col gap-[2px] w-max">
                {weeks.map((day) => {
                    // Check if there is an entry for this day
                    const match = entries.find(e => e.date === day.date && e.value);
                    const count = match ? 1 : 0;

                    // Style: Active days get Red, Inactive get Gray
                    const bgStyle = count > 0 ? { backgroundColor: '#ef4444' } : { backgroundColor: '#f3f4f6' };

                    return (
                        <div
                            key={day.date}
                            className="h-[10px] w-[10px] rounded-[2px] transition-all"
                            style={bgStyle}
                            title={`${day.date}: ${match ? 'Completed' : 'No Activity'}`}
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

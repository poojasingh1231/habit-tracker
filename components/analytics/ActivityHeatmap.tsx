"use client";

import { useMemo, useRef, useEffect } from "react";
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
    const containerRef = useRef<HTMLDivElement>(null);

    // Scroll to the end (today) on mount
    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollLeft = containerRef.current.scrollWidth;
        }
    }, [entries]); // Re-run if entries change, though mostly just mount is enough

    // Generate dates for the last 365 days
    const { days, weeksOfMonth } = useMemo(() => {
        const resultDays = [];
        const today = new Date();
        const totalWeeks = 52;
        const totalDays = totalWeeks * 7;
        const startDate = new Date(today);
        startDate.setDate(today.getDate() - totalDays + 1);

        const resultWeeks = [];

        for (let i = 0; i < totalDays; i++) {
            const d = new Date(startDate);
            d.setDate(startDate.getDate() + i);
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const dayStr = String(d.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${dayStr}`;

            resultDays.push({
                date: dateStr,
                dateObj: d,
            });
        }

        // Calculate month labels for each week column
        for (let i = 0; i < totalWeeks; i++) {
            const weekStart = resultDays[i * 7].dateObj;
            // Check if this week contains the 1st of the month
            let monthLabel = "";
            for (let j = 0; j < 7; j++) {
                const day = resultDays[i * 7 + j];
                if (day.dateObj.getDate() === 1) {
                    monthLabel = day.dateObj.toLocaleString('default', { month: 'short' });
                    break;
                }
            }
            // If the very first week, show label regardless? Or maybe just if it changes.
            // Let's stick to "contains 1st".
            // Edge case: first column might be mid-month.
            if (i === 0 && !monthLabel) {
                monthLabel = resultDays[0].dateObj.toLocaleString('default', { month: 'short' });
            }

            resultWeeks.push({
                label: monthLabel,
                index: i
            });
        }

        return { days: resultDays, weeksOfMonth: resultWeeks };
    }, []);

    // Create a generic "count" map for fast lookup
    const entryMap = useMemo(() => {
        const map = new Map<string, number>();
        entries.forEach((e) => {
            if (e.value) {
                const current = map.get(e.date) || 0;
                map.set(e.date, current + 1);
            }
        });
        return map;
    }, [entries]);

    return (
        <div ref={containerRef} className="w-full overflow-x-auto pb-2">
            {/* Header for Months */}
            <div className="flex gap-[2px] mb-1 w-max">
                {weeksOfMonth.map((week, idx) => (
                    <div
                        key={idx}
                        className="w-[10px] text-[10px] text-gray-400 text-center flex h-3 items-end justify-center overflow-visible whitespace-nowrap"
                    >
                        {week.label}
                    </div>
                ))}
            </div>

            {/* 
                Grid Layout:
                - grid-rows-7: 7 days vertical
                - grid-flow-col: Fill columns first (weeks)
                - gap-1: Spacing
             */}
            <div className="grid grid-rows-7 grid-flow-col gap-[2px] w-max">
                {days.map((day) => {
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

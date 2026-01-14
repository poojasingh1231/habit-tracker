"use client";

import { useAuth } from "@/context/AuthContext";
import { useEffect, useState, useMemo } from "react";
import {
    subscribeToResolutions,
    subscribeToEntries,
    ResolutionData,
    EntryData
} from "@/services/db";
import { MoveUpRight, Calendar, Trophy, Flame } from "lucide-react";
import { getLast7Days, getCurrentWeekDays } from "@/lib/utils";
import clsx from "clsx";
import ActivityHeatmap from "@/components/analytics/ActivityHeatmap";

export default function AnalyticsPage() {
    const { user, loading } = useAuth();
    const [resolutions, setResolutions] = useState<ResolutionData[]>([]);
    const [entries, setEntries] = useState<EntryData[]>([]);

    useEffect(() => {
        if (!user) return;
        const unsubRes = subscribeToResolutions(user.uid, setResolutions);
        const unsubEntries = subscribeToEntries(user.uid, setEntries);
        return () => { unsubRes(); unsubEntries(); };
    }, [user]);

    // --- Statistics Calculations ---

    const totalEntries = entries.length;

    // Weekly Progress Data (Current Week)
    const weeklyData = useMemo(() => {
        const days = getCurrentWeekDays(); // returns { dateStr, dayName } Mon-Sun

        return days.map(day => {
            // Count completions for this day
            const count = entries.filter(e => e.date === day.dateStr && !!e.value).length;
            return { day: day.dayName, count, date: day.dateStr };
        });
        // Wait, loop 6 to 0 means Today - 6 (oldest) to Today - 0 (newest) if we push?
        // Let's check getLast7Days impl. It pushes i=6 first (oldest). So order is Old -> New.
        // So no reverse needed.
    }, [entries]);

    // Completion Rate (All Time)
    const completionRate = useMemo(() => {
        if (entries.length === 0) return 0;
        // This is a rough estimate: (Total Entries / (Days * Resolutions))
        // For MVP, just specific "Success Rate" based on tracked days?
        // Let's stick to "Total Completions" for now to be safe.
        // Or "Average Daily Completions"
        return totalEntries;
    }, [entries]);

    const maxDailyCompletions = useMemo(() => {
        return Math.max(...weeklyData.map(d => d.count), resolutions.length || 1);
    }, [weeklyData, resolutions.length]);


    if (loading || !user) return null;

    return (
        <div className="min-h-screen space-y-8 p-6 pb-24 lg:p-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
                <p className="text-gray-500">Track your progress and consistency.</p>
            </div>

            {/* Weekly Chart */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">This Week</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar size={16} />
                        <span>Weekly Overview</span>
                    </div>
                </div>

                <div className="flex h-48 items-end justify-between gap-2">
                    {weeklyData.map((d) => {
                        const heightPercent = maxDailyCompletions > 0
                            ? (d.count / maxDailyCompletions) * 100
                            : 0;

                        return (
                            <div key={d.day} className="flex h-full flex-1 flex-col items-center gap-2">
                                <div className="group relative w-full flex-1 rounded-xl bg-gray-50">
                                    <div
                                        className="absolute bottom-0 w-full rounded-xl bg-black transition-all duration-500"
                                        style={{ height: `${heightPercent}%` }}
                                    />
                                    {/* Tooltip */}
                                    <div className="absolute -top-10 left-1/2 hidden -translate-x-1/2 transform rounded-lg bg-gray-900 px-2 py-1 text-xs text-white group-hover:block">
                                        {d.count}
                                    </div>
                                </div>
                                <span className="text-xs font-medium text-gray-400">{d.day}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Yearly Activity */}
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-6">
                    <h3 className="font-semibold text-gray-900">Yearly Activity</h3>
                    <p className="text-sm text-gray-400">Your global consistency across all habits.</p>
                </div>
                <div className="flex justify-center">
                    {/* Pass all entries to show combined heat map */}
                    <ActivityHeatmap entries={entries} showLegend={true} />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                        <Trophy size={20} />
                    </div>
                    <p className="text-sm font-medium text-gray-400">Total Completions</p>
                    <p className="mt-1 text-2xl font-bold">{totalEntries}</p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                        <Flame size={20} />
                    </div>
                    <p className="text-sm font-medium text-gray-400">Active Habits</p>
                    <p className="mt-1 text-2xl font-bold">{resolutions.length}</p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-500">
                        <MoveUpRight size={20} />
                    </div>
                    <p className="text-sm font-medium text-gray-400">Longest Streak</p>
                    <p className="mt-1 text-base font-semibold text-gray-900">Coming Soon</p>
                </div>
            </div>
        </div>
    );
}

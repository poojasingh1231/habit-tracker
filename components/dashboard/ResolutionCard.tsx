"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Check, ChevronDown, Activity, Calendar, Pencil } from "lucide-react";
import clsx from "clsx";
import { ResolutionData, EntryData, logProgress, deleteResolution } from "@/services/db";
import { useAuth } from "@/context/AuthContext";
import { getTodayDateString, formatDateString } from "@/lib/utils";
import AddResolutionModal from "../resolutions/AddResolutionModal";
import ActivityHeatmap from "@/components/analytics/ActivityHeatmap";

interface ResolutionCardProps {
    resolution: ResolutionData;
    entries: EntryData[]; // All entries for this resolution (or let component filter?)
}

export default function ResolutionCard({
    resolution,
    entries,
}: ResolutionCardProps) {
    const { user } = useAuth();
    const [expanded, setExpanded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Filter entries for this resolution
    const myEntries = useMemo(
        () => entries.filter((e) => e.resolutionId === resolution.id),
        [entries, resolution.id]
    );



    // ...

    // Statistics
    const stats = useMemo(() => {
        const completedEntries = myEntries.filter(e => !!e.value);
        const total = completedEntries.length;

        // Streak Calculation
        const completedDates = new Set(completedEntries.map(e => e.date));
        let streak = 0;
        const d = new Date();

        // Check today first
        let checkDateStr = formatDateString(d);
        if (completedDates.has(checkDateStr)) {
            streak++;
        } else {
            // Check yesterday if today is not done
            d.setDate(d.getDate() - 1);
            checkDateStr = formatDateString(d);
            if (completedDates.has(checkDateStr)) {
                streak++;
            } else {
                return { total, streak: 0 }; // No streak
            }
        }

        // Count backwards
        while (true) {
            d.setDate(d.getDate() - 1);
            checkDateStr = formatDateString(d);
            if (completedDates.has(checkDateStr)) {
                streak++;
            } else {
                break;
            }
        }

        return { total, streak };
    }, [myEntries]);

    // Check if completed today using local date
    const todayStr = getTodayDateString();
    const todayEntry = myEntries.find((e) => e.date === todayStr);
    const isCompletedToday = !!todayEntry && !!todayEntry.value;

    // Weekly Strip Logic
    const weekDays = useMemo(() => {
        const days = [];
        const today = new Date();
        // Get start of week (Monday)
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(today);
        monday.setDate(diff);

        for (let i = 0; i < 7; i++) {
            const d = new Date(monday);
            d.setDate(monday.getDate() + i);
            days.push(formatDateString(d));
        }
        return days;
    }, []);

    const handleToggleComplete = async () => {
        if (!user || loading) return;
        setLoading(true);

        try {
            // Toggle logic: If completed, maybe we can't un-complete easily without delete?
            // Phase 2 Spec: "logProgress(resId, value)".
            // If type is boolean, value is true/false.
            // If already completed, let's toggle to false (remove entry effectively or set value false).
            let newVal: boolean | number = !isCompletedToday;

            if (newVal === true && (resolution.type === 'numeric' || resolution.type === 'duration') && resolution.target) {
                newVal = resolution.target;
            }

            // Use today's date
            await logProgress(user.uid, {
                resolutionId: resolution.id!,
                date: todayStr,
                value: newVal,
            });
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            // @ts-ignore
            layout
            className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
        >
            <div
                className="cursor-pointer p-5"
                onClick={() => setExpanded(!expanded)}
            >
                <div className="flex items-start justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">{resolution.title}</h3>
                        <div className="mt-1 flex items-center gap-2 text-xs font-medium text-gray-400">
                            <span className={clsx("capitalize", resolution.color.replace('bg-', 'text-'))}>{resolution.type}</span>
                            {resolution.target && (
                                <>
                                    <span>•</span>
                                    <span>Goal: {resolution.target} {resolution.unit}</span>
                                </>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleToggleComplete();
                        }}
                        disabled={loading}
                        className={clsx(
                            "flex h-10 w-10 items-center justify-center rounded-full border transition-all active:scale-95",
                            isCompletedToday
                                ? `bg-black border-black text-white`
                                : "border-gray-200 text-gray-300 hover:border-gray-400"
                        )}
                    >
                        {isCompletedToday ? <Check size={20} /> : <div className="h-4 w-4 rounded-full bg-gray-100" />}
                    </button>
                </div>

                {/* Weekly Strip */}
                <div className="mt-6 flex justify-between gap-2">
                    {weekDays.map((date) => {
                        const entry = myEntries.find((e) => e.date === date);
                        const isDone = !!entry && !!entry.value;
                        const isToday = date === todayStr;
                        const dateObj = new Date(date);
                        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'narrow' }); // M, T, W...

                        return (
                            <div key={date} className="flex flex-col items-center gap-2">
                                <div
                                    className={clsx(
                                        "h-2 w-8 rounded-full transition-colors duration-300",
                                        isDone ? resolution.color : "bg-gray-100",
                                        isToday && !isDone && "ring-1 ring-black ring-offset-2" // Highlight today
                                    )}
                                />
                                <span className="text-[10px] uppercase text-gray-400">{dayName}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        // @ts-ignore
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-50 bg-gray-50/50 px-5 pb-5 pt-2"
                    >
                        <div className="mt-4 space-y-3">
                            {/* Insights Section */}
                            <div>
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">Insights</label>
                                <div className="mt-2 grid grid-cols-2 gap-3">
                                    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                                        <div className="text-xs font-medium text-gray-500">Daily Streak</div>
                                        <div className="mt-1 flex items-baseline gap-1">
                                            <span className="text-2xl font-bold text-gray-900">{stats.streak}</span>
                                            <span className="text-xs text-gray-400">days</span>
                                        </div>
                                    </div>
                                    <div className="rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
                                        <div className="text-xs font-medium text-gray-500">Total Completions</div>
                                        <div className="mt-1 flex items-baseline gap-1">
                                            <span className="text-2xl font-bold text-gray-900">{stats.total}</span>
                                            <span className="text-xs text-gray-400">times</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* History/Stats */}
                            <div>
                                <label className="text-xs font-medium text-gray-400 uppercase tracking-widest">Yearly Activity</label>
                                <div className="mt-2 rounded-xl border border-dashed border-gray-200 bg-white p-3">
                                    <div className="flex justify-center">
                                        <ActivityHeatmap entries={myEntries} color={resolution.color} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-4">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditing(true);
                                }}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                <Pencil size={14} />
                                Edit
                            </button>

                            {/* Delete Button with Inline Confirmation */}
                            {showDeleteConfirm ? (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowDeleteConfirm(false);
                                        }}
                                        className="rounded-lg px-3 py-2 text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            if (user && resolution.id) {
                                                await deleteResolution(user.uid, resolution.id);
                                            }
                                        }}
                                        className="flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                        Confirm
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowDeleteConfirm(true);
                                    }}
                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 size={14} />
                                    Delete
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AddResolutionModal
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                initialData={resolution}
            />
        </motion.div>
    );
}

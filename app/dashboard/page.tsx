
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { Plus } from "lucide-react";
import confetti from "canvas-confetti";
import { NotificationService } from "@/services/notifications";
import AddResolutionModal from "@/components/resolutions/AddResolutionModal";
import ProgressRing from "@/components/dashboard/ProgressRing";
import ResolutionCard from "@/components/dashboard/ResolutionCard";
import {
    subscribeToResolutions,
    subscribeToEntries,
    ResolutionData,
    EntryData
} from "@/services/db";
import { getTodayDateString } from "@/lib/utils";

export default function Dashboard() {
    const { user, loading } = useAuth();
    const router = useRouter();

    // State
    const [resolutions, setResolutions] = useState<ResolutionData[]>([]);
    const [entries, setEntries] = useState<EntryData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Auth check handled by ClientLayout

    // Subscriptions
    useEffect(() => {
        if (!user) return;

        // Subscribe to resolutions
        const unsubRes = subscribeToResolutions(user.uid, (data) => {
            setResolutions(data);
        });

        // Subscribe to entries
        const unsubEntries = subscribeToEntries(user.uid, (data) => {
            setEntries(data);
        });

        return () => {
            unsubRes();
            unsubEntries();
        };
    }, [user]);

    // Derived State: Daily Progress
    const progressPercentage = useMemo(() => {
        if (resolutions.length === 0) return 0;

        const todayStr = getTodayDateString();
        const todaysEntries = entries.filter((e) => e.date === todayStr && !!e.value);

        // Simple count relation for now. 
        // Later we can handle numeric targets (e.g. 1500/2000 ml).
        // For now, if entry.value is truthy (or numeric > 0? No, let's keep it simple: existence = done or boolean true)
        // Actually, for numeric, we might want to check if value >= target?
        // Let's improve Logic:

        let completedCount = 0;

        resolutions.forEach(res => {
            const entry = todaysEntries.find(e => e.resolutionId === res.id);
            if (!entry) return;

            if (res.type === 'boolean') {
                if (entry.value) completedCount++;
            } else {
                // For numeric/duration, check against target
                if (res.target && typeof entry.value === 'number') {
                    if (entry.value >= res.target) completedCount++;
                } else if (entry.value === true) {
                    // Fallback: if value is boolean true, consider it done (e.g. fast toggle)
                    completedCount++;
                } else if (!res.target && entry.value) {
                    completedCount++;
                }
            }
        });

        const percentage = (completedCount / resolutions.length) * 100;

        return percentage;
    }, [resolutions, entries]);

    // Confetti Effect
    useEffect(() => {
        if (progressPercentage === 100 && resolutions.length > 0) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }, [progressPercentage, resolutions.length]);

    // Smart Notification Logic (Streak Repair)
    useEffect(() => {
        const manageNotifications = async () => {
            const saved = localStorage.getItem('notification_schedules');
            if (!saved) return;

            const schedules = JSON.parse(saved); // Need to import type? Or just infer.
            const repairSchedule = schedules[3]; // ID 3 is STREAK_REPAIR (Hardcoded ID reference from service)

            if (!repairSchedule || !repairSchedule.enabled) return;

            // Import these from service/notifications to be clean, but for now using ID 3.
            // Actually let's dynamically import or assumed standard structure.
            // ID 3 is defined in DEFAULT_SCHEDULES in services/notifications.ts

            if (progressPercentage === 100) {
                // Goal met! You won't need to repair tomorrow. Cancel the alarm.
                await NotificationService.cancel(3);
                console.log("Cancelled Streak Repair notification setup (Goal Met)");
            } else {
                // Goal not met yet. Ensure the "Repair" notification is scheduled for tomorrow.
                // Note: The service.schedule cancels before scheduling, so this effectively "Resets" it.
                // To avoid spamming native bridge on every render, we could check pending?
                // For MVP, just scheduling is 'safe' (idempotent-ish).
                await NotificationService.schedule(repairSchedule);
                console.log("Scheduled Streak Repair notification (Goal Pending)");
            }
        };

        manageNotifications();
    }, [progressPercentage]); // Runs when progress updates


    // Layout handles loading state
    if (loading) return null;
    if (!user) return null;

    return (
        <div className="min-h-screen pb-24">
            <div className="flex flex-col items-center py-8">
                {/* Hero / Progress Ring */}
                <div className="mb-12 scale-90 md:scale-100">
                    <ProgressRing percentage={progressPercentage} />
                </div>

                {/* Resolution List */}
                <div className="w-full max-w-2xl space-y-4 px-4">
                    <div className="mb-4 flex items-center justify-between px-2">
                        <h2 className="text-xl font-bold tracking-tight">Your Habits</h2>
                        <span className="text-sm text-gray-400">{resolutions.length} active</span>
                    </div>

                    {resolutions.length === 0 ? (
                        <div className="mt-8 text-center text-gray-400">
                            <p>No resolutions yet. Tap + to start.</p>
                        </div>
                    ) : (
                        resolutions.map((res) => (
                            <ResolutionCard
                                key={res.id}
                                resolution={res}
                                entries={entries}
                            />
                        ))
                    )}
                </div>
            </div>

            {/* Floating Action Button */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-24 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-black text-white shadow-xl transition-transform hover:scale-105 active:scale-95 md:bottom-8 lg:right-12"
            >
                <Plus size={24} />
            </button>

            <AddResolutionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}


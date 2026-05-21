"use client";

import { useAuth } from "@/context/AuthContext";
import { LogOut, User as UserIcon, Award, Activity, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { subscribeToResolutions, subscribeToEntries, ResolutionData, EntryData } from "@/services/db";
import { NotificationService, NotificationSchedule, DEFAULT_SCHEDULES } from "@/services/notifications";
import clsx from "clsx";

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const [resolutions, setResolutions] = useState<ResolutionData[]>([]);
    const [entries, setEntries] = useState<EntryData[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);

    // Notification State
    const [schedules, setSchedules] = useState<Record<number, NotificationSchedule>>(DEFAULT_SCHEDULES);

    useEffect(() => {
        // Load settings from local storage
        const saved = localStorage.getItem('notification_schedules');
        if (saved) {
            setSchedules(JSON.parse(saved));
        }
    }, []);

    const handleUpdateSchedule = async (id: number, updates: Partial<NotificationSchedule>) => {
        const newSchedules = { ...schedules };
        newSchedules[id] = { ...newSchedules[id], ...updates };
        setSchedules(newSchedules);

        // Persist
        localStorage.setItem('notification_schedules', JSON.stringify(newSchedules));

        // Schedule/Update Native
        try {
            const hasPermission = await NotificationService.checkPermission();
            if (!hasPermission && updates.enabled) {
                const granted = await NotificationService.requestPermission();
                if (!granted) {
                    // Revert if denied (simple UX for now)
                    alert("Notifications permission denied. Please enable it in system settings.");
                    return;
                }
            }
            await NotificationService.schedule(newSchedules[id]);
        } catch (e) {
            console.error("Failed to schedule notification", e);
        }
    };

    useEffect(() => {
        if (!user) return;
        const unsubRes = subscribeToResolutions(user.uid, setResolutions);
        const unsubEntries = subscribeToEntries(user.uid, (data) => {
            setEntries(data);
            setLoadingStats(false);
        });
        return () => { unsubRes(); unsubEntries(); };
    }, [user]);

    const handleLogout = async () => {
        await logout();
        router.push("/");
    };

    const totalCompletions = entries.length;
    const activeHabits = resolutions.length;

    // Badge Logic
    const badges = [
        {
            id: 'beginner',
            label: 'Beginner',
            icon: Flame,
            color: 'bg-orange-100 text-orange-600',
            unlocked: totalCompletions >= 1
        },
        {
            id: 'consistent',
            label: 'Consistent',
            icon: Activity,
            color: 'bg-blue-100 text-blue-600',
            unlocked: totalCompletions >= 10
        },
        {
            id: 'master',
            label: 'Master',
            icon: Award,
            color: 'bg-purple-100 text-purple-600',
            unlocked: totalCompletions >= 100
        },
    ];

    return (
        <div className="min-h-screen space-y-8 p-6 lg:p-10 pb-24">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <p className="text-gray-500">Manage your account and view achievements.</p>
            </div>

            {/* User Info */}
            <div className="flex items-center gap-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-500 overflow-hidden">
                    {user?.photoURL ? (
                        <img src={user.photoURL} alt="Avatar" className="h-full w-full object-cover" />
                    ) : (
                        <UserIcon size={40} />
                    )}
                </div>
                <div>
                    <h2 className="text-xl font-bold">{user?.displayName || "User"}</h2>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 gap-4">
                <div className="rounded-3xl bg-black p-6 text-white shadow-lg">
                    <p className="text-sm font-medium text-gray-400">Active Habits</p>
                    <p className="mt-2 text-3xl font-bold">{activeHabits}</p>
                </div>
                <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                    <p className="text-sm font-medium text-gray-400">Total Completions</p>
                    <p className="mt-2 text-3xl font-bold text-black">{totalCompletions}</p>
                </div>
            </div>

            {/* Badges */}
            <div>
                <h3 className="mb-4 text-lg font-bold">Badges</h3>
                <div className="grid grid-cols-3 gap-4">
                    {badges.map((badge) => (
                        <div
                            key={badge.id}
                            className={clsx(
                                "flex flex-col items-center justify-center gap-2 rounded-2xl p-4 text-center transition-all",
                                badge.unlocked ? badge.color : "bg-gray-50 text-gray-300 grayscale"
                            )}
                        >
                            <badge.icon size={24} />
                            <span className="text-xs font-semibold">{badge.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Notifications */}
            <div>
                <h3 className="mb-4 text-lg font-bold">Notifications</h3>
                <div className="space-y-3 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                    {Object.values(schedules).map((schedule) => (
                        <div key={schedule.id} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                            <div className="flex-1">
                                <p className="font-medium text-gray-900">{schedule.title.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, '')}</p>
                                <p className="text-xs text-gray-400 line-clamp-1">{schedule.body}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                {schedule.enabled && (
                                    <input
                                        type="time"
                                        value={`${schedule.hour.toString().padStart(2, '0')}:${schedule.minute.toString().padStart(2, '0')}`}
                                        onChange={(e) => {
                                            const [h, m] = e.target.value.split(':').map(Number);
                                            handleUpdateSchedule(schedule.id, { hour: h, minute: m });
                                        }}
                                        className="rounded-lg border-gray-200 bg-gray-50 p-1 text-sm focus:border-black focus:ring-black"
                                    />
                                )}
                                <label className="relative inline-flex cursor-pointer items-center">
                                    <input
                                        type="checkbox"
                                        checked={schedule.enabled}
                                        onChange={(e) => handleUpdateSchedule(schedule.id, { enabled: e.target.checked })}
                                        className="peer sr-only"
                                    />
                                    <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-black peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black/20 rtl:peer-checked:after:-translate-x-full"></div>
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pt-4">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-4 text-red-600 transition-colors hover:bg-red-100"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>
        </div>
    );
}

"use client";

import { useAuth } from "@/context/AuthContext";
import { LogOut, User as UserIcon, Award, Activity, Flame } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { subscribeToResolutions, subscribeToEntries, ResolutionData, EntryData } from "@/services/db";
import clsx from "clsx";

export default function ProfilePage() {
    const { user, logout } = useAuth();
    const router = useRouter();

    const [resolutions, setResolutions] = useState<ResolutionData[]>([]);
    const [entries, setEntries] = useState<EntryData[]>([]);
    const [loadingStats, setLoadingStats] = useState(true);

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

            <div className="pt-4">
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 py-4 text-red-600 transition-colors hover:bg-red-100"
                >
                    <LogOut size={18} />
                    Sign Out
                </button>
            </div>

            {/* Danger Zone */}
            <div className="pt-8 border-t border-gray-100">
                <h3 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h3>
                <p className="text-sm text-gray-500 mb-4">Permanently delete your account and all data.</p>
                <button
                    onClick={async () => {
                        if (confirm("Are you sure? This will permanently delete all your habits and data. This cannot be undone.")) {
                            try {
                                if (!user) return;
                                // 1. Delete Firestore Data
                                const { deleteUserData } = await import("@/services/db");
                                await deleteUserData(user.uid);

                                // 2. Delete Auth User
                                await user.delete();

                                // 3. Redirect
                                router.push("/");
                            } catch (error) {
                                console.error("Deletion failed", error);
                                alert("Failed to delete account. You may need to re-login recently to perform this action.");
                            }
                        }
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-600 py-4 text-white font-medium transition-colors hover:bg-red-700"
                >
                    Delete Account
                </button>
            </div>
        </div>
    );
}

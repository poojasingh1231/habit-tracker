"use client";


import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { addResolution, ResolutionType, ResolutionData } from "@/services/db";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";

interface AddResolutionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const COLORS = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-green-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-sky-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-purple-500",
    "bg-fuchsia-500",
    "bg-pink-500",
    "bg-rose-500",
];

export default function AddResolutionModal({
    isOpen,
    onClose,
    initialData
}: AddResolutionModalProps) {
    const { user } = useAuth();
    const router = useRouter(); // To refresh if needed, though onSnapshot handles it

    const [loading, setLoading] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [type, setType] = useState<ResolutionType>("boolean");
    const [target, setTarget] = useState("");
    const [unit, setUnit] = useState("");
    const [frequency, setFrequency] = useState<ResolutionFrequency>("daily");
    const [color, setColor] = useState(COLORS[8]); // Default blue

    // Populate form if initialData provided (Edit Mode)
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setType(initialData.type);
            setTarget(initialData.target ? String(initialData.target) : "");
            setUnit(initialData.unit || "");
            setFrequency(initialData.frequency);
            setColor(initialData.color);
        } else {
            // Reset if adding new
            setTitle("");
            setType("boolean");
            setTarget("");
            setUnit("");
            setFrequency("daily");
            setColor(COLORS[8]);
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !user) return;
        setLoading(true);

        try {
            const resolutionData: ResolutionData = {
                title,
                type,
                frequency,
                color,
                // Only include if not boolean
                ...(type !== "boolean" && {
                    target: Number(target),
                    unit,
                }),
            };

            if (initialData && initialData.id) {
                // UPDATE existing
                // Dynamic import to avoid circular dependency if any, or just standard import
                const { updateResolution } = await import("@/services/db");
                await updateResolution(user.uid, initialData.id, resolutionData);
            } else {
                // CREATE new
                await addResolution(user.uid, resolutionData);
            }

            onClose();
            // Reset form if creating new (though useEffect handles this on re-open)
            if (!initialData) {
                setTitle("");
                setTarget("");
                setUnit("");
            }
        } catch (error) {
            console.error(error);
            // alert("Failed to create resolution"); // Removed alert
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/20 bg-white/90 p-6 shadow-2xl backdrop-blur-xl transition-all">
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-bold tracking-tight text-gray-900">New Resolution</h2>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-500 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Habit Name</label>
                        <input
                            type="text"
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Drink Water"
                            className="mt-1 block w-full rounded-xl border-gray-200 bg-white/50 px-4 py-3 placeholder:text-gray-500 focus:border-black focus:ring-black"
                        />
                    </div>

                    {/* Type Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <div className="mt-2 grid grid-cols-3 gap-2">
                            {(["boolean", "numeric", "duration"] as const).map((t) => (
                                <button
                                    key={t}
                                    type="button"
                                    onClick={() => setType(t)}
                                    className={clsx(
                                        "capitalize rounded-xl border py-2 text-sm font-medium transition-all",
                                        type === t
                                            ? "border-black bg-black text-white"
                                            : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                                    )}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Conditional Inputs */}
                    {type !== "boolean" && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Target</label>
                                <input
                                    type="number"
                                    required
                                    value={target}
                                    onChange={(e) => setTarget(e.target.value)}
                                    placeholder="e.g. 2000"
                                    className="mt-1 block w-full rounded-xl border-gray-200 bg-white/50 px-4 py-3 focus:border-black focus:ring-black"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Unit</label>
                                <input
                                    type="text"
                                    required
                                    value={unit}
                                    onChange={(e) => setUnit(e.target.value)}
                                    placeholder={type === "duration" ? "mins" : "ml"}
                                    className="mt-1 block w-full rounded-xl border-gray-200 bg-white/50 px-4 py-3 focus:border-black focus:ring-black"
                                />
                            </div>
                        </div>
                    )}

                    {/* Color Picker */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Accent Color</label>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {COLORS.map((c) => (
                                <button
                                    key={c}
                                    type="button"
                                    onClick={() => setColor(c)}
                                    className={clsx(
                                        "h-6 w-6 rounded-full transition-transform",
                                        c,
                                        color === c ? "scale-110 ring-2 ring-black ring-offset-2" : "hover:scale-105"
                                    )}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-2xl bg-black py-4 font-bold text-white transition-transform active:scale-95 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : (initialData ? "Save Changes" : "Create Habit")}
                    </button>
                </form>
            </div>
        </div>
    );
}

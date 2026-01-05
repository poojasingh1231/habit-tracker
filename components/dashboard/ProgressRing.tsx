"use client";

import { motion } from "framer-motion";

interface ProgressRingProps {
    percentage: number; // 0 to 100
    size?: number;
    strokeWidth?: number;
}

export default function ProgressRing({
    percentage,
    size = 280,
    strokeWidth = 20,
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center">
            <svg
                width={size}
                height={size}
                className="rotate-[-90deg]" // Start from top
            >
                {/* Background Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#e5e7eb" // gray-200
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                />

                {/* Gradient Definition */}
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#000000" />
                        <stop offset="100%" stopColor="#4b5563" />
                    </linearGradient>
                </defs>

                {/* Progress Circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset} // Start fully offset (0%)
                    // @ts-ignore
                    initial={{ strokeDashoffset: circumference }} // Animate from 0
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                />
            </svg>

            {/* Centered Text */}
            <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-bold tracking-tighter text-black">
                    {Math.round(percentage)}%
                </span>
                <span className="text-sm font-medium text-gray-400 uppercase tracking-widest mt-1">
                    Daily Goal
                </span>
            </div>
        </div>
    );
}

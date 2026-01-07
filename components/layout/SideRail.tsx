"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, BarChart2, User, LogOut, Mail } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import clsx from "clsx";

const navItems = [
    { label: "Home", href: "/dashboard", icon: Home },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
    { label: "Contact", href: "/dashboard/contact", icon: Mail },
    { label: "Profile", href: "/dashboard/profile", icon: User },
];

export default function SideRail() {
    const pathname = usePathname();
    const router = useRouter();
    const { logout } = useAuth();

    return (
        <aside className="hidden h-screen w-20 flex-col items-center border-r border-gray-100 bg-white py-8 md:flex lg:w-64 lg:items-start lg:px-6">
            <div className="mb-12 flex h-10 w-full items-center justify-center lg:justify-start">
                <div className="h-8 w-8 rounded-full bg-black" />
                <span className="ml-3 hidden text-xl font-bold tracking-tight lg:block">
                    Daily Habit Tracker
                </span>
            </div>

            <nav className="flex w-full flex-1 flex-col gap-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "group flex w-full items-center rounded-xl p-3 transition-all duration-200",
                                isActive
                                    ? "bg-gray-50 text-black"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <item.icon
                                size={24}
                                className={clsx(
                                    "transition-transform duration-200",
                                    isActive && "scale-110"
                                )}
                                strokeWidth={isActive ? 2.5 : 2}
                            />
                            <span className="ml-3 hidden font-medium lg:block">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>

            <div className="mt-auto w-full">
                <button
                    onClick={async () => {
                        await logout();
                        router.push("/");
                    }}
                    className="group flex w-full items-center rounded-xl p-3 text-gray-600 transition-colors duration-200 hover:bg-red-50 hover:text-red-500"
                >
                    <LogOut size={24} strokeWidth={2} />
                    <span className="ml-3 hidden font-medium lg:block">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BarChart2, User, Mail } from "lucide-react";
import clsx from "clsx";

const navItems = [
    { label: "Home", href: "/dashboard", icon: Home },
    { label: "Analytics", href: "/dashboard/analytics", icon: BarChart2 },
    { label: "Contact", href: "/dashboard/contact", icon: Mail },
    { label: "Profile", href: "/dashboard/profile", icon: User },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100 bg-white/80 backdrop-blur-lg md:hidden">
            <div className="flex items-center justify-around p-3">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(
                                "flex flex-col items-center gap-1 transition-colors duration-200",
                                isActive ? "text-black" : "text-gray-600 hover:text-gray-600"
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
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </div>
            <div className="h-[env(safe-area-inset-bottom)] w-full bg-white/80 backdrop-blur-lg" />
        </nav>
    );
}

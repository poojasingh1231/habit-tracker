"use client";

import { useAuth } from "@/context/AuthContext";
import BottomNav from "./BottomNav";
import SideRail from "./SideRail";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    const isDashboard = pathname?.startsWith("/dashboard");

    useEffect(() => {
        if (!loading && !user && isDashboard) {
            router.push("/");
        }
    }, [user, loading, isDashboard, router]);

    // Don't show nav on landing page regardless of auth state (design choice)
    // OR show nav only if logged in AND not on landing page?
    // User Requirement: "If not logged in, show 'Landing Page'... If logged in, redirect to `/dashboard`."
    // So landing page is "/" and app is "/dashboard".
    // Means Nav should only be visible on "/dashboard" routes.



    if (loading) return null; // Or a global loader managed by AuthProvider

    return (
        <div className="flex h-screen w-full flex-col md:flex-row">
            {user && isDashboard && <SideRail />}

            <main className="flex-1 overflow-y-auto bg-white pb-20 md:pb-0">
                <div className="mx-auto max-w-5xl md:p-8">
                    {children}
                </div>
            </main>

            {user && isDashboard && <BottomNav />}
        </div>
    );
}

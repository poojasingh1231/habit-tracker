"use client";

import Link from "next/link";
import { ArrowRight, Check, Star } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { user, loading, login } = useAuth();
  const router = useRouter();

  console.log("Landing Page Render - User:", user?.email, "Loading:", loading);

  useEffect(() => {
    if (user) {
      console.log("User detected, redirecting to /dashboard");
      router.push("/dashboard");
    }
  }, [user, router]);

  // Prevent flash of landing page content if already logged in
  if (user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
          <p className="text-sm text-gray-500">Redirecting to Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black selection:bg-gray-200">
      {/* Navbar */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-black"></div>
            <span className="text-xl font-bold tracking-tight">Daily Habit Tracker</span>
          </div>
          <button
            onClick={login}
            className="rounded-full bg-black px-6 py-2 text-sm font-medium text-white transition-transform hover:scale-105 active:scale-95"
          >
            Get Started
          </button>
        </div>
      </header>

      <main className="pt-32">
        {/* Hero Section */}
        <section className="mx-auto max-w-5xl px-6 text-center">
          <div className="mb-8 inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm font-medium text-gray-600">
            <Star size={14} className="mr-2 fill-orange-400 text-orange-400" />
            <span>The #1 Minimalist Habit Tracker</span>
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl">
            Build habits that <br />
            <span className="text-gray-400">actually stick.</span>
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg text-gray-500">
            Daily Habit Tracker removes the clutter so you can focus on consistency.
            Track your resolutions, visualize progress, and achieve your goals with elegance.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              onClick={login}
              className="group flex items-center justify-center gap-2 rounded-full bg-black px-8 py-4 text-lg font-medium text-white transition-all hover:bg-gray-900 hover:ring-4 hover:ring-gray-200"
            >
              Start Your Year
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
            <div className="text-sm text-gray-400">No credit card required</div>
          </div>
        </section>

        {/* Feature Demo / Screenshot */}
        <section className="mx-auto mt-24 max-w-6xl px-4">
          <div className="relative rounded-3xl border border-gray-200 bg-gray-50 p-2 sm:p-4">
            <div className="overflow-hidden rounded-2xl bg-white shadow-2xl">
              {/* Simulated UI Mockup */}
              {/* Simulated UI Mockup */}
              <div className="flex flex-col items-center border-b border-gray-100 bg-white p-12 text-center pointer-events-none select-none">
                {/* Fixed Progress Ring (66%) */}
                <div className="relative flex h-40 w-40 items-center justify-center">
                  <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                    {/* Track */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-gray-100"
                      strokeWidth="8"
                      fill="none"
                    />
                    {/* Progress */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      className="stroke-black transition-all duration-1000 ease-out"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 * (1 - 0.66)} // 66% filled
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-bold tracking-tighter">66%</span>
                  </div>
                </div>

                <div className="mt-8 w-full max-w-md space-y-4 text-left">
                  {[
                    { title: "Morning Run", done: true, color: "bg-orange-500", type: "Boolean" },
                    { title: "Read 30 mins", done: true, color: "bg-blue-500", type: "Duration", target: "30 mins" },
                    { title: "Drink Water", done: false, color: "bg-cyan-500", type: "Numeric", target: "2000 ml" },
                  ].map((habit, i) => (
                    <div key={i} className="group flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                      <div>
                        <h3 className="font-bold text-gray-900">{habit.title}</h3>
                        <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                          <span className="capitalize">{habit.type}</span>
                          {habit.target && (
                            <>
                              <span>•</span>
                              <span>Goal: {habit.target}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${habit.done ? 'bg-black border-black text-white' : 'border-gray-200 text-gray-300'}`}>
                        {habit.done ? <Check size={20} /> : <div className="h-4 w-4 rounded-full bg-gray-100" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute -inset-1 -z-10 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-2xl"></div>
          </div>
        </section>

        {/* Value Props */}
        <section className="mx-auto my-32 max-w-7xl px-6">
          <div className="grid gap-12 sm:grid-cols-3">
            {[
              { title: "Laser Focus", desc: "No ads, no social distractions. Just you and your goals." },
              { title: "Real-time Sync", desc: "Access your dashboard from any device, instantly updated." },
              { title: "Beautiful Analytics", desc: "Visualize your streaks and completion rates with stunning charts." }
            ].map((feat, i) => (
              <div key={i} className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-black text-white flex items-center justify-center text-xl font-bold">
                  {i + 1}
                </div>
                <h3 className="text-xl font-bold">{feat.title}</h3>
                <p className="text-gray-500">{feat.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-gray-100 py-12 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Daily Habit Tracker. All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
}

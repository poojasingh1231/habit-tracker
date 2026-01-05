"use client";

import { Mail } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen space-y-8 p-6 pb-24 lg:p-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
                <p className="text-gray-500">We'd love to hear from you.</p>
            </div>

            <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-sm">
                <div className="flex flex-col items-center justify-center text-center space-y-4 py-12">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                        <Mail size={32} />
                    </div>

                    <h2 className="text-xl font-bold text-gray-900">Get in Touch</h2>
                    <p className="max-w-md text-gray-500">
                        Have questions, suggestions, or just want to say hello?
                        Drop us a line and we'll get back to you as soon as possible.
                    </p>

                    <div className="mt-6 rounded-xl bg-gray-50 px-6 py-4">
                        <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">Email Us At</p>
                        <a href="mailto:hello@yearone.app" className="mt-1 block text-xl font-bold text-black hover:text-blue-600 transition-colors">
                            hello@yearone.app
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

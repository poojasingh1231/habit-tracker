"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signInWithCredential,
    signOut,
    User,
} from "firebase/auth";
import { auth, app } from "@/lib/firebaseConfig";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => { },
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!app) {
            console.warn("Firebase not initialized. Check your .env.local keys.");
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user || null);
            setLoading(false);
        });

        // Check for redirect result (web flow)
        getRedirectResult(auth).catch((error) => {
            console.error("Redirect login failed:", error);
        });

        return () => unsubscribe();
    }, []);

    const login = async () => {
        if (!app) {
            alert("Firebase keys missing!");
            return;
        }

        try {
            // Import Capacitor utilities dynamically to avoid SSR issues
            const { Capacitor } = await import("@capacitor/core");

            if (Capacitor.isNativePlatform()) {
                const { FirebaseAuthentication } = await import("@capacitor-firebase/authentication");

                // 1. Native Sign In
                const result = await FirebaseAuthentication.signInWithGoogle();

                if (result.credential?.idToken) {
                    const credential = GoogleAuthProvider.credential(result.credential.idToken);
                    await signInWithCredential(auth, credential);
                }
                // Web Fallback: Use redirect to avoid popup blockers
                const provider = new GoogleAuthProvider();
                await signInWithRedirect(auth, provider);
            }
        } catch (error: any) {
            console.error("Login failed:", error);
            alert(`Login failed: ${error.message || JSON.stringify(error)}`);
        }
    };

    const logout = async () => {
        if (!app) return;
        await signOut(auth);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {loading ? (
                <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                    {/* Simple spinner or loader could go here */}
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black"></div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

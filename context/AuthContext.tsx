"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
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

        return () => unsubscribe();
    }, []);

    const login = async () => {
        if (!app) {
            alert("Firebase keys missing!");
            return;
        }
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
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

import {
    collection,
    addDoc,
    serverTimestamp,
    doc,
    setDoc,
    onSnapshot,
    query,
    where,
    orderBy,
    deleteDoc,
    Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";

// Types
export type ResolutionType = "boolean" | "numeric" | "duration";
export type ResolutionFrequency = "daily" | "weekly";

export interface ResolutionData {
    id?: string; // Added for retrieval
    title: string;
    type: ResolutionType;
    target?: number; // e.g., 2000 (ml), 30 (mins)
    unit?: string; // e.g., "ml", "mins", "pages"
    frequency: ResolutionFrequency;
    color: string;
}

export interface EntryData {
    resolutionId: string;
    date: string; // ISO YYYY-MM-DD
    value: number | boolean;
    note?: string;
}

/**
 * Add a new resolution for a user
 */
export const addResolution = async (userId: string, data: ResolutionData) => {
    try {
        const resolutionsRef = collection(db, "users", userId, "resolutions");
        // Remove undefined fields
        const cleanData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v !== undefined)
        );

        const docRef = await addDoc(resolutionsRef, {
            ...cleanData,
            createdAt: serverTimestamp(),
            isActive: true,
        });
        return docRef.id;
    } catch (error) {
        console.error("Error adding resolution:", error);
        throw error;
    }
};

/**
 * Log a daily entry
 */
export const logProgress = async (userId: string, data: EntryData) => {
    try {
        const entriesRef = collection(db, "users", userId, "entries");
        // We can use auto-ID, or composite ID (resId_date) to prevent duplicates
        // Using composite ID for easier retrieval/idempotency
        const entryId = `${data.resolutionId}_${data.date}`;
        const docRef = doc(entriesRef, entryId);

        await setDoc(docRef, {
            ...data,
            updatedAt: serverTimestamp(),
        }, { merge: true }); // Merge allows updating value without overwriting everything if we add more fields later

        return entryId;
    } catch (error) {
        console.error("Error logging progress:", error);
        throw error;
    }
};

/**
 * Subscribe to all resolutions for a user
 */
export const subscribeToResolutions = (
    userId: string,
    callback: (data: ResolutionData[]) => void
) => {
    const q = query(
        collection(db, "users", userId, "resolutions"),
        orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (snapshot) => {
        const resolutions = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        })) as ResolutionData[];
        callback(resolutions);
    });
};

/**
 * Subscribe to entries for a specific date range or all entries
 * For now, let's just get all entries to map them locally, or optimize for "this week" later.
 * Actually, efficiently, we probably want "today's entries" and "last 7 days entries".
 * Let's just get all entries for now to keep it simple, or maybe just "todays" and "week".
 */

export const subscribeToEntries = (
    userId: string,
    callback: (data: EntryData[]) => void
) => {
    // In a real app with thousands of entries, we'd want to limit this query.
    // For "Daily Habit Tracker" MVP, getting all entries (or last 30 days) is fine.
    // Let's filter by date >= 7 days ago?
    // String comparison works for ISO dates.

    // Actually, let's just get today's entries for the progress ring?
    // And use a separate query for the weekly strip?
    // Let's make it generic: subscribe to ALL entries for now (simplest for client-side filtering).

    const q = query(
        collection(db, "users", userId, "entries")
    );

    return onSnapshot(q, (snapshot) => {
        const entries = snapshot.docs.map((doc) => doc.data()) as EntryData[];
        callback(entries);
    });
};

/**
 * Delete a resolution
 */
export const deleteResolution = async (userId: string, resolutionId: string) => {
    try {
        const resolutionRef = doc(db, "users", userId, "resolutions", resolutionId);
        await deleteDoc(resolutionRef);
        // Note: Subcollection 'entries' are NOT automatically deleted by Firestore.
        // For MVP, leaving them orphaned is acceptable as they won't be queried without the parent ID.
        // In a real production app, we'd use a cloud function to recursively delete.
    } catch (error) {
        console.error("Error deleting resolution:", error);
        throw error;
    }
};

/**
 * Update a resolution
 */
export const updateResolution = async (userId: string, resolutionId: string, data: Partial<ResolutionData>) => {
    try {
        const resolutionRef = doc(db, "users", userId, "resolutions", resolutionId);
        // Remove undefined fields
        const cleanData = Object.fromEntries(
            Object.entries(data).filter(([_, v]) => v !== undefined)
        );

        await setDoc(resolutionRef, {
            ...cleanData,
            updatedAt: serverTimestamp(),
        }, { merge: true });
    } catch (error) {
        console.error("Error updating resolution:", error);
        throw error;
    }
};

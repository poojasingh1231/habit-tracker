import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Returns the current date as YYYY-MM-DD string in local timezone.
 * Used for storing entry keys in Firestore.
 */
export const getTodayDateString = (): string => {
    // en-CA is the standard logical way to get YYYY-MM-DD
    // We use the user's local timezone which is default behavior of Date
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

/**
 * Returns dates for the last 7 days (including today)
 */
export const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');

        days.push({
            dateStr: `${year}-${month}-${day}`, // YYYY-MM-DD
            dayName: d.toLocaleDateString('en-US', { weekday: 'short' }), // Mon
            fullDate: d // Date object
        });
    }
    return days;
};

/**
 * Returns dates for the current week (Monday to Sunday)
 */
export const getCurrentWeekDays = () => {
    const days = [];
    const today = new Date();
    const day = today.getDay(); // 0 (Sun) to 6 (Sat)

    // Calculate Monday of this week
    // If today is Sunday (0), Monday was 6 days ago.
    // If today is Mon (1), diff is 0.
    // diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today);
    monday.setDate(diff);

    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const dayStr = String(d.getDate()).padStart(2, '0');

        days.push({
            dateStr: `${year}-${month}-${dayStr}`,
            dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
            fullDate: d
        });
    }
    return days;
};

/**
 * Get date string for a Date object
 */
export const formatDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

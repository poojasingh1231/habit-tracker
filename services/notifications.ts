
import { LocalNotifications } from '@capacitor/local-notifications';

export interface NotificationSchedule {
    id: number;
    title: string;
    body: string;
    hour: number;
    minute: number;
    enabled: boolean;
}

export const NOTIFICATION_IDS = {
    DAILY_REMINDER: 1,
    STREAK_SAVER: 2,
    STREAK_REPAIR: 3,
};

export const DEFAULT_SCHEDULES: Record<number, NotificationSchedule> = {
    [NOTIFICATION_IDS.DAILY_REMINDER]: {
        id: NOTIFICATION_IDS.DAILY_REMINDER,
        title: "Daily Check-in 📝",
        body: "Time to check in! Did you complete your habits today?",
        hour: 20, // 8 PM
        minute: 0,
        enabled: false // Default off logic handled by UI storage usually, but standard defaults here
    },
    [NOTIFICATION_IDS.STREAK_SAVER]: {
        id: NOTIFICATION_IDS.STREAK_SAVER,
        title: "Streak Saver 🔥",
        body: "Don't break your streak! Log your activity before midnight.",
        hour: 22, // 10 PM
        minute: 0,
        enabled: false
    },
    [NOTIFICATION_IDS.STREAK_REPAIR]: {
        id: NOTIFICATION_IDS.STREAK_REPAIR,
        title: "Repair Your Streak 🛠️",
        body: "Missed yesterday? You can still repair your streak in Insights!",
        hour: 9, // 9 AM
        minute: 0,
        enabled: false
    }
};

export const NotificationService = {
    async requestPermission(): Promise<boolean> {
        const result = await LocalNotifications.requestPermissions();
        return result.display === 'granted';
    },

    async checkPermission(): Promise<boolean> {
        const result = await LocalNotifications.checkPermissions();
        return result.display === 'granted';
    },

    async schedule(schedule: NotificationSchedule) {
        if (!schedule.enabled) {
            await this.cancel(schedule.id);
            return;
        }

        // Cancel existing first to be safe
        await this.cancel(schedule.id);

        await LocalNotifications.schedule({
            notifications: [
                {
                    title: schedule.title,
                    body: schedule.body,
                    id: schedule.id,
                    schedule: {
                        on: {
                            hour: schedule.hour,
                            minute: schedule.minute,
                        },
                        allowWhileIdle: true,
                    },
                }
            ]
        });
    },

    async cancel(id: number) {
        await LocalNotifications.cancel({ notifications: [{ id }] });
    },

    async getPending() {
        return await LocalNotifications.getPending();
    }
};

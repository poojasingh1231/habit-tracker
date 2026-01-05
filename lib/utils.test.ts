import { getTodayDateString, getLast7Days, formatDateString } from './utils';

describe('Date Utilities', () => {
    // 1. Test getTodayDateString
    it('getTodayDateString returns a string in YYYY-MM-DD format', () => {
        const result = getTodayDateString();
        // Regex for YYYY-MM-DD
        expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);

        // Check if it matches today's date logic
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        expect(result).toBe(`${year}-${month}-${day}`);
    });

    // 2. Test formatDateString
    it('formatDateString correctly formats a Date object', () => {
        const testDate = new Date('2025-12-25T12:00:00'); // Christmas 2025
        // Note: The function uses .getDate() / .getMonth() which are local time. 
        // We need to be careful with test inputs if the machine is in a timezone where this shifts.
        // Ideally we should mock the date or construct it explicitly.

        // Creating a date that is definitely noon local time to avoid wraparound issues
        const d = new Date();
        d.setFullYear(2025);
        d.setMonth(11); // Month is 0-indexed (11 = Dec)
        d.setDate(25);

        const result = formatDateString(d);
        expect(result).toBe('2025-12-25');
    });

    // 3. Test getLast7Days
    it('getLast7Days returns array of 7 items', () => {
        const days = getLast7Days();
        expect(days).toHaveLength(7);
    });

    it('getLast7Days returns correct order (Oldest to Newest)', () => {
        const days = getLast7Days();
        // The last item should be today
        const lastItem = days[6];
        const today = getTodayDateString();

        expect(lastItem.dateStr).toBe(today);

        // The first item should be 6 days ago
        const firstItem = days[0];
        const d = new Date();
        d.setDate(d.getDate() - 6);
        const expectedFirst = formatDateString(d);

        expect(firstItem.dateStr).toBe(expectedFirst);
    });
});

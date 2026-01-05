import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ResolutionCard from './ResolutionCard';
import '@testing-library/jest-dom';
import { ResolutionData } from '@/services/db';

// Mock dependencies
jest.mock("@/context/AuthContext", () => ({
    useAuth() {
        return {
            user: { uid: 'test-uid' },
            loading: false,
        }
    },
}));

const mockLogProgress = jest.fn();
jest.mock("@/services/db", () => ({
    logProgress: (...args) => mockLogProgress(...args),
}));

const mockResolution: ResolutionData = {
    id: 'res-1',
    title: 'Test Habit',
    type: 'boolean',
    frequency: 'daily',
    color: 'bg-red-500'
};

describe('ResolutionCard', () => {
    beforeAll(() => {
        jest.useFakeTimers();
        // Set to a fixed Wednesday to avoid weekend edge cases if any
        jest.setSystemTime(new Date('2025-01-01T12:00:00'));
    });

    afterAll(() => {
        jest.useRealTimers();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the title correctly', () => {
        render(<ResolutionCard resolution={mockResolution} entries={[]} />);
        expect(screen.getByText('Test Habit')).toBeInTheDocument();
    });

    it('shows empty state when no entry for today', () => {
        render(<ResolutionCard resolution={mockResolution} entries={[]} />);
        // Get the toggle button (first button in the card usually)
        const btn = screen.getAllByRole('button')[0];
        expect(btn).not.toHaveClass('bg-black');
    });

    it('calls logProgress when clicked', async () => {
        render(<ResolutionCard resolution={mockResolution} entries={[]} />);
        const btn = screen.getAllByRole('button')[0];

        fireEvent.click(btn);

        await waitFor(() => {
            expect(mockLogProgress).toHaveBeenCalledWith('test-uid', expect.objectContaining({
                resolutionId: 'res-1',
                value: true
            }));
        });
    });
});

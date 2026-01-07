import { render, screen } from '@testing-library/react';
import Home from './page';
import '@testing-library/jest-dom';

// Mock useRouter
jest.mock("next/navigation", () => ({
    useRouter() {
        return {
            push: jest.fn(),
        };
    },
}));

// Mock useAuth
jest.mock("@/context/AuthContext", () => ({
    useAuth() {
        return {
            user: null,
            loading: false,
            login: jest.fn()
        }
    },
}));

describe('Home Page', () => {
    it('renders the hero text correctly', () => {
        render(<Home />);

        // Check for the main heading
        // Check for the main heading (Brand Name appears multiple times)
        const brandElements = screen.getAllByText(/Daily Habit Tracker/i);
        expect(brandElements.length).toBeGreaterThan(0);
        expect(screen.getByText(/Build habits that/i)).toBeInTheDocument();

        // Check for CTA button
        expect(screen.getByText(/Start Your Year/i)).toBeInTheDocument();
    });
});

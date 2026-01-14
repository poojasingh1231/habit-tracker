# Resol - v2.0

Resol is a habit tracking application built with Next.js, Capacitor, and Firebase.

## v2.0 Release Notes

Major improvements to the dashboard and analytics experience:

### 1. Enhanced Activity Heatmap
-   **Improved Navigation**: The heatmap now automatically scrolls to the current date on load, so you don't have to scroll manually to see your latest activity.
-   **Month Labels**: Added clear month indicators (Jan, Feb, Mar...) above the heatmap grid to provide better temporal context.
-   **Responsive Layout**: Optimized for both desktop and mobile views.

### 2. New Insights Section
-   **Replaced Notes**: The unused "Note" text area has been replaced with a valuable "Insights" section in each habit card.
-   **Daily Streak**: Track your consistency with a real-time count of consecutive days completed.
-   **Yearly Completions**: See the total number of times you've completed a habit this year at a glance.

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run development server**:
    ```bash
    npm run dev
    ```

3.  **Build for Android**:
    ```bash
    npm run build
    npx cap sync android
    cd android
    ./gradlew bundleRelease
    ```

4.  **Deploy to Firebase**:
    ```bash
    npm run build
    firebase deploy
    ```

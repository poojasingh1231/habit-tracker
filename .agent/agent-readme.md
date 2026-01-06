# Agent Handoff Context - Year One (Resol)

## Project Overview
**Name**: Year One (Internal: `resol`)
**Goal**: Minimalist Habit Tracker with "Year in Pixels" visualization.
**Tech Stack**: 
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion.
- **Backend/Services**: Firebase (Auth, Firestore, Hosting).
- **Mobile**: Capacitor 8 (Android).
- **Deployment**: Static Export (`output: "export"`) hosted on Firebase Hosting.

## Key Configurations

### 1. Firebase
- **Project ID**: `daily-habit-tracker-pro`
- **Hosting URL**: `https://daily-habit-tracker-pro.web.app`
- **Auth**: Google Sign-In only.
- **Firestore**: Rules currently open (`allow read, write: if true;`) for development.

### 2. Mobile (Android)
- **Package Name**: `com.yearone.app`
- **Keystore**: `android/app/release-key.jks` 
    - **Alias**: `my-key-alias`
    - **Password**: `password`
    - **Properties File**: `android/keystore.properties` (Do not commit).
- **SHA-1 Fingerprints**: Both Debug (local `~/.android/debug.keystore`) and Release fingerprints are registered in Firebase Console.

### 3. Google Sign-In Implementation
**Native (Android)**:
- **Plugin**: `@capacitor-firebase/authentication` logic in `AuthContext.tsx`.
- **Fix 1**: `google-services.json` is present in `android/app/`.
- **Fix 2**: `default_web_client_id` was manually added to `android/app/src/main/res/values/strings.xml` to resolve `NullPointerException`.
- **Fix 3**: Plugin explicitly configured in `capacitor.config.ts`.

**Web**:
- **Method**: `signInWithRedirect` (to avoid popup blockers on mobile browsers).
- **Handling**: `AuthContext.tsx` uses `getRedirectResult` on mount.

## Current State & Active Tasks

### Recent Fixes
- **Production Login**: Fixed missing Web App config in Firebase project.
- **Android Login Crash**: Resolved `NullPointerException` by forcing Client ID in resources.
- **Contact Email**: Updated to `support@dailyhabittracker.club`.
- **Web Popup Blocker**: Switched from Popup to Redirect flow.

### Setup for Next Agent
- **Build Web**: `npm run build`
- **Deploy Web**: `npx firebase-tools deploy --only hosting`
- **Build Android**: 
    1. `npx cap sync android`
    2. `cd android`
    3. `./gradlew assembleDebug` (for Emulator) or `./gradlew bundleRelease` (for Play Store).

### Known Issues / To-Do
1.  **Mobile Infinite Loading**: 
    - **Status**: Suspected race condition in `ClientLayout.tsx` vs `dashboard/page.tsx`.
    - **Action Taken**: Removed redundant auth check in `dashboard/page.tsx`. Needs verification on physical device.
2.  **Landing Page Redirect**: 
    - **Status**: User reported getting stuck on Landing Page after login locally.
    - **Debug**: Console logs added to `app/page.tsx` to trace `user` state. Needs browser testing to confirm if `router.push("/dashboard")` is firing.

## Directory Structure Important Notes
- `.agent/`: This directory.
- `android/`: Native Android project.
- `out/`: Static export output (Synced to Capacitor).
- `context/AuthContext.tsx`: Core authentication logic (Hybrid Native/Web).

## Commands
```bash
# Development
npm run dev

# Full Release Pipeline
npm run build
npx firebase-tools deploy --project daily-habit-tracker-pro --only hosting
npx cap sync android
cd android && ./gradlew bundleRelease
```

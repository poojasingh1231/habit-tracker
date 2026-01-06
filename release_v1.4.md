# Release v1.4 (Production Fix)

**Version Details**:
- **Version Name**: `1.4`
- **Version Code**: `5`
- **Branch**: `v1.4`

**Important Note**:
The code in this release is identical to the verified Emulator build.
**The "Play Store Failure" is an administrative configuration issue, explained below.**

**Artifact Path**:
`/Users/mritunjaytripathi/Desktop/develop/resol/android/app/build/outputs/bundle/release/app-release.aab`

**CRITICAL FIX for Play Store:**
Since this works locally but fails on Play Store, the issue is **App Signing**.
Google Play resigns your app with its own key. The SHA-1 of **that** key is missing from Firebase.

**Steps to Fix:**
1.  Upload this `.aab` to Play Console.
2.  Go to **Play Console** -> **Setup** -> **App signing**.
3.  Look for "App signing key certificate".
4.  Copy the **SHA-1 certificate fingerprint**.
5.  Go to **Firebase Console** -> Project Settings -> Add Fingerprint.
6.  Paste the SHA-1 from Step 4.

Build works. Config needs update.

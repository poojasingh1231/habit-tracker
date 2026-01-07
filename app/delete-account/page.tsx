export default function DeleteAccountPage() {
    return (
        <div className="max-w-3xl mx-auto px-6 py-12 font-sans text-gray-800">
            <h1 className="text-3xl font-bold mb-6">Delete Your Account</h1>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8">
                <h2 className="text-lg font-semibold text-amber-900 mb-2">Warning: Irreversible Action</h2>
                <p className="text-amber-800">
                    Deleting your account will permanently remove all your habits, progress tracking, and history.
                    This action cannot be undone.
                </p>
            </div>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Option 1: Delete via App (Recommended)</h2>
                <p className="mb-4">The fastest way to delete your account is directly within the Daily Habit Tracker app:</p>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                    <li>Open <strong>Daily Habit Tracker</strong> on your device.</li>
                    <li>Go to the <strong>Dashboard</strong>.</li>
                    <li>Tap on your <strong>Profile Icon</strong> (top right or navigation bar).</li>
                    <li>Scroll to the bottom of the Profile page.</li>
                    <li>Tap the red <strong>Delete Account</strong> button.</li>
                    <li>Confirm your choice.</li>
                </ol>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Option 2: Manual Request</h2>
                <p className="mb-4">
                    If you no longer have access to the app, you can request account deletion by emailing our support team.
                    Please send the email from the same address linked to your account.
                </p>
                <p>
                    <strong>Email:</strong> <a href="mailto:support@dailyhabittracker.club" className="text-blue-600 hover:underline">support@dailyhabittracker.club</a><br />
                    <strong>Subject:</strong> GDPR/Account Deletion Request
                </p>
            </section>
        </div>
    );
}

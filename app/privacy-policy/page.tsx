export default function PrivacyPolicy() {
    return (
        <div className="max-w-4xl mx-auto px-6 py-12 font-sans text-gray-800">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            <p className="mb-4 text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3">1. Introduction</h2>
                <p className="mb-2">
                    Daily Habit Tracker ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how your personal information is collected, used, and disclosed by Daily Habit Tracker.
                </p>
                <p>
                    This Privacy Policy applies to our website, and its associated subdomains (collectively, our "Service") alongside our application, Daily Habit Tracker. By accessing or using our Service, you signify that you have read, understood, and agree to our collection, storage, use, and disclosure of your personal information as described in this Privacy Policy.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3">2. Information We Collect</h2>
                <p className="mb-2">We collect information to provide better services to all our users. The types of information we collect include:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li><strong>Account Information:</strong> When you register for an account, we may ask for your contact information, including items such as name, company name, address, email address, and telephone number. We use Google Sign-In for authentication.</li>
                    <li><strong>Usage Data:</strong> We collect information about the habits you track, your progress, and your interactions with the app to provide you with analytics and insights.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3">3. How We Use Your Information</h2>
                <p className="mb-2">We use the information we collect in various ways, including to:</p>
                <ul className="list-disc pl-5 space-y-1">
                    <li>Provide, operate, and maintain our website and app</li>
                    <li>Improve, personalize, and expand our website and app</li>
                    <li>Understand and analyze how you use our website and app</li>
                    <li>Develop new products, services, features, and functionality</li>
                    <li>Send you emails (if you opt-in)</li>
                    <li>Find and prevent fraud</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3">4. Third-Party Services</h2>
                <p className="mb-2">
                    We use Google Firebase for backend services, including authentication and database storage. Please review Google's Privacy Policy to understand how they handle your data.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3">5. Data Deletion</h2>
                <p className="mb-2">
                    You have the right to request deletion of your data. You can delete your account and all associated data directly within the application settings, or by contacting us at support@dailyhabittracker.club.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-xl font-semibold mb-3">6. Contact Us</h2>
                <p>
                    If you have any questions about this Privacy Policy, please contact us at <a href="mailto:support@dailyhabittracker.club" className="text-blue-600 hover:underline">support@dailyhabittracker.club</a>.
                </p>
            </section>
        </div>
    );
}

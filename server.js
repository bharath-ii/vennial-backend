const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { db } = require('./config/firebase'); // Initializes Firebase
const { connectRedis } = require('./config/redis');

// Load env vars
dotenv.config();

// Connect to databases
// MongoDB removed, Firebase initialized above
connectRedis();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS and expose custom headers
app.use(cors({
    exposedHeaders: ['X-Cache']
}));

// Basic Route for testing
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Find a Part (FAP) API' });
});

// Privacy Policy page for Google Play Console submission
app.get('/privacy', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Privacy Policy - Find a Part (FAP)</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #00b894;
            --primary-dark: #00997b;
            --primary-light: #e6f7f4;
            --text-main: #2d3436;
            --text-muted: #636e72;
            --bg-page: #f8fafc;
            --bg-card: #ffffff;
            --border-color: #e2e8f0;
        }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.75;
            color: var(--text-main);
            background-color: var(--bg-page);
            padding: 40px 20px;
        }
        .wrapper {
            max-width: 860px;
            margin: 0 auto;
            background: var(--bg-card);
            padding: 48px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
            border: 1px solid var(--border-color);
        }
        .header {
            border-bottom: 2px solid var(--primary-light);
            padding-bottom: 24px;
            margin-bottom: 36px;
        }
        .brand-badge {
            display: inline-block;
            background: var(--primary-light);
            color: var(--primary-dark);
            font-weight: 700;
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1px;
            padding: 6px 14px;
            border-radius: 20px;
            margin-bottom: 12px;
        }
        h1 {
            color: #1e293b;
            font-size: 32px;
            font-weight: 800;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
        }
        .meta-info {
            color: var(--text-muted);
            font-size: 14px;
        }
        h2 {
            color: #1e293b;
            font-size: 20px;
            font-weight: 700;
            margin-top: 36px;
            margin-bottom: 14px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        h2::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 20px;
            background-color: var(--primary);
            border-radius: 2px;
        }
        p {
            margin-bottom: 16px;
            color: #475569;
            font-size: 15px;
        }
        ul {
            margin-bottom: 20px;
            padding-left: 24px;
        }
        li {
            margin-bottom: 10px;
            color: #475569;
            font-size: 15px;
        }
        li strong {
            color: #1e293b;
        }
        .highlight-box {
            background-color: var(--primary-light);
            border-left: 4px solid var(--primary);
            padding: 20px;
            border-radius: 12px;
            margin: 24px 0;
        }
        .highlight-box p {
            margin-bottom: 0;
            color: #0f766e;
            font-weight: 500;
        }
        .contact-card {
            background-color: #f1f5f9;
            border: 1px solid #cbd5e1;
            border-radius: 16px;
            padding: 24px;
            margin-top: 32px;
        }
        .contact-card h3 {
            font-size: 18px;
            color: #0f172a;
            margin-bottom: 12px;
        }
        .contact-card p {
            margin-bottom: 8px;
            font-size: 14px;
        }
        a {
            color: var(--primary-dark);
            text-decoration: none;
            font-weight: 600;
        }
        a:hover {
            text-decoration: underline;
        }
        footer {
            margin-top: 48px;
            padding-top: 24px;
            border-top: 1px solid var(--border-color);
            text-align: center;
            font-size: 13px;
            color: var(--text-muted);
        }
        @media (max-width: 640px) {
            body { padding: 16px; }
            .wrapper { padding: 24px; border-radius: 14px; }
            h1 { font-size: 24px; }
            h2 { font-size: 18px; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <span class="brand-badge">Official Policy</span>
            <h1>Privacy Policy</h1>
            <p class="meta-info"><strong>Application:</strong> Find a Part (FAP) &bull; <strong>Publisher:</strong> Vennila Accessories &bull; <strong>Last Updated:</strong> July 24, 2026</p>
        </div>

        <p>Welcome to <strong>Find a Part (FAP)</strong> ("the App"), operated by <strong>Vennila Accessories</strong> ("we", "us", or "our"). We respect your privacy and are committed to protecting the personal data of all users, mobile repair technicians, and spare parts retailers who utilize our service.</p>

        <p>This Privacy Policy outlines how we collect, use, store, process, and protect your information when you download, register, or use the <strong>Find a Part (FAP)</strong> mobile application available on the Google Play Store.</p>

        <div class="highlight-box">
            <p>🔒 <strong>Zero Ads & Zero Data Selling:</strong> Find a Part (FAP) is completely ad-free. We do not track advertising identifiers, show banner or interstitial ads, or sell user data to third parties.</p>
        </div>

        <h2>1. Information We Collect</h2>
        <p>We collect only the minimum necessary information required to operate account authentication and compatibility search services efficiently:</p>
        <ul>
            <li><strong>Account Registration Information:</strong> When creating an account, we collect your Full Name, Email Address, Phone Number, and Shop Name.</li>
            <li><strong>Google Authentication (OAuth 2.0):</strong> If you choose to register or sign in via Google Sign-In, we collect your Google Display Name, Email Address, and Profile Picture URL to populate your user profile.</li>
            <li><strong>Enquiry & Support Requests:</strong> Information submitted when you use the in-app Enquiry feature to request compatibility data for missing device models.</li>
            <li><strong>Technical & App State Data:</strong> Session authentication tokens stored locally on your device via AsyncStorage to keep you logged in securely.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>Your information is processed strictly for legitimate business and operational purposes:</p>
        <ul>
            <li><strong>Account Provisioning & Security:</strong> To verify user identity, process login requests, and secure access to app features.</li>
            <li><strong>Accessory Compatibility Services:</strong> To deliver instant search results for screen guards, display combos, frames, batteries, CC boards, volume strips, and back cases.</li>
            <li><strong>In-App Notifications:</strong> To inform users of platform updates, new device additions, and feature releases.</li>
            <li><strong>Customer Support & Data Verification:</strong> To review submitted model enquiries and respond to user feedback.</li>
            <li><strong>Subscription Management:</strong> To manage Pro and Premium tier access.</li>
        </ul>

        <h2>3. Third-Party Service Providers</h2>
        <p>We partner with trusted industry-standard infrastructure providers to deliver our services. These providers have access to user data only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose:</p>
        <ul>
            <li><strong>Firebase (Google Cloud Platform):</strong> Provides secure user authentication services (Firebase Auth) and cloud database storage (Firestore). Data is encrypted in transit and at rest on Google Cloud infrastructure.</li>
            <li><strong>Google Play Billing & RevenueCat:</strong> Manages in-app purchases and subscription entitlements. Financial details (credit/debit cards) are handled directly by Google Play Store. We do not collect or store financial payment details on our servers.</li>
        </ul>

        <h2>4. Data Security & Storage Standards</h2>
        <p>We implement stringent security protocols to safeguard your personal data against unauthorized access, alteration, disclosure, or destruction:</p>
        <ul>
            <li>All communication between the App and backend servers is encrypted using <strong>HTTPS (TLS 1.3 / SSL)</strong>.</li>
            <li>Passwords are hashed using industry-standard <strong>bcrypt cryptographic hashing</strong> before storage.</li>
            <li>Database assets are safeguarded using granular Firebase Security Rules.</li>
        </ul>

        <h2>5. Data Retention Policy</h2>
        <p>We retain your personal data for as long as your account remains active or as needed to provide you with access to FAP services. If you choose to delete your account, your personal identification records will be permanently removed from our active databases within 30 business days.</p>

        <h2>6. Account & Data Deletion Requests</h2>
        <p>Users have the right to request full deletion of their account and all associated personal data at any time. To submit a data deletion request:</p>
        <p>Send an email to <a href="mailto:exceptionz13@gmail.com">exceptionz13@gmail.com</a> with the subject line <code>"Account Deletion Request"</code> from your registered email address. We will verify your identity and confirm deletion within 30 days.</p>

        <h2>7. Children's Privacy Protection</h2>
        <p>Find a Part (FAP) is designed for professional mobile repair technicians and retailers. The App is not intended for use by children under 13 years of age. We do not knowingly collect personal information from children. If we discover a child under 13 has provided personal data, we will delete it immediately.</p>

        <h2>8. User Rights & Data Protection</h2>
        <p>Depending on your jurisdiction, you possess the following rights regarding your personal information:</p>
        <ul>
            <li><strong>Right to Access:</strong> Request a copy of the personal data we store about you.</li>
            <li><strong>Right to Rectification:</strong> Request correction of incorrect or incomplete personal profile details.</li>
            <li><strong>Right to Erasure:</strong> Request permanent removal of your account and personal records.</li>
        </ul>

        <h2>9. Updates to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time to reflect changes in legal requirements or app features. Any changes will be posted on this page with an updated "Last Updated" date. Significant updates will be communicated through in-app notifications.</p>

        <div class="contact-card">
            <h3>Contact Information</h3>
            <p>For any questions, legal inquiries, or data privacy requests regarding Find a Part (FAP), please contact us at:</p>
            <p><strong>Email:</strong> <a href="mailto:exceptionz13@gmail.com">exceptionz13@gmail.com</a></p>
            <p><strong>Brand / Publisher:</strong> Vennila Accessories</p>
            <p><strong>Headquarters:</strong> Tamil Nadu, India</p>
        </div>

        <footer>
            &copy; 2026 Find a Part (FAP) &bull; A product of Vennila Accessories. All rights reserved.
        </footer>
    </div>
</body>
</html>
    `);
});



// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/users', require('./routes/users'));
app.use('/api/requests', require('./routes/requests'));
app.use('/api/enquiries', require('./routes/enquiries'));
app.use('/api/notifications', require('./routes/notifications'));

const PORT = process.env.PORT || 5000;

// Keep-alive logic for Render free tier
const https = require('https');
const keepAlive = () => {
    const url = process.env.RENDER_EXTERNAL_URL;
    if (url) {
        https.get(url, (res) => {
            console.log(`Keep-alive ping sent to ${url}. Status: ${res.statusCode}`);
        }).on('error', (err) => {
            console.error(`Keep-alive ping failed: ${err.message}`);
        });
    }
};

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    // Start keep-alive interval (every 12 minutes)
    if (process.env.NODE_ENV === 'production') {
        setInterval(keepAlive, 12 * 60 * 1000);
    }
});

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
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
        .container { background: #fff; padding: 30px; border-radius: 12px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        h1 { color: #00b894; border-bottom: 2px solid #00b894; padding-bottom: 10px; }
        h2 { color: #2d3436; margin-top: 24px; }
        ul { padding-left: 20px; }
        li { margin-bottom: 8px; }
        .contact { background: #e6f7f4; padding: 15px; border-radius: 8px; border-left: 4px solid #00b894; margin-top: 20px; }
        footer { margin-top: 30px; font-size: 0.9em; color: #777; text-align: center; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Privacy Policy for Find a Part (FAP)</h1>
        <p><strong>Effective Date:</strong> July 24, 2026</p>
        <p><strong>Find a Part (FAP)</strong> ("we", "our", or "us"), a product of <strong>Vennila Accessories</strong>, is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.</p>

        <h2>1. Information We Collect</h2>
        <p>When you register and use Find a Part (FAP), we may collect the following personal information:</p>
        <ul>
            <li><strong>Personal Identification:</strong> Full Name, Email Address, Phone Number, and Shop Name.</li>
            <li><strong>Google Profile Info:</strong> If you sign in via Google, we collect your Google Name, Email Address, and Profile Picture.</li>
            <li><strong>Device & Usage Information:</strong> Search history within the app to display compatible device accessories.</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the collected information for the following purposes:</p>
        <ul>
            <li>To create and manage your user account.</li>
            <li>To provide mobile spare parts compatibility search services.</li>
            <li>To send important app updates and notifications.</li>
            <li>To respond to user inquiries and support requests.</li>
        </ul>

        <h2>3. Advertisements & Data Selling</h2>
        <p><strong>Find a Part (FAP) is completely ad-free.</strong> We do not display third-party advertisements, we do not track advertising identifiers, and we <strong>NEVER sell, rent, or trade your personal data</strong> to third parties.</p>

        <h2>4. Third-Party Services</h2>
        <p>We utilize trusted third-party service providers solely to operate our app:</p>
        <ul>
            <li><strong>Firebase (Google Cloud):</strong> For secure authentication and database storage.</li>
            <li><strong>Google Play Billing & RevenueCat:</strong> For secure in-app subscription processing. We do not store or handle any credit/debit card information.</li>
        </ul>

        <h2>5. Data Security & Storage</h2>
        <p>Your information is stored securely on encrypted Google Cloud / Firebase servers. We implement appropriate administrative, technical, and physical security measures to protect your personal data from unauthorized access or disclosure.</p>

        <h2>6. Account & Data Deletion Requests</h2>
        <p>You have the right to request the deletion of your account and associated personal data at any time. To request data deletion, please contact us at <a href="mailto:exceptionz13@gmail.com">exceptionz13@gmail.com</a> with your registered email address.</p>

        <h2>7. Contact Us</h2>
        <div class="contact">
            <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
            <p><strong>Email:</strong> exceptionz13@gmail.com</p>
            <p><strong>Company:</strong> Vennila Accessories</p>
            <p><strong>Location:</strong> Tamil Nadu, India</p>
        </div>
        <footer>
            &copy; 2026 Find a Part (FAP) — A product of Vennila Accessories. All rights reserved.
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

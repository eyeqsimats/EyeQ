const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Ensure you have a serviceAccountKey.json in the backend root or config folder
// For now, we'll try to use application default credentials or a path from env
// To allow easy setup, we will check for a local file.

let serviceAccount;
try {
    serviceAccount = require('../serviceAccountKey.json');
} catch (e) {
    console.log("No serviceAccountKey.json found. Make sure to add it for admin access.");
}

if (serviceAccount) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
} else {
    // Fallback or error
    console.log("Initializing Firebase Admin without explicit creds (might fail locally if not logged in via CLI)");
    admin.initializeApp();
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { admin, db, auth };

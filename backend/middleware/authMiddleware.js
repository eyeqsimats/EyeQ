const { auth } = require('../config/firebase');

const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decodedToken = await auth.verifyIdToken(token);
            req.user = decodedToken; // Firebase token info: uid, email, etc.

            // Optionally fetch custom claims or extra info from Firestore if needed
            // But for basic auth, uid is enough.
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

// Check admin role
// We can use custom claims or check Firestore "users" collection
const admin = async (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });

    // Option 1: Custom Claims (Best for Firebase) - assuming we set them
    // if (req.user.admin) return next();

    // Option 2: Check Firestore (Slower but matches our "User" schema approach)
    const { db } = require('../config/firebase');
    try {
        const userDoc = await db.collection('users').doc(req.user.uid).get();
        if (userDoc.exists && userDoc.data().role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Not authorized as an admin' });
        }
    } catch (e) {
        res.status(500).json({ message: 'Server check failed' });
    }
};

module.exports = { protect, admin };

const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get user profile by ID
// @route   GET /api/users/profile/:id
// @access  Private
router.get('/profile/:id', protect, async (req, res) => {
    try {
        const userDoc = await db.collection('users').doc(req.params.id).get();
        if (userDoc.exists) {
            res.json({ id: userDoc.id, ...userDoc.data() });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const uid = req.user.uid;
        const updates = req.body;

        // Prevent changing critical fields like email/role via this endpoint freely if not validated
        // For simplicity, allowed.
        // Remove token/password from updates if present (handled by Firebase Auth)
        delete updates.password;
        delete updates.token;

        await db.collection('users').doc(uid).set(updates, { merge: true });

        const updatedDoc = await db.collection('users').doc(uid).get();
        res.json({ id: updatedDoc.id, ...updatedDoc.data() });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Sync user from Frontend (create if not exists)
// @route POST /api/users/sync
router.post('/sync', protect, async (req, res) => {
    try {
        const uid = req.user.uid;
        const { email, name } = req.body;

        const userRef = db.collection('users').doc(uid);
        const doc = await userRef.get();

        if (!doc.exists) {
            await userRef.set({
                name,
                email,
                role: 'member',
                joinedDate: new Date().toISOString(),
                stats: {
                    totalProjects: 0,
                    approvedProjects: 0,
                    pendingProjects: 0,
                    rejectedProjects: 0,
                    currentStreak: 0,
                    longestStreak: 0
                }
            });
        }
        res.status(200).json({ message: 'Synced' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

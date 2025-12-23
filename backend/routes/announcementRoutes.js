const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get latest announcement
// @route   GET /api/announcements/latest
// @access  Public (or Protected, but usually Public for members)
router.get('/latest', protect, async (req, res) => {
    try {
        const snapshot = await db.collection('announcements')
            .orderBy('createdAt', 'desc')
            .limit(1)
            .get();

        if (snapshot.empty) {
            return res.json({ message: null });
        }

        const doc = snapshot.docs[0];
        res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Admin only
router.post('/', protect, async (req, res) => {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized' });
    }

    const { message } = req.body;

    try {
        const newAnnouncement = {
            message,
            authorUid: req.user.uid,
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('announcements').add(newAnnouncement);
        res.status(201).json({ id: docRef.id, ...newAnnouncement });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

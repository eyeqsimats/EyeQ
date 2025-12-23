const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get my achievements
// @route   GET /api/achievements/my
router.get('/my', protect, async (req, res) => {
    try {
        const snapshot = await db.collection('achievements')
            .where('userUid', '==', req.user.uid)
            .orderBy('awardedAt', 'desc')
            .get();

        const achievements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(achievements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Award achievement to user
// @route   POST /api/achievements
// @access  Admin only
router.post('/', protect, async (req, res) => {
    const adminDoc = await db.collection('users').doc(req.user.uid).get();
    if (!adminDoc.exists || adminDoc.data().role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized' });
    }

    const { targetUserId, title, type, description, icon } = req.body;

    try {
        const newAchievement = {
            userUid: targetUserId,
            title,
            type, // 'badge', 'certificate', 'winner'
            description,
            icon, // 'trophy', 'star', 'medal', 'ribbon'
            awardedAt: new Date().toISOString(),
            awardedBy: req.user.uid
        };

        const docRef = await db.collection('achievements').add(newAchievement);
        res.status(201).json({ id: docRef.id, ...newAchievement });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

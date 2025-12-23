const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, async (req, res) => {
    const { type, message, rating } = req.body;

    try {
        // Fetch user details to attach name
        const userDoc = await db.collection('users').doc(req.user.uid).get();
        const userData = userDoc.exists ? userDoc.data() : {};

        await db.collection('feedback').add({
            userUid: req.user.uid,
            userName: userData.name || req.user.name || 'Member',
            userEmail: userData.email || req.user.email,
            type,
            message,
            rating,
            resolved: false,
            createdAt: new Date().toISOString()
        });

        res.status(201).json({ message: 'Feedback submitted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Reply to feedback/query
// @route PUT /api/feedback/:id/reply
router.put('/:id/reply', protect, async (req, res) => {
    // Check admin
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized' });
    }

    const { reply } = req.body;

    try {
        await db.collection('feedback').doc(req.params.id).update({
            reply,
            repliedAt: new Date().toISOString(),
            status: 'replied',
            resolved: true
        });
        res.json({ message: 'Reply sent' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Get my feedback/queries
// @route GET /api/feedback/my
router.get('/my', protect, async (req, res) => {
    try {
        const snapshot = await db.collection('feedback')
            .where('userUid', '==', req.user.uid)
            .orderBy('createdAt', 'desc')
            .get();

        const feedback = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

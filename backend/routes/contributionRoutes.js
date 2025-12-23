const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, async (req, res) => {
    const { description } = req.body;
    const today = new Date();

    try {
        const newContribution = {
            userUid: req.user.uid,
            description,
            date: today.toISOString()
        };

        const docRef = await db.collection('contributions').add(newContribution);

        // Streak Logic
        const userRef = db.collection('users').doc(req.user.uid);
        const userDoc = await userRef.get();
        const userData = userDoc.data();

        let newStreak = userData.stats?.currentStreak || 0;
        const lastDate = userData.stats?.lastContribution ? new Date(userData.stats.lastContribution) : null;
        let currentStreakStartDate = userData.stats?.currentStreakStartDate ? new Date(userData.stats.currentStreakStartDate) : null;
        let longestStreak = userData.stats?.longestStreak || 0;
        let longestStreakStartDate = userData.stats?.longestStreakStartDate ? new Date(userData.stats.longestStreakStartDate) : null;
        let longestStreakEndDate = userData.stats?.longestStreakEndDate ? new Date(userData.stats.longestStreakEndDate) : null;

        if (lastDate) {
            const isSameDay = lastDate.toDateString() === today.toDateString();
            const isYesterday = new Date(new Date().setDate(today.getDate() - 1)).toDateString() === lastDate.toDateString();

            if (!isSameDay) {
                if (isYesterday) {
                    newStreak++;
                    // If continuing streak but no start date tracked, back-calculate roughly or set to today if streak was 0? 
                    // Ideally we keep the old one. If null, we might set it to (today - newStreak + 1) days ago.
                    if (!currentStreakStartDate) {
                        const tempDate = new Date(today);
                        tempDate.setDate(today.getDate() - (newStreak - 1));
                        currentStreakStartDate = tempDate;
                    }
                } else {
                    newStreak = 1;
                    currentStreakStartDate = today;
                }
            }
        } else {
            newStreak = 1;
            currentStreakStartDate = today;
        }

        // Update Longest Streak
        if (newStreak > longestStreak) {
            longestStreak = newStreak;
            // For a new longest streak, the start date is the current streak's start date
            // The end date is today (since we just extended it)
            longestStreakStartDate = currentStreakStartDate;
            longestStreakEndDate = today;
        }

        await userRef.set({
            stats: {
                currentStreak: newStreak,
                longestStreak: longestStreak,
                lastContribution: today.toISOString(),
                currentStreakStartDate: currentStreakStartDate ? currentStreakStartDate.toISOString() : null,
                longestStreakStartDate: longestStreakStartDate ? longestStreakStartDate.toISOString() : null,
                longestStreakEndDate: longestStreakEndDate ? longestStreakEndDate.toISOString() : null
            }
        }, { merge: true });

        res.status(201).json({ id: docRef.id, ...newContribution, streak: newStreak });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/my', protect, async (req, res) => {
    try {
        const snapshot = await db.collection('contributions')
            .where('userUid', '==', req.user.uid)
            .orderBy('date', 'desc')
            .limit(50)
            .get();

        const contributions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.json(contributions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

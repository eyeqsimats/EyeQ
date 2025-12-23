const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebase'); // Need admin for deleteUser
const { protect } = require('../middleware/authMiddleware');

// @desc Get Detailed Analytics
// @route GET /api/admin/analytics
router.get('/analytics', protect, async (req, res) => {
    // Check admin
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized' });
    }

    try {
        const projectsSnap = await db.collection('projects').get();
        const usersSnap = await db.collection('users').get();
        const feedbackSnap = await db.collection('feedback').get();

        const projects = projectsSnap.docs.map(d => d.data());
        const users = usersSnap.docs.map(d => d.data());
        const feedback = feedbackSnap.docs.map(d => d.data());

        // Project Status Distribution
        const projectStatus = { approved: 0, pending: 0, rejected: 0 };
        projects.forEach(p => {
            if (projectStatus[p.status] !== undefined) projectStatus[p.status]++;
        });

        // User Roles
        const userRoles = { admin: 0, member: 0 };
        users.forEach(u => {
            const role = u.role || 'member';
            if (userRoles[role] !== undefined) userRoles[role]++;
        });

        // Feedback Sentiment (Simple mock based on rating)
        const feedbackSentiment = { positive: 0, neutral: 0, negative: 0 };
        feedback.forEach(f => {
            if (f.rating >= 4) feedbackSentiment.positive++;
            else if (f.rating === 3) feedbackSentiment.neutral++;
            else feedbackSentiment.negative++;
        });

        // Trends (Last 7 Days Projects)
        const last7Days = [...Array(7)].map((_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - i);
            return d.toISOString().split('T')[0];
        }).reverse();

        const projectTrends = last7Days.map(date => ({
            date,
            count: projects.filter(p => p.createdAt && p.createdAt.startsWith(date)).length
        }));

        res.json({
            projectStatus: [
                { name: 'Approved', value: projectStatus.approved, fill: '#22c55e' },
                { name: 'Pending', value: projectStatus.pending, fill: '#eab308' },
                { name: 'Rejected', value: projectStatus.rejected, fill: '#ef4444' }
            ],
            userRoles: [
                { name: 'Admins', value: userRoles.admin, fill: '#8b5cf6' },
                { name: 'Members', value: userRoles.member, fill: '#3b82f6' }
            ],
            projectTrends,
            feedbackSentiment: [
                { name: 'Positive', value: feedbackSentiment.positive, fill: '#22c55e' },
                { name: 'Neutral', value: feedbackSentiment.neutral, fill: '#eab308' },
                { name: 'Negative', value: feedbackSentiment.negative, fill: '#ef4444' }
            ]
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Get Stats
// @route GET /api/admin/stats
router.get('/stats', protect, async (req, res) => {
    // Check admin
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized as admin' });
    }

    try {
        // Firestore Aggregation
        const usersSnap = await db.collection('users').count().get();
        const projectsSnap = await db.collection('projects').count().get();

        // Leaderboard
        const leaderboardSnap = await db.collection('users')
            .orderBy('stats.currentStreak', 'desc')
            .limit(10)
            .get();

        const leaderboard = leaderboardSnap.docs.map(d => ({ name: d.data().name, currentStreak: d.data().stats?.currentStreak }));

        res.json({
            totalMembers: usersSnap.data().count,
            totalProjects: projectsSnap.data().count,
            dailyActiveUsers: 0,
            streakLeaderboard: leaderboard
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Get all users
// @route GET /api/admin/users
router.get('/users', protect, async (req, res) => {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized as admin' });
    }

    try {
        const snap = await db.collection('users').limit(100).get();
        res.json(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Get all projects (Admin - All Statuses)
// @route GET /api/admin/projects
router.get('/projects', protect, async (req, res) => {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized as admin' });
    }

    try {
        const snapshot = await db.collection('projects').orderBy('createdAt', 'desc').limit(100).get();
        const projects = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Get all feedback
// @route GET /api/admin/feedback
router.get('/feedback', protect, async (req, res) => {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized as admin' });
    }

    try {
        const snapshot = await db.collection('feedback').orderBy('createdAt', 'desc').limit(50).get();
        res.json(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Delete user
// @route DELETE /api/admin/users/:id
router.delete('/users/:id', protect, async (req, res) => {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized' });
    }

    try {
        // Delete from Auth
        await admin.auth().deleteUser(req.params.id);
        // Delete from Firestore
        await db.collection('users').doc(req.params.id).delete();
        res.json({ message: 'User deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Admin Update User (incl. Streaks)
// @route PUT /api/admin/users/:id
router.put('/users/:id', protect, async (req, res) => {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized' });
    }

    try {
        const { name, bio, skills, currentStreak, longestStreak } = req.body;
        const updates = {
            name,
            bio,
            skills: Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim())
        };

        // Handle stats update if provided
        if (currentStreak !== undefined || longestStreak !== undefined) {
            updates['stats.currentStreak'] = Number(currentStreak);
            updates['stats.longestStreak'] = Number(longestStreak);
        }

        await db.collection('users').doc(req.params.id).set(updates, { merge: true });
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc Admin Update Project Details
// @route PUT /api/admin/projects/:id
router.put('/projects/:id', protect, async (req, res) => {
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized' });
    }

    try {
        const { title, description, repoLink, demoLink, linkedInPostLink } = req.body;
        await db.collection('projects').doc(req.params.id).update({
            title,
            description,
            repoLink,
            demoLink,
            linkedInPostLink
        });
        res.json({ message: 'Project updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const { db, admin } = require('../config/firebase');
const { protect } = require('../middleware/authMiddleware');

// Helper to get doc data with ID
const getDocData = (doc) => ({ id: doc.id, ...doc.data() });

// @desc    Get all projects (public/approved)
// @route   GET /api/projects
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('projects')
            .where('status', '==', 'approved')
            .limit(20)
            .get();

        const projects = snapshot.docs.map(getDocData);
        res.json({ projects });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get my projects
// @route   GET /api/projects/myprojects
router.get('/myprojects', protect, async (req, res) => {
    try {
        const snapshot = await db.collection('projects')
            .where('authorUid', '==', req.user.uid)
            .get();
        const projects = snapshot.docs.map(getDocData);
        res.json(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a project
// @route   POST /api/projects
router.post('/', protect, async (req, res) => {
    const { title, description, repoLink, demoLink, linkedInPostLink } = req.body;

    try {
        const newProject = {
            title,
            description,
            repoLink,
            demoLink,
            linkedInPostLink: linkedInPostLink || '',
            authorUid: req.user.uid,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('projects').add(newProject);

        // Update user stats (increment pending)
        const userRef = db.collection('users').doc(req.user.uid);
        await userRef.set({
            stats: {
                totalProjects: admin.firestore.FieldValue.increment(1),
                pendingProjects: admin.firestore.FieldValue.increment(1)
            }
        }, { merge: true });

        res.status(201).json({ id: docRef.id, ...newProject });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update project status (Admin)
// @route   PUT /api/projects/:id/status
router.put('/:id/status', protect, async (req, res) => {
    // Check admin
    const userDoc = await db.collection('users').doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== 'admin') {
        return res.status(401).json({ message: 'Not authorized as admin' });
    }

    const { status, adminFeedback } = req.body;

    try {
        const projectRef = db.collection('projects').doc(req.params.id);
        const projectDoc = await projectRef.get();

        if (!projectDoc.exists) return res.status(404).json({ message: 'Project not found' });

        const oldStatus = projectDoc.data().status;
        const authorUid = projectDoc.data().authorUid;

        await projectRef.update({
            status,
            adminFeedback: adminFeedback || projectDoc.data().adminFeedback || ''
        });

        // Update stats if changed
        if (oldStatus !== status) {
            const userRef = db.collection('users').doc(authorUid);
            // Logic to decrement old, increment new.
            // Firestore increment/decrement is easiest.
            // But we need safe conditional updates. 
            // For simplicity, we just do it.

            let updates = {};
            // Helper for dynamic keys not easy in simple object literal used in update with variable keys
            // Use map convention or IFs.

            // NOT ATOMIC here without transaction, but fine for MVP

            // We can read user, modify, write back.
            const uInfo = await userRef.get();
            if (uInfo.exists) {
                const stats = uInfo.data().stats || {};
                if (oldStatus === 'pending') stats.pendingProjects = (stats.pendingProjects || 0) - 1;
                if (oldStatus === 'approved') stats.approvedProjects = (stats.approvedProjects || 0) - 1;
                if (oldStatus === 'rejected') stats.rejectedProjects = (stats.rejectedProjects || 0) - 1;

                if (status === 'pending') stats.pendingProjects = (stats.pendingProjects || 0) + 1;
                if (status === 'approved') stats.approvedProjects = (stats.approvedProjects || 0) + 1;
                if (status === 'rejected') stats.rejectedProjects = (stats.rejectedProjects || 0) + 1;

                await userRef.update({ stats });
            }
        }

        res.json({ message: 'Status updated' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

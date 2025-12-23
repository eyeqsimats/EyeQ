const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { db } = require('./config/firebase'); // Just to ensure it loads

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// We skip authRoutes because login is handled on frontend. 
// We might keep a route to sync user data if needed, but normally frontend writes to firestore directly or backend trigger.
// However, the prompt asked for "backend implementation". So we will still have API endpoints 
// that usage Firebase Admin to read/write Firestore, protected by Middleware.

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/contributions', require('./routes/contributionRoutes'));
app.use('/api/feedback', require('./routes/feedbackRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/announcements', require('./routes/announcementRoutes'));
app.use('/api/achievements', require('./routes/achievementRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

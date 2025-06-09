const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Container Yard API Working"));

const lotRoutes = require('./routes/lotStatus');
app.use('/api/lots', lotRoutes);
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const checkinRoutes = require('./routes/checkin');
app.use('/api/checkin', checkinRoutes);
const checkinsRoutes = require('./routes/checkin');
app.use('/api/checkins', checkinsRoutes);
const analyticsRoutes = require('./routes/analytics');
app.use('/api/analytics', analyticsRoutes);
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);
const lotStatusRoutes = require('./routes/lotStatus');
app.use('/api/lots', lotStatusRoutes); // Now supports /api/lots/status

module.exports = app;
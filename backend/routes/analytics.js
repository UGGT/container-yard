const router = require('express').Router();
const db = require('../config/db');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// ✅ GET /api/analytics/summary
router.get('/summary', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const incomingResult = await db.query(`SELECT COUNT(*) FROM checkins WHERE type = 'incoming'`);
    const outgoingResult = await db.query(`SELECT COUNT(*) FROM checkins WHERE type = 'outgoing'`);
    const todayResult = await db.query(`SELECT COUNT(*) FROM checkins WHERE DATE(timestamp) = CURRENT_DATE`);

    const avgDuration = await db.query(`
      SELECT AVG(EXTRACT(EPOCH FROM (c2.timestamp - c1.timestamp))) AS avg_seconds
      FROM checkins c1
      JOIN checkins c2 ON c1.container_number = c2.container_number
      WHERE c1.type = 'incoming' AND c2.type = 'outgoing'
    `);

    res.json({
      totalToday: parseInt(todayResult.rows[0].count),
      incoming: parseInt(incomingResult.rows[0].count),
      outgoing: parseInt(outgoingResult.rows[0].count),
      avgDurationSeconds: parseFloat(avgDuration.rows[0].avg_seconds || 0),
    });
  } catch (err) {
    console.error('Summary Error:', err);
    res.status(500).json({ message: 'Failed to fetch summary' });
  }
});

// ✅ GET /api/analytics/crane-activity
router.get('/crane-activity', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const result = await db.query(`
      SELECT u.name AS operator, COUNT(*) AS moves
      FROM checkins c
      JOIN users u ON c.user_id = u.id
      WHERE u.role = 'crane_operator'
      GROUP BY u.name
      ORDER BY moves DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('Crane Activity Error:', err);
    res.status(500).json({ message: 'Failed to fetch crane activity' });
  }
});

// ✅ GET /api/analytics/search?container=ABC123
router.get('/search', verifyToken, requireRole('admin'), async (req, res) => {
  const { container } = req.query;
  if (!container) return res.status(400).json({ message: 'Container number is required' });

  try {
    const result = await db.query(
      `SELECT * FROM checkins WHERE container_number ILIKE $1 ORDER BY timestamp DESC`,
      [`%${container}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Search Error:', err);
    res.status(500).json({ message: 'Failed to search container' });
  }
});

// ✅ GET /api/analytics/7day-trend
router.get('/7day-trend', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const result = await db.query(`
      SELECT DATE(timestamp) AS day, COUNT(*) AS total
      FROM checkins
      WHERE timestamp >= CURRENT_DATE - INTERVAL '6 days'
      GROUP BY day
      ORDER BY day ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error('7-Day Trend Error:', err);
    res.status(500).json({ message: 'Failed to load 7-day trend' });
  }
});

module.exports = router;
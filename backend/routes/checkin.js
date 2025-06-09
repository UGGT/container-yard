const express = require('express');
const router = express.Router();
const checkinController = require('../controllers/checkinController');
const db = require("../config/db");
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

// Secure check-in routes
router.post('/incoming', verifyToken, checkinController.incoming);
router.post('/outgoing', verifyToken, checkinController.outgoing);

// Containers currently in yard
router.get('/in-yard', verifyToken, requireRole('crane_operator'), checkinController.getAllIncomingInYard);

// Public check-in logs with filters + pagination
router.get("/", async (req, res) => {
  const { type, lot, container, startDate, endDate, page = 1, limit = 10 } = req.query;
  const conditions = [];
  const values = [];

  if (type) {
    values.push(type);
    conditions.push(`type = $${values.length}`);
  }
  if (lot) {
    values.push(lot);
    conditions.push(`assigned_lot = $${values.length}`);
  }
  if (container) {
    values.push(`%${container}%`);
    conditions.push(`container_number ILIKE $${values.length}`);
  }
  if (startDate) {
    values.push(startDate);
    conditions.push(`timestamp >= $${values.length}`);
  }
  if (endDate) {
    values.push(endDate);
    conditions.push(`timestamp <= $${values.length}`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";
  const limitVal = parseInt(limit);
  const offsetVal = (parseInt(page) - 1) * limitVal;

  try {
    const dataResult = await db.query(
      `SELECT * FROM checkins ${whereClause} ORDER BY timestamp DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
      [...values, limitVal, offsetVal]
    );
    const countResult = await db.query(`SELECT COUNT(*) FROM checkins ${whereClause}`, values);
    res.json({
      logs: dataResult.rows,
      total: parseInt(countResult.rows[0].count, 10),
      totalPages: Math.ceil(countResult.rows[0].count / limitVal)
    });
  } catch (err) {
    console.error("Failed to fetch check-ins:", err);
    res.status(500).json({ message: "Failed to fetch check-ins" });
  }
});

// Assigned containers to crane operator
router.get('/assigned', verifyToken, requireRole('crane_operator'), async (req, res) => {
  try {
    const result = await db.query(`
      SELECT * FROM checkins
      WHERE user_id = $1 AND completed IS NOT TRUE
      ORDER BY timestamp DESC
    `, [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching assigned containers:', err);
    res.status(500).json({ message: 'Failed to fetch assigned containers' });
  }
});

// Mark complete
router.patch('/:id/complete', verifyToken, requireRole('crane_operator'), async (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) return res.status(400).json({ message: 'Invalid container ID' });

  try {
    await db.query(`UPDATE checkins SET completed = TRUE WHERE id = $1`, [id]);
    res.json({ message: 'Marked complete' });
  } catch (err) {
    console.error('Error marking complete:', err);
    res.status(500).json({ message: 'Failed to mark complete' });
  }
});

module.exports = router;
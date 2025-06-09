const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { getIo } = require('../services/socketService');

// ✅ Get all lot statuses
router.get('/status', async (req, res) => {
  try {
    const result = await db.query('SELECT lot_code, is_occupied FROM yard_lots ORDER BY lot_code');
    res.json(result.rows);
  } catch (err) {
    console.error("Lot Status Error:", err);
    res.status(500).json({ message: 'Failed to fetch lot status' });
  }
});

// ✅ Mark lot as available
router.patch('/:lotCode/clear', async (req, res) => {
  const { lotCode } = req.params;
  try {
    await db.query('UPDATE yard_lots SET is_occupied = false WHERE lot_code = $1', [lotCode]);

    const io = getIo();
    io.emit('lot_update', { lotCode, isOccupied: false });

    res.json({ message: `Lot ${lotCode} marked as available` });
  } catch (err) {
    console.error("Clear Lot Error:", err);
    res.status(500).json({ message: 'Failed to update lot status' });
  }
});

// ✅ Force Occupy
router.patch('/:lotCode/occupy', async (req, res) => {
  const { lotCode } = req.params;
  try {
    await db.query('UPDATE yard_lots SET is_occupied = true WHERE lot_code = $1', [lotCode]);

    const io = getIo();
    io.emit('lot_update', { lotCode, isOccupied: true });

    res.json({ message: `Lot ${lotCode} forcibly occupied` });
  } catch (err) {
    console.error("Occupy Lot Error:", err);
    res.status(500).json({ message: 'Failed to update lot status' });
  }
});

module.exports = router;
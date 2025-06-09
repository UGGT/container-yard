const router = require('express').Router();
const db = require('../config/db');
const { verifyToken, requireRole } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, requireRole('admin'), async (req, res) => {
  try {
    const result = await db.query(
      'SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

module.exports = router;
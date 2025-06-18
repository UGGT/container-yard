const db = require('../config/db');

// Get one available lot
exports.findAvailableLot = async () => {
  const result = await db.query(
    'SELECT lot_code FROM yard_lots WHERE is_occupied = false LIMIT 1'
  );
  return result.rows[0]?.lot_code || null;
};

// Mark lot as occupied
exports.markLotOccupied = async (lotCode) => {
  const result = await db.query(
    'UPDATE yard_lots SET is_occupied = true, updated_at = NOW() WHERE lot_code = $1',
    [lotCode]
  );
  if (result.rowCount === 0) {
    console.warn(`⚠️ Failed to mark lot as occupied: ${lotCode}`);
  }
};

// Mark lot as available
exports.markLotAvailable = async (lotCode) => {
  const result = await db.query(
    'UPDATE yard_lots SET is_occupied = false, updated_at = NOW() WHERE lot_code = $1',
    [lotCode]
  );
  if (result.rowCount === 0) {
    console.warn(`⚠️ Failed to mark lot as available: ${lotCode}`);
  }
};

// Get all lots (optional utility)
exports.getAllLots = async () => {
  return db.query('SELECT * FROM yard_lots ORDER BY lot_code');
};
const db = require('../config/db');

async function syncLotOccupancy() {
  try {
    // Reset all lots to available
    await db.query(`UPDATE yard_lots SET is_occupied = false`);

    // Re-occupy lots based on last incoming checkin
    const res = await db.query(`
      SELECT DISTINCT ON (assigned_lot) assigned_lot
      FROM checkins
      WHERE type = 'incoming' AND completed = false
      ORDER BY assigned_lot, timestamp DESC
    `);

    const lotsToOccupy = res.rows.map(row => row.assigned_lot);

    for (let lot of lotsToOccupy) {
      await db.query(
        `UPDATE yard_lots SET is_occupied = true WHERE lot_code = $1`,
        [lot]
      );
      console.log(`✅ Marked ${lot} as occupied`);
    }

    console.log("✅ Sync complete.");
    process.exit();
  } catch (err) {
    console.error("❌ Sync failed:", err);
    process.exit(1);
  }
}

syncLotOccupancy();
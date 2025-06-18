const { logCheckin } = require('../models/checkinModel');
const {
  findAvailableLot,
  markLotOccupied,
  markLotAvailable
} = require('../models/yardLotModel');
const { notifyCraneOperator, notifyDriver } = require('../services/notificationService');
const db = require('../config/db');

// 🚚 Incoming Container Check-In
exports.incoming = async (req, res) => {
  const {
    containerNumber,
    transportName,
    driverName,
    driverPhone,
    transportPhone,
  } = req.body;

  console.log("📦 Incoming Check-in Request:", {
    containerNumber,
    transportName,
    driverName,
    driverPhone,
    transportPhone,
  });

  if (!containerNumber || !transportName || !driverName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const assignedLot = await findAvailableLot();
    console.log("✅ Available lot:", assignedLot);

    if (!assignedLot) {
      return res.status(503).json({ message: "No available lots right now" });
    }

    await markLotOccupied(assignedLot);
    console.log("🔒 Marked lot as occupied:", assignedLot);

    let craneOperatorId = req.user?.id;
    if (!craneOperatorId) {
      const opRes = await db.query("SELECT id FROM users WHERE role = 'crane_operator' LIMIT 1");
      if (opRes.rows.length > 0) {
        craneOperatorId = opRes.rows[0].id;
        console.log("👷 Assigned crane operator:", craneOperatorId);
      } else {
        console.warn("⚠️ No crane_operator found in users table.");
      }
    }

    const log = await logCheckin({
      type: 'incoming',
      container_number: containerNumber,
      driver_name: driverName,
      transport_name: transportName,
      assigned_lot: assignedLot,
      user_id: craneOperatorId,
      driver_phone: driverPhone,
      transport_phone: transportPhone,
    });

    console.log("✅ Logged check-in:", log?.id || 'OK');

    // App-based Notification
    notifyDriver({ containerNumber, lotCode: assignedLot });
    notifyCraneOperator({ containerNumber, lotCode: assignedLot, type: 'incoming' });

    // SMS Notification Placeholder
    if (driverPhone) {
      console.log(`📲 [Mock SMS to Driver] Container ${containerNumber}: Proceed to Lot ${assignedLot}`);
      // sendSMS(driverPhone, `Proceed to Lot ${assignedLot} for container ${containerNumber}`);
    }
    if (transportPhone) {
      console.log(`📲 [Mock SMS to Transport] Container ${containerNumber} checked in, Lot ${assignedLot}`);
      // sendSMS(transportPhone, `Container ${containerNumber} assigned to Lot ${assignedLot}`);
    }

    const io = req.app.get('io');
    if (io) {
      io.emit('lot_update', {
        event: 'incoming_checkin',
        lotCode: assignedLot,
        status: 'occupied',
        containerNumber,
        driverName,
        transportName,
      });
    }

    return res.json({ status: 'incoming_registered', assignedLot, log });

  } catch (err) {
    console.error("❌ Incoming Check-In Error:", err.stack || err);
    return res.status(500).json({ message: "Internal server error", details: err.message });
  }
};

// 🚛 Outgoing Container Check-In
exports.outgoing = async (req, res) => {
  const { containerNumber, driverName, transportName } = req.body;

  console.log("📤 Outgoing Check-in Request:", { containerNumber, driverName, transportName });

  if (!containerNumber || !driverName || !transportName) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const existing = await db.query(
      'SELECT * FROM checkins WHERE container_number = $1 AND type = $2 ORDER BY timestamp DESC LIMIT 1',
      [containerNumber, 'incoming']
    );

    if (existing.rows.length === 0) {
      return res.status(404).json({ message: "Container not found or not yet checked in" });
    }

    const assignedLot = existing.rows[0].assigned_lot;
    console.log("✅ Found assigned lot for outgoing:", assignedLot);

    const log = await logCheckin({
      type: 'outgoing',
      container_number: containerNumber,
      driver_name: driverName,
      transport_name: transportName,
      assigned_lot: assignedLot,
      user_id: req.user?.id,
    });

    // ✅ Mark the lot as available again
    await markLotAvailable(assignedLot);
    console.log("🔓 Marked lot as available:", assignedLot);

    notifyDriver({ containerNumber, lotCode: assignedLot });
    notifyCraneOperator({ containerNumber, lotCode: assignedLot, type: 'outgoing' });

    const io = req.app.get('io');
    if (io) {
      io.emit('lot_update', {
        event: 'outgoing_checkin',
        lotCode: assignedLot,
        status: 'available',
        containerNumber,
        driverName,
        transportName,
      });
    }

    return res.json({
      status: 'outgoing_registered',
      assignedLot,
      guest: !req.user,
      log,
    });

  } catch (err) {
    console.error("🔥 Outgoing Check-In Error:", err.stack || err);
    return res.status(500).json({ message: "Internal server error", details: err.message });
  }
};

// 📋 View all containers currently in yard (incoming and not completed)
exports.getAllIncomingInYard = async (req, res) => {
  try {
    const result = await db.query(
      `SELECT container_number, assigned_lot, driver_name, transport_name, timestamp
       FROM checkins
       WHERE type = 'incoming' AND completed = FALSE
       ORDER BY timestamp DESC`
    );
    return res.json(result.rows);
  } catch (err) {
    console.error("🛑 Error fetching yard containers:", err.stack || err);
    return res.status(500).json({ message: "Failed to fetch containers in yard" });
  }
};
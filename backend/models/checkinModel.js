const db = require('../config/db');

exports.logCheckin = async ({ type, container_number, driver_name, transport_name, assigned_lot, user_id }) => {
  const result = await db.query(
    `INSERT INTO checkins (type, container_number, driver_name, transport_name, assigned_lot, user_id)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [type, container_number, driver_name, transport_name, assigned_lot, user_id || null]
  );
  return result.rows[0];
};
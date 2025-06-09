const { findAvailableLot } = require('../models/yardLotModel');

exports.getAvailableLot = async (req, res) => {
  try {
    const lotCode = await findAvailableLot();
    if (!lotCode) {
      return res.status(404).json({ message: 'No available lots' });
    }
    res.json({ lotCode });
  } catch (err) {
    console.error('Error fetching lot:', err);
    res.status(500).json({ message: 'Failed to fetch lot' });
  }
};
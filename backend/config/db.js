const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL DB');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
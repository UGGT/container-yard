const { Pool } = require('pg');
require('dotenv').config();

let pool;

if (process.env.DATABASE_URL) {
  // ✅ Use DATABASE_URL in production (e.g. Render)
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // Required by Render
    },
  });
} else {
  // ✅ Use individual env vars in local dev
  pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });
}

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL DB');
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
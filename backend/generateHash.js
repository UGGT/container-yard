// backend/generateHash.js
const bcrypt = require('bcryptjs');

const password = 'gopi5679'; // 👈 Change this if needed
const hash = bcrypt.hashSync(password, 10);

console.log(`Hashed password for '${password}':\n${hash}`);
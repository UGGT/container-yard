require('dotenv').config();
const app = require('./app');
const http = require('http');
const server = http.createServer(app);

// Import and initialize socket.io once via service
const { initIo } = require('./services/socketService');
const io = initIo(server);

// Optionally store on app (if needed elsewhere)
app.set('io', io);

const PORT = process.env.PORT || 5050;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
// backend/services/socketService.js

let ioInstance;

function initIo(server) {
  const { Server } = require('socket.io');
  ioInstance = new Server(server, {
    cors: { origin: '*' },
  });

  ioInstance.on('connection', (socket) => {
    console.log("🟢 WebSocket connected:", socket.id);
  });

  return ioInstance;
}

function getIo() {
  if (!ioInstance) {
    throw new Error("Socket.io has not been initialized yet!");
  }
  return ioInstance;
}

module.exports = {
  initIo,
  getIo
};

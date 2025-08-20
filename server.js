const express = require('express');
const { createServer } = require('node:http');
const path = require('path');
const { Server } = require('socket.io');

// Import socket handler
const chatHandler = require('./src/sockets/chatHandler');

const app = express();
const server = createServer(app);

// Serve frontend files
app.use(express.static(path.resolve("./public")));

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Attach chat logic
io.on('connection', (socket) => chatHandler(io, socket));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

server.listen(3000, () => {
  console.log('✅ Server running at http://localhost:3000');
});

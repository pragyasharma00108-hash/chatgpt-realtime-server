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
    origin: [
      "http://localhost:3001", // for local dev
      "https://pragyasharma00108-hash.github.io", // your GitHub Pages frontend
      "https://chatgpt-realtime-server.onrender.com" 
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Attach chat logic
io.on('connection', (socket) => chatHandler(io, socket));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Use Render’s provided port or default to 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

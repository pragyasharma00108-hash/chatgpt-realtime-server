const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const path = require("path");
const { Server } = require('socket.io');
const dotenv = require('dotenv');
const OpenAI = require('openai');

dotenv.config();

const app = express();
const server = createServer(app);
app.use(express.static(path.resolve("./public")));

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// OpenAI setup
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Per-socket conversation memory
const conversationStates = new Map();

io.on('connection', (socket) => {
  console.log('A user connected');

  // Initialize state for this socket
  conversationStates.set(socket.id, { messages: [] });

  socket.on("user-message", async (message) => {
    console.log("User:", message);

    const state = conversationStates.get(socket.id);
    state.messages.push({ role: 'user', content: message });

    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages: [
          { role: 'system', content: "You are a helpful AI assistant." },
          ...state.messages
        ]
      });

      const aiResponse = completion.choices[0]?.message?.content || "No response generated.";
      state.messages.push({ role: 'assistant', content: aiResponse });

      socket.emit("message", aiResponse);

    } catch (err) {
      console.error("OpenAI error:", err);
      socket.emit("message", "Sorry, something went wrong with AI.");
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
    conversationStates.delete(socket.id);
  });
});

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'public', 'index.html'));
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000');
});

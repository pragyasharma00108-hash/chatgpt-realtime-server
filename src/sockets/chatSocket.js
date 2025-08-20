const { callGenAI } = require("../services/genAIService");

function chatSocket(io) {
  io.on("connection", (socket) => {
    console.log("✅ A user connected");

    socket.on("user-message", async (message) => {
      console.log("User:", message);

      let responded = false;
      const controller = new AbortController();

      const timeout = setTimeout(() => {
        if (!responded) {
          responded = true;
          io.emit("message", message); // fallback
          controller.abort();
        }
      }, 120000); // 2 min

      try {
        const data = await callGenAI(message, controller);
        if (!responded) {
          responded = true;
          clearTimeout(timeout);
          io.emit("message", data);
        }
      } catch {
        if (!responded) {
          responded = true;
          clearTimeout(timeout);
          io.emit("message", message); // fallback
        }
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected");
    });
  });
}

module.exports = chatSocket;

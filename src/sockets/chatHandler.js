const { getAIResponse } = require('../services/genAIService');

module.exports = (io, socket) => {
  console.log('🔌 A user connected');

  socket.on("user-message", async (message) => {
    console.log("User:", message);

    let responded = false;
    const controller = new AbortController();

    // Timeout fallback (2 mins)
    const timeout = setTimeout(() => {
      if (!responded) {
        responded = true;
        io.emit("message", message);
        controller.abort();
      }
    }, 120000);

    try {
      const text = await getAIResponse(message, controller);

      if (!responded) {
        responded = true;
        clearTimeout(timeout);
        io.emit("message", text);
      }
    } catch (error) {
      if (!responded) {
        responded = true;
        clearTimeout(timeout);
        console.error("Gen AI error:", error);
        io.emit("message", message); // fallback
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected');
  });
};

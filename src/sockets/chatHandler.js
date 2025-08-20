const { getAIResponse } = require('../services/genAIService');

module.exports = (io, socket) => {
  console.log('🔌 A user connected');

  socket.on("user-message", async (message) => {
    // Trim and validate message
    const userMessage = typeof message === "string" ? message.trim() : "";
    if (!userMessage) {
      console.log("❌ Ignored empty message");
      return; // do not call AI API with empty message
    }

    console.log("User:", userMessage);

    let responded = false;
    const controller = new AbortController();

    // Timeout fallback (2 mins)
    const timeout = setTimeout(() => {
      if (!responded) {
        responded = true;
        io.emit("message", userMessage); // fallback
        controller.abort();
      }
    }, 120000);

    try {
      const text = await getAIResponse(userMessage, controller);

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
        io.emit("message", userMessage); // fallback
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected');
  });
};

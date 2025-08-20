// genAIService.js

async function getAIResponse(message, controller) {
  const response = await fetch("process.env.GEN_AI_API", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt: message }),
    signal: controller?.signal, // optional chaining, in case no controller is passed
  });

  const data = await response.json();
  return data.text;
}

module.exports = { getAIResponse };

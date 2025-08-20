async function getAIResponse(message, controller) {
  const response = await fetch(process.env.GEN_AI_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    // body: JSON.stringify({
    //   model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    //   message: message,
    // }),
     body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      message: "From now on, reply in a sarcastic, savage, and hilarious way. Every answer should feel like a stand-up roast session. Use witty comebacks, exaggerations, and playful mockery to keep it entertaining. Always mix humor with sarcasm, and never give plain or boring replies. Just reply and do not provide the unnessary information for the following message :" + message,
    }),
    signal: controller?.signal,
  });

  // Debug: check what API actually sends back
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "⚠️ No response";
}
module.exports = { getAIResponse }; 

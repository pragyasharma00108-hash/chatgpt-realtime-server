async function getAIResponse(message, controller) {
  const response = await fetch(process.env.GEN_AI_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      message: message,
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
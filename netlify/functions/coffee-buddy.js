
exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "AI key is not configured yet." })
    };
  }

  try {
    const { message, history = [] } = JSON.parse(event.body || "{}");

    if (typeof message !== "string" || !message.trim()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Please enter a message." })
      };
    }

    const contents = [
  ...history.slice(-10).map((item) => ({
    role: item.role === "assistant" || item.role === "model"
      ? "model"
      : "user",
    parts: [{
      text: String(
        item.content ?? item.parts?.[0]?.text ?? ""
      ).slice(0, 2000)
    }]
  })).filter((item) => item.parts[0].text),
  { role: "user", parts: [{ text: message.trim().slice(0, 2000) }] }
];

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        signal: AbortSignal.timeout(25000),
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: `You are Kombi Coffee Buddy, the friendly assistant
for Kombi Coffee Cabin in Habarana, Sri Lanka.
Help customers choose coffee and customise drinks.
Ask about hot or iced drinks, strength, sweetness, milk
and syrups when useful. Give simple drink recommendations.
Answer general coffee and cafe questions naturally.
Be friendly, concise and welcoming. Do not invent menu
items, prices, ingredients or availability. If you do not
know a cafe-specific detail, suggest asking the staff.`
            }]
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data.error?.message);
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: "Sorry, the coffee buddy is unavailable right now."
        })
      };
    }

    const reply = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reply: reply || "Sorry, could you ask me that another way?"
      })
    };
  } catch (error) {
    console.error("Coffee Buddy error:", error.message);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Something went wrong. Please try again."
      })
    };
  }
};
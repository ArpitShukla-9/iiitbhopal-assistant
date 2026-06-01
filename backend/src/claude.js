export async function askClaude(question, history = [], systemPrompt) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

  const contents = [];

  for (const msg of history.slice(-10)) {
    contents.push({
      role: msg.role === "assistant" ? "model" : "user",
      parts: [{ text: msg.content }],
    });
  }

  contents.push({
    role: "user",
    parts: [{ text: question }],
  });

  const body = {
    system_instruction: {
      parts: [{ text: systemPrompt }],
    },
    contents,
    generationConfig: {
      maxOutputTokens: 1024,
      temperature: 0.7,
    },
  };

  const res = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} — ${err}`);
  }

  const data = await res.json();
  return data.candidates[0].content.parts[0].text;
}
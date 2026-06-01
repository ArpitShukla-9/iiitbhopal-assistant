export async function askClaude(question, history = [], systemPrompt) {
  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  const messages = [{ role: "system", content: systemPrompt }];

  for (const msg of history.slice(-10)) {
    messages.push({ role: msg.role === "assistant" ? "assistant" : "user", content: msg.content });
  }

  messages.push({ role: "user", content: question });

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages,
      max_tokens: 1024,
      temperature: 0.7
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API error: ${res.status} — ${err}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}
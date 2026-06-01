import express from "express";
import cors from "cors";
import { scrapeAllSources } from "./scraper.js";
import { buildKnowledgeBase, queryKnowledgeBase } from "./rag.js";
import { askClaude } from "./claude.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

let knowledgeBase = null;
let lastScraped = null;

// Rebuild KB every 24 hours
async function initKnowledgeBase() {
  console.log("🔄 Scraping & building knowledge base...");
  const data = await scrapeAllSources();
  knowledgeBase = await buildKnowledgeBase(data);
  lastScraped = new Date();
  console.log("✅ Knowledge base ready with", data.length, "chunks");
}

// Auto-refresh every 24h
setInterval(initKnowledgeBase, 24 * 60 * 60 * 1000);
initKnowledgeBase();

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    lastScraped,
    chunks: knowledgeBase?.length || 0,
  });
});

app.post("/ask", async (req, res) => {
  try {
    const { question, history = [] } = req.body;
    if (!question) return res.status(400).json({ error: "No question provided" });

    // RAG: find relevant context
    const context = knowledgeBase
      ? await queryKnowledgeBase(knowledgeBase, question)
      : [];

    // Build system prompt with context
    const systemPrompt = buildSystemPrompt(context);

    // Ask Claude
    const answer = await askClaude(question, history, systemPrompt);

    res.json({ answer, sources: context.map((c) => c.source) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

function buildSystemPrompt(context) {
  const contextText =
    context.length > 0
      ? context.map((c) => `[Source: ${c.source}]\n${c.text}`).join("\n\n---\n\n")
      : "No specific context found — use your general knowledge about IIIT Bhopal.";

  return `You are IIITB Buddy — the official AI assistant for IIIT Bhopal (Indian Institute of Information Technology, Bhopal). 
You help freshers (new students) with ALL their questions about campus life, academics, hostels, fees, clubs, placement, faculty, rules, and everything else about IIIT Bhopal.

PERSONALITY:
- Friendly, warm, and encouraging — like a helpful senior
- Use simple clear language; avoid jargon
- When unsure, say so honestly and suggest official sources
- Always be positive about IIIT Bhopal while being accurate
- Use emojis occasionally to keep it friendly 😊

KNOWLEDGE BASE (use this as primary source):
${contextText}

RULES:
1. Prioritize information from the knowledge base above
2. If asked something not in knowledge base, use your training knowledge about IIIT Bhopal
3. For fees/dates/official procedures — always recommend checking iiitbhopal.ac.in for latest info
4. Never make up specific numbers (fees, seats, etc.) if you're not sure
5. Answer in the same language the student uses (Hindi or English)
6. Keep answers concise but complete`;
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

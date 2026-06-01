// Simple but effective TF-IDF based RAG system
// No vector DB needed — works entirely in memory

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

function buildTFIDF(chunks) {
  const N = chunks.length;
  const df = {}; // document frequency
  const tfidfs = [];

  // Calculate document frequency
  for (const chunk of chunks) {
    const tokens = new Set(tokenize(chunk.text));
    for (const token of tokens) {
      df[token] = (df[token] || 0) + 1;
    }
  }

  // Calculate TF-IDF for each chunk
  for (const chunk of chunks) {
    const tokens = tokenize(chunk.text);
    const tf = {};
    for (const token of tokens) {
      tf[token] = (tf[token] || 0) + 1;
    }

    const vector = {};
    for (const [token, count] of Object.entries(tf)) {
      const tfScore = count / tokens.length;
      const idfScore = Math.log(N / (df[token] || 1));
      vector[token] = tfScore * idfScore;
    }

    tfidfs.push({ ...chunk, vector });
  }

  return tfidfs;
}

function cosineSimilarity(vec1, vec2) {
  const keys = new Set([...Object.keys(vec1), ...Object.keys(vec2)]);
  let dot = 0,
    mag1 = 0,
    mag2 = 0;

  for (const key of keys) {
    const v1 = vec1[key] || 0;
    const v2 = vec2[key] || 0;
    dot += v1 * v2;
    mag1 += v1 * v1;
    mag2 += v2 * v2;
  }

  if (mag1 === 0 || mag2 === 0) return 0;
  return dot / (Math.sqrt(mag1) * Math.sqrt(mag2));
}

export async function buildKnowledgeBase(chunks) {
  console.log(`🧠 Building TF-IDF index for ${chunks.length} chunks...`);
  return buildTFIDF(chunks);
}

export async function queryKnowledgeBase(kb, query, topK = 5) {
  const queryTokens = tokenize(query);
  const queryTF = {};

  for (const token of queryTokens) {
    queryTF[token] = (queryTF[token] || 0) + 1;
  }

  // Normalize query TF
  const queryVector = {};
  for (const [token, count] of Object.entries(queryTF)) {
    queryVector[token] = count / queryTokens.length;
  }

  // Score each chunk
  const scored = kb.map((chunk) => ({
    source: chunk.source,
    text: chunk.text,
    score: cosineSimilarity(queryVector, chunk.vector),
  }));

  // Also do keyword boosting for exact phrase matches
  const queryLower = query.toLowerCase();
  for (const item of scored) {
    const textLower = item.text.toLowerCase();
    const queryWords = queryLower.split(/\s+/);
    let boost = 0;
    for (const word of queryWords) {
      if (word.length > 3 && textLower.includes(word)) boost += 0.05;
    }
    item.score += boost;
  }

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((item) => item.score > 0);
}

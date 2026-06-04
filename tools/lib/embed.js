'use strict';
// tools/lib/embed.js — the single embedding swap-point for the copywriter-RAG.
//
// Deterministic-script law (CLAUDE.md): embedding + similarity are arithmetic, not
// judgment — this is a script lib, never an agent.
//
// ONE function, TWO backends:
//   - Voyage REST  : used when VOYAGE_API_KEY is set. Real semantic vectors.
//   - local stub   : used otherwise. Deterministic bag-of-words hash embedding.
//                    Lets the whole RAG chain run + be tested with NO key and NO funnels.
//                    Swapping stub→Voyage changes NOTHING upstream — same call, same shape.
//
// Why a stub and not a hard error: D-16 made vectorization JIT. The wiring must be
// provable today (empty store, no key). The stub gives lexical-overlap cosine — good
// enough to prove the pipe, clearly labelled so no one mistakes it for semantic recall.
//
// Env:
//   VOYAGE_API_KEY   if present → Voyage backend
//   VOYAGE_MODEL     default 'voyage-3-large'
//   VOYAGE_API_URL   default 'https://api.voyageai.com/v1/embeddings'
//
// API:
//   await embed(texts, { inputType })  → number[][]  (one vector per input, order preserved)
//   cosine(a, b)                        → number in [-1, 1]
//   backendName()                       → 'voyage:<model>' | 'stub-local-hash'
//   isStub()                            → boolean
//
// No Date.now / Math.random anywhere (determinism + resumability).

const STUB_DIM      = 512;
const VOYAGE_MODEL  = process.env.VOYAGE_MODEL   || 'voyage-3-large';
const VOYAGE_URL    = process.env.VOYAGE_API_URL || 'https://api.voyageai.com/v1/embeddings';
const VOYAGE_KEY    = process.env.VOYAGE_API_KEY || '';
const VOYAGE_BATCH  = 128; // Voyage hard cap on inputs per request

function isStub() { return !VOYAGE_KEY; }
function backendName() { return isStub() ? 'stub-local-hash' : `voyage:${VOYAGE_MODEL}`; }

// ---------------------------------------------------------------------------
// Local stub embedding — deterministic FNV-1a hashed bag-of-words, L2-normalized.
// Cosine over these ≈ normalized lexical overlap. NOT semantic. Clearly labelled.

function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}

function stubEmbedOne(text) {
  const v = new Float64Array(STUB_DIM);
  const tokens = String(text || '').toLowerCase().match(/[a-z0-9]+/g) || [];
  for (const tok of tokens) {
    if (tok.length < 2) continue;
    v[fnv1a(tok) % STUB_DIM] += 1;
  }
  let norm = 0;
  for (let i = 0; i < STUB_DIM; i++) norm += v[i] * v[i];
  norm = Math.sqrt(norm) || 1;
  const out = new Array(STUB_DIM);
  for (let i = 0; i < STUB_DIM; i++) out[i] = v[i] / norm;
  return out;
}

// ---------------------------------------------------------------------------
// Voyage backend

async function voyageEmbedBatch(texts, inputType) {
  const body = {
    input: texts,
    model: VOYAGE_MODEL,
    ...(inputType ? { input_type: inputType } : {}),
  };
  const res = await fetch(VOYAGE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${VOYAGE_KEY}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Voyage API ${res.status}: ${detail.slice(0, 400)}`);
  }
  const json = await res.json();
  if (!json || !Array.isArray(json.data)) {
    throw new Error('Voyage API: unexpected response shape (no data[])');
  }
  // Voyage returns objects with .index — sort to guarantee input order.
  return json.data
    .slice()
    .sort((a, b) => a.index - b.index)
    .map(d => d.embedding);
}

// ---------------------------------------------------------------------------
// Public embed: batches, preserves order, picks backend by env.
//   inputType: 'document' when indexing, 'query' when retrieving (Voyage uses it;
//   the stub ignores it). Passing it keeps the asymmetric-embedding seam open.

async function embed(texts, opts = {}) {
  const arr = Array.isArray(texts) ? texts : [texts];
  if (arr.length === 0) return [];

  if (isStub()) return arr.map(stubEmbedOne);

  const out = [];
  for (let i = 0; i < arr.length; i += VOYAGE_BATCH) {
    const chunk = arr.slice(i, i + VOYAGE_BATCH);
    const vecs = await voyageEmbedBatch(chunk, opts.inputType);
    if (vecs.length !== chunk.length) {
      throw new Error(`Voyage returned ${vecs.length} vectors for ${chunk.length} inputs`);
    }
    out.push(...vecs);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Cosine similarity. Vectors need not be pre-normalized.

function cosine(a, b) {
  if (!a || !b || a.length !== b.length) return 0;
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    na  += a[i] * a[i];
    nb  += b[i] * b[i];
  }
  const denom = Math.sqrt(na) * Math.sqrt(nb);
  return denom ? dot / denom : 0;
}

module.exports = { embed, cosine, backendName, isStub, STUB_DIM };

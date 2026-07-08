// src/components/chat/matcher.js
//
// Deterministic client-side matcher for the chat knowledge base.
// Scores each entry with three signals in decreasing weight:
//
//   1. Exact / near-exact PATTERN match  ─ the strongest signal. If a
//      knowledge-base pattern is a substring of the query (or vice versa
//      for short queries), we treat it as an intent hit.
//
//   2. High-specificity TERM hits        ─ multi-word phrases and
//      unambiguous keywords declared per entry.
//
//   3. Low-specificity TAG token overlap ─ softer bag-of-words hits.
//
// Ambiguous queries fall through to a helpful fallback that shows the top
// candidates as tappable follow-up options, instead of confidently
// returning the wrong long answer.

import { knowledgeBase } from '../../content/knowledgeBase'

const STOP = new Set([
  'a','an','the','and','or','but','of','for','to','in','on','at','with','by','is',
  'are','be','it','its','this','that','you','your','yours','me','my','i','we',
  'do','did','does','have','has','had','how','what','when','where','why','who',
  'about','tell','show','walk','through','give','some','any','can','could',
  'would','should','please','from','into','so','if','than','then','also','just',
])

function normalize(s = '') {
  return String(s).toLowerCase()
    // Preserve alphanumerics and a few connectors that carry meaning
    // ('&' → e.g. gd&t, '-' → e.g. as9102-eligible).
    .replace(/[^a-z0-9&\-'\s+]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(s) {
  const n = normalize(s)
  return n.split(' ').filter(t => t && !STOP.has(t))
}

function jaccard(a, b) {
  if (!a.size || !b.size) return 0
  let inter = 0
  for (const x of a) if (b.has(x)) inter++
  return inter / (a.size + b.size - inter)
}

function includesPhrase(hay, needle) {
  if (!needle) return false
  return hay.includes(needle)
}

/** Score a single knowledge-base entry against a normalized query. */
function scoreEntry(qNorm, qTokens, entry) {
  let s = 0
  const hits = { pattern: 0, term: 0, tag: 0 }

  // 1) Pattern hits — heaviest.
  for (const p of entry.patterns || []) {
    const pn = normalize(p)
    if (!pn) continue
    if (qNorm === pn) { s += 40; hits.pattern++; break }        // exact
    if (includesPhrase(qNorm, pn)) { s += 24; hits.pattern++; break }
    // For queries longer than a couple words, allow contained-in-query
    // AND all-tokens-in-query fallbacks.
    const pTokens = tokenize(pn)
    if (pTokens.length && pTokens.every(t => qTokens.includes(t))) {
      s += 14; hits.pattern++
    }
  }

  // 2) High-specificity term hits.
  for (const t of entry.terms || []) {
    const tn = normalize(t)
    if (!tn) continue
    if (includesPhrase(qNorm, tn)) {
      s += tn.includes(' ') ? 12 : 8
      hits.term++
    }
  }

  // 3) Low-specificity tag hits (bag-of-words overlap).
  const tagTokens = new Set()
  for (const tag of entry.tags || []) {
    for (const t of tokenize(tag)) tagTokens.add(t)
  }
  const qSet = new Set(qTokens)
  const overlap = jaccard(qSet, tagTokens)
  if (overlap > 0) {
    s += overlap * 10
    hits.tag++
  }
  for (const t of qTokens) {
    // small extra bump when the query names the entry id or any tag literally
    if (entry.id === t) s += 3
  }

  return { score: s, hits }
}

/**
 * Score every entry and return them sorted. Only entries with a positive
 * score are returned.
 */
export function search(query, limit = 5) {
  const q = String(query || '').trim()
  if (!q) return []
  const qNorm = normalize(q)
  const qTokens = tokenize(q)
  if (qTokens.length === 0 && qNorm.length === 0) return []

  const scored = knowledgeBase
    .map(entry => ({ entry, ...scoreEntry(qNorm, qTokens, entry) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
  return scored.slice(0, limit)
}

/**
 * Build a chat response from a query.
 * - If we have a clear winner (top score above threshold AND well ahead of
 *   the second-best), return it as a normal answer.
 * - If two-plus entries are close, return a disambiguation menu.
 * - If nothing scored well, return a helpful fallback with quick options.
 */
export function respond(query) {
  const ranked = search(query, 5)

  // No hits at all — smart fallback.
  if (ranked.length === 0) {
    return {
      kind: 'no-match',
      body:
        "I don't have a specific answer for that, but I can walk you through anything on the site. Try one of these:",
      options: [
        { label: 'The internship at Verus Aerospace', to: '/#internship',           entryId: 'verus'    },
        { label: 'Project portfolio',                to: '/#projects',              entryId: 'projects-overview' },
        { label: 'Availability + full-time',         entryId: 'availability'                            },
        { label: 'How to contact Alex',              entryId: 'contact'                                 },
      ],
    }
  }

  const [top, second] = ranked
  const clear =
    top.score >= 12 && (!second || (top.score - second.score) >= 6)

  // If the top match is not decisive, offer a disambiguation menu so we
  // never return a confidently wrong long answer.
  if (!clear) {
    return {
      kind: 'ambiguous',
      body: "A few things could match that. Which one did you mean?",
      options: ranked.slice(0, 4).map(r => ({
        label: r.entry.title,
        entryId: r.entry.id,
      })),
    }
  }

  const e = top.entry
  return {
    kind: 'match',
    title: e.title,
    body: e.answer,
    links: e.links || [],
    related: ranked.slice(1, 3).map(r => ({
      label: r.entry.title,
      entryId: r.entry.id,
    })),
  }
}

/** Get an entry by id (used when the user clicks a disambiguation option). */
export function getById(id) {
  const e = knowledgeBase.find(x => x.id === id)
  if (!e) return null
  return {
    kind: 'match',
    title: e.title,
    body: e.answer,
    links: e.links || [],
    related: [],
  }
}

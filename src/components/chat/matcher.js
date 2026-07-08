// src/components/chat/matcher.js
//
// Client-side matcher for the chat knowledge base. Keyword-scored, tolerant
// of small typos, and deterministic. Runs entirely in the browser — no
// external calls, no telemetry.

import { knowledgeBase } from '../../content/knowledgeBase'

const STOP = new Set([
  'a','an','the','and','or','but','of','for','to','in','on','at','with','by','is',
  'are','be','it','its','this','that','you','your','yours','me','my','i','we',
  'do','did','does','have','has','had','how','what','when','where','why','who',
  'about','tell','show','walk','through','give','some','any','can','could','would','should',
])

function tokenize(s = '') {
  return String(s)
    .toLowerCase()
    // Keep hyphens/apostrophes for terms like "as9102", "gd&t"
    .replace(/[^a-z0-9&\-'\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t && !STOP.has(t))
}

function contains(hay, needle) {
  return hay.includes(needle)
}

/**
 * Score a query against a single knowledgeBase entry.
 * Score is a coarse relevance heuristic — higher is better.
 */
function scoreEntry(query, entry) {
  const q = query.toLowerCase()
  const tokens = tokenize(query)
  let s = 0

  // 1) Exact-pattern overlap. Highest weight.
  for (const p of entry.patterns || []) {
    const pn = p.toLowerCase()
    if (contains(q, pn)) s += 8
    else if (tokenize(pn).every(t => tokens.includes(t))) s += 5
  }

  // 2) Tag hits.
  for (const t of entry.tags || []) {
    const tt = t.toLowerCase()
    if (contains(q, tt)) s += 4
    else if (tokens.includes(tt)) s += 3
    else if (tt.includes(' ') && tt.split(' ').every(w => tokens.includes(w))) s += 3
  }

  // 3) Bonus for id / title token hits.
  for (const t of tokens) {
    if (entry.id.includes(t)) s += 1
    if (entry.title.toLowerCase().includes(t)) s += 1
  }

  return s
}

export function search(query, limit = 3) {
  const q = (query || '').trim()
  if (!q) return []
  const ranked = knowledgeBase
    .map(entry => ({ entry, score: scoreEntry(q, entry) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
  return ranked
}

/** Compose an assistant response from the ranked results. */
export function respond(query) {
  const ranked = search(query, 3)

  if (ranked.length === 0) {
    return {
      kind: 'no-match',
      body:
        "I don't have a canned answer for that. Try asking about the internship at Verus, a specific project (multi-tool, gearbox, turret, vibration/PCM, coastal, BET-H, micromobility), availability, or how to get in touch.",
      links: [
        { label: 'Contact', to: '/#contact' },
        { label: 'Projects', to: '/#projects' },
      ],
    }
  }

  const top = ranked[0].entry
  const related = ranked.slice(1).map(r => r.entry)

  return {
    kind: 'match',
    title: top.title,
    body: top.answer,
    link: top.link,
    related: related.map(r => ({ id: r.id, title: r.title, link: r.link })),
  }
}

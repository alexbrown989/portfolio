import assert from 'node:assert/strict'
import { respond } from '../src/components/chat/matcher.js'

const cases = [
  [
    'Which project involved analyzing water movement around an island model?',
    'Saipan Coastal Wave Dynamics',
  ],
  [
    'Show me Alex’s work related to manufacturing quality.',
    'Verus Aerospace · Lead Intern',
  ],
  [
    'What software did Alex use for the Saipan erosion analysis?',
    'Saipan Coastal Wave Dynamics',
  ],
  [
    'What has Alex done with shape-memory alloys?',
    'Shape-memory alloys',
  ],
  ['Who is Alex Brown?', 'Who is Alex Brown?'],
  ['What projects has Alex worked on?', 'Projects · overview'],
]

for (const [query, expectedTitle] of cases) {
  const result = respond(query)
  assert.equal(result.kind, 'match', `Expected a match for: ${query}`)
  assert.equal(result.title, expectedTitle, `Wrong answer for: ${query}`)
  assert.ok(
    !(result.related || []).some((item) => ['Travel', 'Who is Alex Brown?'].includes(item.label)),
    `Weak related match leaked into: ${query}`,
  )
}

console.log(`Chat matcher: ${cases.length} regression queries passed.`)

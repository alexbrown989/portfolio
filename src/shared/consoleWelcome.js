// src/shared/consoleWelcome.js
//
// Old-school easter egg. Recruiters and engineers who open devtools see
// a friendly ASCII banner and a pitch. Non-crashing — wrapped so any
// browser without styled console.log still prints something readable.

let printed = false

export function printConsoleWelcome() {
  if (printed || typeof window === 'undefined') return
  printed = true

  const banner = `
   _____  _              ____
  /  _  \\| | ____  __   |  _ \\ ___ ___  _ __
  |  |_| || |/ _ \\ \\/ /   | |_) / _ \\ __\\| '_ \\
  |  _  || |  __/ >  <    |  _ < (_) |_ | | | |
  \\_/ \\_/|_|\\___|/_/\\_\\   |_| \\_\\___/___|_| |_|
`
  const style = 'color:#22bfe0;font-family:ui-monospace,JetBrains Mono,monospace;font-size:11px;line-height:1.35'

  // Big banner (styled)
  try { console.log(`%c${banner}`, style) }
  catch { console.log(banner) }

  const pitch = [
    'Portfolio · alexandercbrown.com',
    'Mechanical engineer · aerospace-focused · Lead Intern @ Verus Aerospace',
    'If you\'re reading this in devtools, you\'re my kind of engineer.',
    '',
    'Say hi:  alexbrow@uw.edu',
    'LinkedIn: linkedin.com/in/alexanderchasebrown',
    '',
    'Everything on this site (chat, orbit widget, wave sim, gear train,',
    'STL viewers, decrypt animation) runs client-side. No backend, no',
    'telemetry, no LLM calls. Feel free to poke around the source.',
  ].join('\n')

  try {
    console.log(
      `%c${pitch}`,
      'color:#e5e7eb;font-family:ui-monospace,JetBrains Mono,monospace;font-size:11px;line-height:1.5',
    )
  } catch {
    console.log(pitch)
  }
}

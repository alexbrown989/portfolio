// src/shared/useKonami.js
// Konami-code listener. Fires the callback when the user enters the
// classic sequence (↑ ↑ ↓ ↓ ← → ← → B A). Ignores keys typed inside
// inputs / textareas so it doesn't fire while typing in the chat.

import { useEffect } from 'react'

const SEQUENCE = [
  'ArrowUp','ArrowUp','ArrowDown','ArrowDown',
  'ArrowLeft','ArrowRight','ArrowLeft','ArrowRight',
  'KeyB','KeyA',
]

export default function useKonami(onTrigger) {
  useEffect(() => {
    let idx = 0
    const onKey = (e) => {
      const t = e.target
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (e.code === SEQUENCE[idx]) {
        idx++
        if (idx === SEQUENCE.length) {
          idx = 0
          onTrigger?.()
        }
      } else {
        // Reset unless we're starting again with the first key
        idx = e.code === SEQUENCE[0] ? 1 : 0
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onTrigger])
}

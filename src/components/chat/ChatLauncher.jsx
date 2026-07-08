// src/components/chat/ChatLauncher.jsx
//
// Floating chat launcher + dialog. Local knowledge-base backed (no LLM, no
// network calls). Renders inside AppShell so every route has access to it.
//
// UX beats: unread pulse dot on first load, animated typing dots for the
// assistant, staggered message reveal, suggested prompts in the empty
// state, keyboard shortcut ("?" to open, Esc to close).

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MessageSquare, X, Send, ArrowRight, RotateCcw } from 'lucide-react'
import { respond } from './matcher'
import { suggestedPrompts } from '../../content/knowledgeBase'

const STORAGE_KEY = 'ab.chat.seen.v1'

function TypingDots() {
  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-3/70 border border-line">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-brand-300"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

function LinkChip({ label, to, external }) {
  const cls =
    'inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border border-brand-500/40 bg-brand-500/10 text-brand-200 hover:border-brand-400 hover:text-white transition-colors'
  if (external) {
    return (
      <a href={to} target="_blank" rel="noreferrer" className={cls}>
        {label} <ArrowRight className="w-3 h-3" />
      </a>
    )
  }
  return (
    <Link to={to} className={cls}>
      {label} <ArrowRight className="w-3 h-3" />
    </Link>
  )
}

function AssistantMessage({ payload }) {
  return (
    <div className="max-w-[92%] rounded-2xl border border-line bg-surface-2/70 backdrop-blur-sm p-3.5">
      <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-brand-300/90 mb-1.5">
        Assistant
        {payload.title && <span className="text-gray-500 normal-case tracking-normal"> · {payload.title}</span>}
      </div>
      <div className="text-[13.5px] text-gray-100 leading-relaxed whitespace-pre-wrap">
        {payload.body}
      </div>
      {(payload.link || (payload.links && payload.links.length) || (payload.related && payload.related.length)) && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {payload.link && <LinkChip label={payload.link.label} to={payload.link.to} />}
          {(payload.links || []).map(l => <LinkChip key={l.to} label={l.label} to={l.to} />)}
          {(payload.related || []).filter(r => r.link).map(r => (
            <LinkChip key={r.id} label={r.link.label || r.title} to={r.link.to} />
          ))}
        </div>
      )}
    </div>
  )
}

function UserMessage({ text }) {
  return (
    <div className="ml-auto max-w-[85%] rounded-2xl border border-brand-500/30 bg-brand-500/10 text-white p-3 text-[13.5px] leading-relaxed">
      {text}
    </div>
  )
}

export default function ChatLauncher() {
  const [open, setOpen] = useState(false)
  const [hasSeen, setHasSeen] = useState(true)
  const [messages, setMessages] = useState([])
  const [pending, setPending] = useState(false)
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    try {
      const seen = localStorage.getItem(STORAGE_KEY) === '1'
      setHasSeen(seen)
    } catch { /* localStorage blocked; treat as unseen */ }
  }, [])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && open) setOpen(false)
      // "?" opens the chat unless the user is typing in an input/textarea.
      if (e.key === '?' && !open) {
        const t = e.target
        const isText = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)
        if (!isText) { e.preventDefault(); setOpen(true) }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (open) {
      try { localStorage.setItem(STORAGE_KEY, '1') } catch { /* ignore */ }
      setHasSeen(true)
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [open])

  useEffect(() => {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
  }, [messages, pending])

  const send = (text) => {
    const q = (text ?? input).trim()
    if (!q) return
    setInput('')
    setMessages(m => [...m, { role: 'user', text: q }])
    setPending(true)
    const delay = reduce ? 100 : 400 + Math.min(700, q.length * 8)
    setTimeout(() => {
      const payload = respond(q)
      setMessages(m => [...m, { role: 'assistant', payload }])
      setPending(false)
    }, delay)
  }

  const reset = () => {
    setMessages([])
    setPending(false)
    setInput('')
    setTimeout(() => inputRef.current?.focus(), 60)
  }

  return (
    <>
      {/* Launcher button */}
      <motion.button
        aria-label={open ? 'Close chat' : 'Open chat with Alex\'s assistant'}
        onClick={() => setOpen(v => !v)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.4 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        className="fixed z-50 bottom-5 right-5 md:bottom-7 md:right-7 group inline-flex items-center gap-2 rounded-full pl-3 pr-4 py-3 bg-brand-500 text-white shadow-[0_10px_40px_rgba(10,165,199,0.35)] hover:bg-brand-400 transition-colors"
      >
        {open ? <X className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
        <span className="text-sm font-semibold">{open ? 'Close' : 'Ask about Alex'}</span>
        {!hasSeen && !open && (
          <span className="relative flex h-2 w-2 ml-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/70" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
          </span>
        )}
      </motion.button>

      {/* Dialog */}
      <AnimatePresence>
        {open && (
          <motion.aside
            role="dialog"
            aria-label="Portfolio chat"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed z-50 bottom-20 right-4 md:right-7 w-[min(94vw,420px)] max-h-[min(78vh,720px)] flex flex-col rounded-2xl border border-line bg-surface-1/95 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-line">
              <div>
                <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-brand-300/90">
                  Portfolio Assistant · v1
                </div>
                <div className="text-white font-semibold text-sm mt-0.5">
                  Ask about Alex
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={reset}
                  className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/[0.04]"
                  aria-label="Reset conversation"
                  title="Reset"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-white/[0.04]"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scroll-smooth"
            >
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-line bg-surface-2/60 p-3.5">
                    <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-brand-300/90 mb-1.5">
                      Assistant · Welcome
                    </div>
                    <div className="text-[13.5px] text-gray-200 leading-relaxed">
                      Hi. I have a curated knowledge base of Alex's projects, timeline, and skills. Ask me anything.
                      This runs entirely in your browser — no data leaves the page.
                    </div>
                  </div>
                  <div>
                    <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-gray-500 mb-2">
                      Try one of these
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {suggestedPrompts.map(p => (
                        <button
                          key={p}
                          onClick={() => send(p)}
                          className="text-left text-[13px] px-3 py-2 rounded-lg border border-line bg-surface-2/60 text-gray-200 hover:border-brand-500/40 hover:text-white transition-colors"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={m.role === 'user' ? 'flex' : 'flex'}
                >
                  {m.role === 'user'
                    ? <UserMessage text={m.text} />
                    : <AssistantMessage payload={m.payload} />}
                </motion.div>
              ))}

              {pending && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <TypingDots />
                </motion.div>
              )}
            </div>

            {/* Composer */}
            <form
              onSubmit={(e) => { e.preventDefault(); send() }}
              className="border-t border-line p-3 flex items-center gap-2 bg-surface-1/70"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a project, the internship, availability…"
                className="flex-1 bg-surface-3/40 border border-line rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-500/60"
              />
              <button
                type="submit"
                disabled={!input.trim() || pending}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-brand-500 text-white hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="px-4 py-2 border-t border-line text-[10.5px] font-mono uppercase tracking-[0.22em] text-gray-500 flex items-center justify-between">
              <span>Local · No data leaves your browser</span>
              <span>Press ? · Esc</span>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

// src/components/chat/ChatLauncher.jsx
//
// Floating chat launcher + dialog. Backed by the local matcher. No LLM
// calls. Handles three response kinds: match, ambiguous (disambiguation
// menu), and no-match (helpful fallback with option chips).

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'
import { MessageSquare, X, Send, ArrowRight, RotateCcw, Sparkles } from 'lucide-react'
import { respond, getById } from './matcher'
import { suggestedPrompts } from '../../content/knowledgeBase'

const STORAGE_KEY = 'ab.chat.seen.v2'

/* ---------------- Sub-components ---------------- */

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

function LinkChip({ label, to, external, onClick }) {
  const cls =
    'inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border border-brand-500/40 bg-brand-500/10 text-brand-200 hover:border-brand-400 hover:text-white transition-colors'
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={cls}>
        {label} <ArrowRight className="w-3 h-3" />
      </button>
    )
  }
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

function OptionButton({ label, onClick, to, external }) {
  const cls =
    'group w-full text-left inline-flex items-center justify-between gap-2 text-[13px] px-3 py-2.5 rounded-lg border border-line bg-surface-2/60 text-gray-100 hover:border-brand-500/40 hover:text-white transition-colors'
  const body = (
    <>
      <span>{label}</span>
      <ArrowRight className="w-3.5 h-3.5 text-brand-300 group-hover:translate-x-0.5 transition-transform" />
    </>
  )
  if (onClick) return <button type="button" onClick={onClick} className={cls}>{body}</button>
  if (external) return <a href={to} target="_blank" rel="noreferrer" className={cls}>{body}</a>
  return <Link to={to} className={cls}>{body}</Link>
}

function AssistantMessage({ payload, onFollowUp }) {
  // "No match" / "Ambiguous" — render options list
  if (payload.kind === 'no-match' || payload.kind === 'ambiguous') {
    return (
      <div className="max-w-[92%] rounded-2xl border border-line bg-surface-2/70 backdrop-blur-sm p-3.5">
        <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-brand-300/90 mb-1.5">
          {payload.kind === 'ambiguous' ? 'Assistant · Clarify' : 'Assistant · No exact match'}
        </div>
        <div className="text-[13.5px] text-gray-100 leading-relaxed whitespace-pre-wrap">
          {payload.body}
        </div>
        {Array.isArray(payload.options) && payload.options.length > 0 && (
          <div className="mt-3 flex flex-col gap-1.5">
            {payload.options.map((o, i) => (
              <OptionButton
                key={i}
                label={o.label}
                onClick={o.entryId ? () => onFollowUp(o.entryId) : undefined}
                to={o.to}
                external={o.external}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  // "Match" — normal answer
  return (
    <div className="max-w-[92%] rounded-2xl border border-line bg-surface-2/70 backdrop-blur-sm p-3.5">
      <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-brand-300/90 mb-1.5">
        Assistant
        {payload.title && <span className="text-gray-500 normal-case tracking-normal"> · {payload.title}</span>}
      </div>
      <div className="text-[13.5px] text-gray-100 leading-relaxed whitespace-pre-wrap">
        {payload.body}
      </div>

      {Array.isArray(payload.links) && payload.links.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {payload.links.map(l => (
            <LinkChip key={l.label + (l.to || '')} label={l.label} to={l.to} external={l.external} />
          ))}
        </div>
      )}

      {Array.isArray(payload.related) && payload.related.length > 0 && (
        <div className="mt-3 pt-3 border-t border-line">
          <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-gray-500 mb-1.5">
            Related
          </div>
          <div className="flex flex-wrap gap-1.5">
            {payload.related.map(r => (
              <LinkChip
                key={r.entryId}
                label={r.label}
                onClick={() => onFollowUp(r.entryId)}
              />
            ))}
          </div>
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

/* ---------------- Main ---------------- */

// How long (ms) the launcher shows its intro attention ping on each page
// load. After this, the button sits perfectly still.
const INTRO_PING_MS = 10000

export default function ChatLauncher() {
  const [open, setOpen] = useState(false)
  const [hasSeen, setHasSeen] = useState(true)
  const [showIntroPing, setShowIntroPing] = useState(false)
  const [messages, setMessages] = useState([])
  const [pending, setPending] = useState(false)
  const [input, setInput] = useState('')
  const inputRef = useRef(null)
  const listRef = useRef(null)
  const reduce = useReducedMotion()
  const { pathname } = useLocation()

  useEffect(() => {
    try { setHasSeen(localStorage.getItem(STORAGE_KEY) === '1') }
    catch { /* localStorage blocked; treat as unseen */ }
  }, [])

  // Blink for the first ~10 seconds of every page. Not continuous, not
  // annoying. Restarts on route change so a fresh page gets a fresh nudge.
  useEffect(() => {
    if (open || reduce) return
    setShowIntroPing(true)
    const t = setTimeout(() => setShowIntroPing(false), INTRO_PING_MS)
    return () => clearTimeout(t)
  }, [pathname, open, reduce])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && open) setOpen(false)
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

  const askText = (text) => {
    const q = (text ?? input).trim()
    if (!q) return
    setInput('')
    setMessages(m => [...m, { role: 'user', text: q }])
    setPending(true)
    const delay = reduce ? 100 : 350 + Math.min(600, q.length * 6)
    setTimeout(() => {
      const payload = respond(q)
      setMessages(m => [...m, { role: 'assistant', payload }])
      setPending(false)
    }, delay)
  }

  // Follow-up: user clicked a disambiguation / related chip. Show the
  // canned answer for that entry as a system-generated exchange.
  const followUp = (entryId) => {
    const payload = getById(entryId)
    if (!payload) return
    const label = payload.title ? `Tell me about ${payload.title}` : 'Tell me more'
    setMessages(m => [...m, { role: 'user', text: label }])
    setPending(true)
    const delay = reduce ? 100 : 350
    setTimeout(() => {
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
      {/* Launcher — perfectly still after the initial ping */}
      <motion.button
        aria-label={open ? 'Close chat' : "Open chat with Alex's assistant"}
        onClick={() => setOpen(v => !v)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        whileTap={{ scale: 0.96 }}
        className="fixed z-50 bottom-4 right-4 md:bottom-6 md:right-6 group inline-flex items-center gap-2 rounded-full pl-3 pr-4 py-3 bg-brand-500 text-white shadow-[0_10px_40px_rgba(10,165,199,0.35)] hover:bg-brand-400 transition-colors"
      >
        {/* Intro ping — 10s of blinking per page load, then still */}
        {!open && showIntroPing && (
          <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full">
            <span className="absolute inset-0 rounded-full bg-brand-400/40 animate-ping" />
          </span>
        )}
        <span className="relative z-10 inline-flex items-center gap-2">
          {open
            ? <X className="w-4 h-4" />
            : <MessageSquare className="w-4 h-4" />}
          <span className="text-sm font-semibold whitespace-nowrap">
            {open ? 'Close' : 'Ask about Alex'}
          </span>
          {!hasSeen && !open && showIntroPing && (
            <span className="relative flex h-2 w-2 ml-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/70" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
          )}
        </span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.aside
            role="dialog"
            aria-label="Portfolio chat"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed z-50 bottom-20 right-3 md:right-6 w-[min(96vw,420px)] max-h-[min(80vh,720px)] flex flex-col rounded-2xl border border-line bg-surface-1/95 backdrop-blur-xl shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-line">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-500/15 border border-brand-500/30 grid place-items-center">
                  <Sparkles className="w-4 h-4 text-brand-300" />
                </div>
                <div>
                  <div className="text-[10.5px] font-mono uppercase tracking-[0.22em] text-brand-300/90">
                    Portfolio Assistant
                  </div>
                  <div className="text-white font-semibold text-sm mt-0.5 leading-tight">
                    Ask about Alex
                  </div>
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
                      I have a curated knowledge base of Alex's projects, timeline, and background.
                      Ask me anything. Everything runs locally in your browser.
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
                          onClick={() => askText(p)}
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
                  className="flex"
                >
                  {m.role === 'user'
                    ? <UserMessage text={m.text} />
                    : <AssistantMessage payload={m.payload} onFollowUp={followUp} />}
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
              onSubmit={(e) => { e.preventDefault(); askText() }}
              className="border-t border-line p-3 flex items-center gap-2 bg-surface-1/70"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about a project, the internship, availability…"
                className="flex-1 min-w-0 bg-surface-3/40 border border-line rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-brand-500/60"
              />
              <button
                type="submit"
                disabled={!input.trim() || pending}
                className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-brand-500 text-white hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex-shrink-0"
                aria-label="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="px-4 py-2 border-t border-line text-[10.5px] font-mono uppercase tracking-[0.22em] text-gray-500 flex items-center justify-between">
              <span>Local · Nothing leaves your browser</span>
              <span className="hidden sm:inline">Press ? · Esc</span>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

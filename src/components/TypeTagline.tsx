import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  className?: string
  words?: string[]
  speedMs?: number // per-letter stagger (ms)
  pauseEndMs?: number // pause before/after exit (ms)
  mobilePinned?: false | 'top' | 'bottom'
  size?: 'sm' | 'md' | 'lg'
}

// Default phrase per spec
const DEFAULT_WORDS = ['Quotes.', 'Jobs.', 'Payments.', 'All OnSite.']

export default function TypeTagline({
  className,
  words = DEFAULT_WORDS,
  speedMs = 60,
  pauseEndMs = 1000,
  mobilePinned = false,
  size = 'md',
}: Props) {
  const [phase, setPhase] = useState<'in' | 'pauseIn' | 'out' | 'pauseOut'>('in')
  const phrase = useMemo(() => words.join(' '), [words])
  const chars = useMemo(() => phrase.split(''), [phrase])
  const [visibleCount, setVisibleCount] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isActive, setIsActive] = useState(false)

  // Determine activity by DOM position: animate only if our `.item` is the first child in `.list`
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const itemEl = el.closest('.item') as HTMLElement | null
    const listEl = itemEl?.parentElement

    const computeActive = () => {
      if (!itemEl || !listEl || !listEl.classList.contains('list')) {
        // Not inside carousel -> always active
        setIsActive(true)
        return
      }
      setIsActive(listEl.firstElementChild === itemEl)
    }

    computeActive()
    let mo: MutationObserver | null = null
    if (listEl) {
      mo = new MutationObserver(() => computeActive())
      mo.observe(listEl, { childList: true })
    }
    return () => {
      if (mo) mo.disconnect()
    }
  }, [])

  // Reset cycle when becoming visible
  useEffect(() => {
    if (isActive) {
      setPhase('in')
      setVisibleCount(0)
    }
  }, [isActive])

  useEffect(() => {
    if (!isActive) return
    let iv: number | null = null
    let to: number | null = null

    const tick = () => {
      setVisibleCount((c) => {
        if (phase === 'in') {
          const next = Math.min(chars.length, c + 1)
          if (next === chars.length) {
            // reached full phrase
            if (iv) clearInterval(iv)
            to = window.setTimeout(() => setPhase('out'), pauseEndMs)
          }
          return next
        } else if (phase === 'out') {
          const next = Math.max(0, c - 1)
          if (next === 0) {
            if (iv) clearInterval(iv)
            to = window.setTimeout(() => setPhase('in'), pauseEndMs)
          }
          return next
        }
        return c
      })
    }

    if (phase === 'in' || phase === 'out') {
      iv = window.setInterval(tick, Math.max(10, speedMs))
    }

    return () => {
      if (iv) clearInterval(iv)
      if (to) clearTimeout(to)
    }
  }, [phase, chars.length, speedMs, pauseEndMs, isActive])

  const sizeClass = size === 'lg' ? 'text-2xl sm:text-3xl font-bold' : size === 'sm' ? 'text-xs sm:text-sm' : 'text-sm sm:text-base'

  const mobilePinClass = mobilePinned
    ? `fixed left-4 right-4 z-30 ${mobilePinned === 'bottom' ? 'bottom-20' : 'top-16'} sm:static`
    : ''

  return (
    <motion.div
      ref={containerRef}
      className={[
        'inline-flex items-baseline gap-0 font-semibold tracking-tight text-neutral-900',
        sizeClass,
        mobilePinClass,
        className,
      ].filter(Boolean).join(' ')}
    >
      {isActive ? (
        <AnimatePresence initial={false}>
          {chars.slice(0, visibleCount).map((ch, i) => (
            <motion.span
              key={i}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              style={{ whiteSpace: ch === ' ' ? 'pre' as const : undefined }}
            >
              {ch}
            </motion.span>
          ))}
        </AnimatePresence>
      ) : (
        <span style={{ whiteSpace: 'pre' }}>{phrase}</span>
      )}
      {/* caret removed per request */}
    </motion.div>
  )
}

// caret removed: no blink style injection needed anymore

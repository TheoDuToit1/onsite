import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'

const SLIDES = [
  '/Cleaners.jpg',
  '/Electricians.jpg',
  '/Plumbers.jpg',
  '/Roofers.jpg',
  '/Mechanics.jpg',
  '/Pest-control.jpg',
]

const SLIDE_META = [
  { title: 'Cleaning pros', subtitle: 'Schedule, assign, and get paid faster', tint: 'rgba(59,130,246,0.20)' },
  { title: 'Electricians', subtitle: 'From quotes to invoices, all in one place', tint: 'rgba(245,158,11,0.20)' },
  { title: 'Plumbers', subtitle: 'Win jobs with instant quotes', tint: 'rgba(14,165,233,0.20)' },
  { title: 'Roofers', subtitle: 'Track jobs and timelines with ease', tint: 'rgba(244,63,94,0.18)' },
  { title: 'Mechanics', subtitle: 'Repeatable workflows, happy customers', tint: 'rgba(34,197,94,0.18)' },
  { title: 'Pest control', subtitle: 'Route planning and reminders built-in', tint: 'rgba(99,102,241,0.18)' },
]

const AUTO_MS = 7000

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const [paused, setPaused] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const prefersReducedMotion = useMemo(() => typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches, [])

  // Autoplay (respects pause and reduced motion)
  useEffect(() => {
    if (paused || prefersReducedMotion) return
    const id = setInterval(() => {
      setDirection(1)
      setCurrent((c) => (c + 1) % SLIDES.length)
    }, AUTO_MS)
    return () => clearInterval(id)
  }, [paused, prefersReducedMotion])

  // Pause when tab is not visible
  useEffect(() => {
    const onVis = () => setPaused(document.visibilityState !== 'visible')
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  // Preload adjacent images for smoother transitions
  useEffect(() => {
    const next = new Image()
    next.src = SLIDES[(current + 1) % SLIDES.length]
    const prev = new Image()
    prev.src = SLIDES[(current - 1 + SLIDES.length) % SLIDES.length]
  }, [current])

  // Preload all images after mount (idle)
  useEffect(() => {
    const preload = () => SLIDES.forEach((src) => { const img = new Image(); img.decoding = 'async'; img.src = src })
    // @ts-ignore
    if (window.requestIdleCallback) (window as any).requestIdleCallback(preload)
    else setTimeout(preload, 500)
  }, [])

  // (variants removed; using background hero transition instead)

  const paginate = (dir: 1 | -1) => {
    setDirection(dir)
    setCurrent((c) => (c + dir + SLIDES.length) % SLIDES.length)
  }
  // (prev/next indices removed; not needed for background hero)
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gray-50">
      {/* Brand panel - Hidden on mobile, shown on md and up */}
      <div className="hidden md:flex relative overflow-hidden bg-brand-navy text-white">
        {/* Background slider (full-bleed) */}
        <div className="absolute inset-0">
          <AnimatePresence initial={false} custom={direction}>
            <motion.img
              key={SLIDES[current]}
              src={SLIDES[current]}
              alt="Job showcase"
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? '14%' : '-14%', scale: 1.06 }}
              animate={{ opacity: 1, x: '0%', scale: 1.0 }}
              exit={{ opacity: 0, x: direction > 0 ? '-14%' : '14%', scale: 1.04 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0 w-full h-full object-cover"
              draggable={false}
            />
          </AnimatePresence>
          {/* Match landing overlay: gradient to top */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        </div>

        {/* Overlay content */}
        <div className="relative z-10 w-full flex flex-col justify-between p-6 lg:p-10">
          <div className="text-2xl lg:text-3xl font-bold">OnSite</div>
          <div ref={containerRef}
               className="flex flex-col items-center gap-6 outline-none"
               tabIndex={0}
               onMouseEnter={() => setPaused(true)}
               onMouseLeave={() => setPaused(false)}
               onTouchStart={() => setPaused(true)}
               onTouchEnd={() => setPaused(false)}
               onFocus={() => setPaused(true)}
               onBlur={() => setPaused(false)}
               onKeyDown={(e) => {
                 if (e.key === 'ArrowLeft') paginate(-1)
                 if (e.key === 'ArrowRight') paginate(1)
               }}>
            {/* Intentionally no center heading to prevent overlap with caption */}
          </div>

          {/* Arrows */}
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3">
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => paginate(-1)}
              className="h-9 w-9 rounded-full bg-brand-orange text-black hover:opacity-90 flex items-center justify-center transition"
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => paginate(1)}
              className="h-9 w-9 rounded-full bg-brand-orange text-black hover:opacity-90 flex items-center justify-center transition"
            >
              ›
            </button>
          </div>
          {/* Progress bar at top (match landing) */}
          <div className="absolute left-0 right-0 top-0 h-1 bg-black/20">
            <motion.div
              key={current}
              className="h-full bg-brand-orange"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: AUTO_MS / 1000, ease: 'linear' }}
            />
          </div>
          {/* Caption block (bottom-left) */
          }
          <div className="pointer-events-none absolute left-6 right-6 bottom-6 lg:left-10 lg:right-auto lg:bottom-10 max-w-xl">
            <div className="pointer-events-auto inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur-sm border border-white/20">
              <span>Featured</span>
            </div>
            <div className="mt-3 text-2xl lg:text-3xl font-semibold leading-tight drop-shadow">{SLIDE_META[current].title}</div>
            <div className="mt-1 text-sm lg:text-base text-white/90">{SLIDE_META[current].subtitle}</div>
          </div>
        </div>
      </div>

      {/* Form card */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.28 }} 
        className="flex items-center justify-center p-4 sm:p-6 w-full"
      >
        <div className="w-full max-w-lg md:max-w-xl lg:max-w-2xl bg-white shadow-sm sm:shadow-soft rounded-2xl p-5 sm:p-6 md:p-8">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

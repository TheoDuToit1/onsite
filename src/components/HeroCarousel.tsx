import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import TypeTagline from '@/components/TypeTagline'

const SLIDES = [
  {
    img: 'https://u.cubeupload.com/Leo21/eagel1.jpg',
    title: 'All OnSite',
    name: 'Quotes',
    des: 'Send clean, fast quotes with photos and options. Win the work.',
  },
  {
    img: 'https://u.cubeupload.com/Leo21/owl1.jpg',
    title: 'All OnSite',
    name: 'Jobs',
    des: 'Schedule, track, and knock out jobs without the back-and-forth.',
  },
  {
    img: 'https://u.cubeupload.com/Leo21/crow.jpg',
    title: 'All OnSite',
    name: 'Payments',
    des: 'Tap to invoice. Get paid by card or ACH in seconds.',
  },
  {
    img: 'https://u.cubeupload.com/Leo21/butterfly1.jpeg',
    title: 'All OnSite',
    name: 'Inbox',
    des: 'Every text and email in one thread. Nothing slips through.',
  },
]

const AUTO_MS = 7000

export default function HeroCarousel() {
  const [index, setIndex] = useState(0)
  const timerRef = useRef<number | null>(null)

  const next = () => setIndex((i) => (i + 1) % SLIDES.length)
  const prev = () => setIndex((i) => (i - 1 + SLIDES.length) % SLIDES.length)

  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => next(), AUTO_MS)
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
  }, [index])

  const slide = SLIDES[index]

  return (
    <div className="relative w-full h-[88vh] sm:h-[92vh] overflow-hidden rounded-none">
      {/* Background image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.img}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.img})` }}
        />
      </AnimatePresence>

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

      {/* Progress bar */}
      <div className="absolute left-0 right-0 top-0 h-1 bg-black/20">
        <motion.div
          key={index}
          className="h-full bg-brand-orange"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: AUTO_MS / 1000, ease: 'linear' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full">
        <div className="max-w-6xl mx-auto h-full px-4 flex items-center">
          <div className="text-white w-full sm:w-[520px] space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/40 px-3 py-1 text-xs sm:text-sm bg-white/10 backdrop-blur">
              Built for field service pros
            </span>
            <TypeTagline size="lg" className="text-white" />
            <div>
              <div className="text-4xl sm:text-6xl font-extrabold leading-[0.95] drop-shadow">{slide.title}</div>
              <div className="text-4xl sm:text-6xl font-extrabold leading-[0.95] text-brand-orange drop-shadow">{slide.name}</div>
            </div>
            <p className="text-neutral-100/90 text-base sm:text-lg">{slide.des}</p>
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <Button asChild size="lg" className="bg-brand-orange hover:bg-brand-orange/90 text-black font-semibold">
                <Link to="/signup">Start free</Link>
              </Button>
              <Button asChild size="lg" variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/30">
                <Link to="/login">Log in</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-3 sm:px-4 z-10">
        <button
          aria-label="Previous"
          onClick={() => { prev() }}
          className="grid place-items-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-orange text-black hover:opacity-90"
        >
          <ChevronLeft />
        </button>
        <button
          aria-label="Next"
          onClick={() => { next() }}
          className="grid place-items-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-brand-orange text-black hover:opacity-90"
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  )
}

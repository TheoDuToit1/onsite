import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

const SLIDES = [
  '/Slide-1.png',
  '/Slide-2.png',
  '/Slide-3.png',
  '/Slide-4.png',
  '/Slide-5.png',
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)

  // Autoplay
  useEffect(() => {
    const id = setInterval(() => {
      setDirection(1)
      setCurrent((c) => (c + 1) % SLIDES.length)
    }, 4000)
    return () => clearInterval(id)
  }, [])

  // Motion variants for sliding
  const variants = {
    enter: (dir: 1 | -1) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: 1 | -1) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  }

  const paginate = (dir: 1 | -1) => {
    setDirection(dir)
    setCurrent((c) => (c + dir + SLIDES.length) % SLIDES.length)
  }
  const prevIndex = (current - 1 + SLIDES.length) % SLIDES.length
  const nextIndex = (current + 1) % SLIDES.length
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gray-50">
      {/* Brand panel - Hidden on mobile, shown on md and up */}
      <div className="hidden md:flex bg-brand-navy text-white p-6 lg:p-10 flex-col justify-between">
        <div>
          <div className="text-2xl lg:text-3xl font-bold">OnSite</div>
          <div className="mt-6 space-y-6">
            <h2 className="text-xl lg:text-2xl font-semibold text-center">OnSite in action</h2>
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5">
              <div className="relative w-full max-w-2xl mx-auto h-80 lg:h-[28rem]" style={{ perspective: '1200px' }}>
                {/* Left (previous) preview */}
                <motion.img
                  key={`prev-${prevIndex}`}
                  src={SLIDES[prevIndex]}
                  alt="Previous"
                  initial={{ opacity: 0, x: -40, rotateY: 25, scale: 0.9 }}
                  animate={{ opacity: 0.6, x: -24, rotateY: 18, scale: 0.92 }}
                  exit={{ opacity: 0, x: -40, rotateY: 25, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-y-6 left-0 right-0 mx-auto w-[82%] h-[88%] object-contain select-none pointer-events-none"
                  style={{ zIndex: 10, filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.35))' }}
                />

                {/* Right (next) preview */}
                <motion.img
                  key={`next-${nextIndex}`}
                  src={SLIDES[nextIndex]}
                  alt="Next"
                  initial={{ opacity: 0, x: 40, rotateY: -25, scale: 0.9 }}
                  animate={{ opacity: 0.6, x: 24, rotateY: -18, scale: 0.92 }}
                  exit={{ opacity: 0, x: 40, rotateY: -25, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-y-6 left-0 right-0 mx-auto w-[82%] h-[88%] object-contain select-none pointer-events-none"
                  style={{ zIndex: 10, filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.35))' }}
                />

                {/* Foreground (current) */}
                <AnimatePresence initial={false} custom={direction}>
                  <motion.img
                    key={`curr-${SLIDES[current]}`}
                    src={SLIDES[current]}
                    alt={`Slide ${current + 1}`}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'spring', stiffness: 300, damping: 30, opacity: { duration: 0.22 } }}
                    className="absolute inset-0 w-full h-full object-contain select-none"
                    style={{ zIndex: 20, filter: 'drop-shadow(0 10px 22px rgba(0,0,0,0.45))' }}
                    draggable={false}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.75}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = Math.abs(offset.x) * velocity.x
                      if (swipe < -500) paginate(1)
                      else if (swipe > 500) paginate(-1)
                    }}
                  />
                </AnimatePresence>
              </div>
              {/* Progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                <motion.div
                  key={current}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4, ease: 'linear' }}
                  className="h-full bg-white/70"
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  aria-label={`Go to slide ${i + 1}`}
                  onClick={() => {
                    setDirection(i > current ? 1 : -1)
                    setCurrent(i)
                  }}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/40 hover:bg-white/70'}`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="h-10" />
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

import { useEffect, useRef } from 'react'
import './ExactHeroCarousel.css'
import TypeTagline from '@/components/TypeTagline'
import { useNavigate } from 'react-router-dom'

export default function ExactHeroCarousel() {
  const rootRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!rootRef.current) return

    const root = rootRef.current
    const nextBtn = root.querySelector<HTMLButtonElement>('.next')!
    const prevBtn = root.querySelector<HTMLButtonElement>('.prev')!
    const carousel = root.querySelector<HTMLDivElement>('.carousel')!
    const list = root.querySelector<HTMLDivElement>('.list')!
    const runningTime = root.querySelector<HTMLDivElement>('.timeRunning')!
    const navLinks = Array.from(root.querySelectorAll<HTMLAnchorElement>('header nav a'))
    const headerEl = root.querySelector<HTMLElement>('header')!

    let timeRunning = 4000
    let timeAutoNext = 12000

    const resetTimeAnimation = () => {
      if (!runningTime) return
      runningTime.style.animation = 'none'
      // force reflow
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      runningTime.offsetHeight
      // reset
      runningTime.style.animation = ''
      runningTime.style.animation = 'runningTime 12s linear 1 forwards'
    }

    let runTimeOut: ReturnType<typeof setTimeout> | null = null
    let runNextAuto: ReturnType<typeof setTimeout> | null = setTimeout(() => {
      nextBtn.click()
    }, timeAutoNext)

    const showSlider = (type: 'next' | 'prev') => {
      const sliderItemsDom = list.querySelectorAll<HTMLDivElement>('.carousel .list .item')

      if (type === 'next') {
        if (sliderItemsDom[0]) list.appendChild(sliderItemsDom[0])
        carousel.classList.add('next')
      } else {
        const last = sliderItemsDom[sliderItemsDom.length - 1]
        if (last) list.prepend(last)
        carousel.classList.add('prev')
      }

      if (runTimeOut) clearTimeout(runTimeOut)
      runTimeOut = setTimeout(() => {
        carousel.classList.remove('next')
        carousel.classList.remove('prev')
      }, timeRunning)

      if (runNextAuto) clearTimeout(runNextAuto)
      runNextAuto = setTimeout(() => {
        nextBtn.click()
      }, timeAutoNext)

      resetTimeAnimation()
    }

    const nextHandler = () => showSlider('next')
    const prevHandler = () => showSlider('prev')
    const handleNavClick = (e: Event) => {
      const el = e.currentTarget as HTMLAnchorElement
      navLinks.forEach(a => a.classList.remove('active'))
      el.classList.add('active')
    }
    const listClickHandler = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const item = target.closest<HTMLDivElement>('.item')
      if (!item) return
      // Only allow clicking preview cards on the right (3rd and beyond)
      if (!(item as Element).matches(':nth-child(n+3)')) return

      // Only trigger when clicking in the bottom-right hotspot of the preview card
      const rect = item.getBoundingClientRect()
      const hotspotSize = 80 // px from right/bottom edges
      const inRight = e.clientX >= rect.right - hotspotSize
      const inBottom = e.clientY >= rect.bottom - hotspotSize
      if (inRight && inBottom) showSlider('next')
    }

    nextBtn.addEventListener('click', nextHandler)
    prevBtn.addEventListener('click', prevHandler)
    navLinks.forEach(a => a.addEventListener('click', handleNavClick))
    list.addEventListener('click', listClickHandler)

    // initialize bar animation
    resetTimeAnimation()

    // Observe hero visibility to toggle header color scheme
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0) {
          headerEl.classList.remove('scrolled')
        } else {
          headerEl.classList.add('scrolled')
        }
      },
      { threshold: 0.01 }
    )
    io.observe(carousel)

    return () => {
      nextBtn.removeEventListener('click', nextHandler)
      prevBtn.removeEventListener('click', prevHandler)
      navLinks.forEach(a => a.removeEventListener('click', handleNavClick))
      list.removeEventListener('click', listClickHandler)
      if (runTimeOut) clearTimeout(runTimeOut)
      if (runNextAuto) clearTimeout(runNextAuto)
      io.disconnect()
    }
  }, [])

  return (
    <div ref={rootRef} className="exact-carousel-root" style={{ backgroundColor: '#000' }}>
      <header>
        <nav>
          <a href="#welcome" className="active">Home</a>
          <a href="#about">About</a>
          <a href="#features">Portfolio</a>
          <a href="#workflow">Services</a>
          <a href="#testimonials">Contact</a>
        </nav>
      </header>

      <div className="carousel relative">
        <div className="list">
          <div className="item" style={{ backgroundImage: "url('/Plumbers.jpg')" }}>
            <div className="content">
              <TypeTagline words={["Your expertise. Our support. More success."]} size="md" className="text-white" />
              <div className="title">ONSITE FOR</div>
              <div className="name">PLUMBERS</div>
              <div className="des">Book more calls. Quote on-site. Get paid today. Stop losing time to admin—own the job.</div>
              <div className="btn">
                <button onClick={() => navigate('/signup')}>Start Free</button>
                <button onClick={() => navigate('/welcome#features')}>See How It Works</button>
              </div>
            </div>
          </div>

          <div className="item" style={{ backgroundImage: "url('/Roofers.jpg')" }}>
            <div className="content">
              <TypeTagline words={["Your expertise. Our support. More success."]} size="md" className="text-white" />
              <div className="title">ONSITE FOR</div>
              <div className="name">ROOFERS</div>
              <div className="des">Fast estimates. Clean proposals. Faster approvals. Fill your calendar now, not next month.</div>
              <div className="btn">
                <button onClick={() => navigate('/signup')}>Start Free</button>
                <button onClick={() => navigate('/welcome#features')}>See How It Works</button>
              </div>
            </div>
          </div>

          <div className="item" style={{ backgroundImage: "url('/Mechanics.jpg')" }}>
            <div className="content">
              <TypeTagline words={["Your expertise. Our support. More success."]} size="md" className="text-white" />
              <div className="title">ONSITE FOR</div>
              <div className="name">MECHANICS</div>
              <div className="des">Schedule, dispatch, and upsell options on the spot. Keep trucks moving and cash flowing.</div>
              <div className="btn">
                <button onClick={() => navigate('/signup')}>Start Free</button>
                <button onClick={() => navigate('/welcome#features')}>See How It Works</button>
              </div>
            </div>
          </div>

          <div className="item" style={{ backgroundImage: "url('/Electricians.jpg')" }}>
            <div className="content">
              <TypeTagline words={["Your expertise. Our support. More success."]} size="md" className="text-white" />
              <div className="title">ONSITE FOR</div>
              <div className="name">ELECTRICIANS</div>
              <div className="des">Clear quotes, tidy invoices, paid faster. Win the job while you’re still on-site.</div>
              <div className="btn">
                <button onClick={() => navigate('/signup')}>Start Free</button>
                <button onClick={() => navigate('/welcome#features')}>See How It Works</button>
              </div>
            </div>
          </div>

          <div className="item" style={{ backgroundImage: "url('/Cleaners.jpg')" }}>
            <div className="content">
              <TypeTagline words={["Your expertise. Our support. More success."]} size="md" className="text-white" />
              <div className="title">ONSITE FOR</div>
              <div className="name">CLEANERS</div>
              <div className="des">Recurring schedules, quick-pay links, and zero-hassle follow-ups. Scale with less stress.</div>
              <div className="btn">
                <button onClick={() => navigate('/signup')}>Start Free</button>
                <button onClick={() => navigate('/welcome#features')}>See How It Works</button>
              </div>
            </div>
          </div>

          <div className="item" style={{ backgroundImage: "url('/Pest-control.jpg')" }}>
            <div className="content">
              <TypeTagline words={["Your expertise. Our support. More success."]} size="md" className="text-white" />
              <div className="title">ONSITE FOR</div>
              <div className="name">PEST CONTROL</div>
              <div className="des">Book inspections, send options, and close on the driveway. Less admin, more revenue.</div>
              <div className="btn">
                <button onClick={() => navigate('/signup')}>Start Free</button>
                <button onClick={() => navigate('/welcome#features')}>See How It Works</button>
              </div>
            </div>
          </div>

        </div>

        <div className="arrows">
          <button className="prev">{'<'}</button>
          <button className="next">{'>'}</button>
        </div>

        <div className="timeRunning"></div>
      </div>
    </div>
  )
}

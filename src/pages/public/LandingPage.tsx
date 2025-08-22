import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import ExactHeroCarousel from '@/components/ExactHeroCarousel'
import {
  Rocket,
  Zap,
  Smartphone,
  Sparkles,
  CalendarDays,
  MessageSquare,
  FileCheck2,
  Wallet,
  Users,
  Bot,
  Star,
  ArrowRight,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col space-y-16 md:space-y-24 pb-24">
      {/* Hero */}
      <section id="welcome" className="pt-0">
        <ExactHeroCarousel />
      </section>

      {/* Act-now CTA */}
      <section>
        <div className="max-w-5xl mx-auto px-4">
          <div className="rounded-2xl border bg-white p-4 sm:p-6 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold">Your expertise. Our support. More success.</h2>
            <p className="text-neutral-700 mt-2">Quotes, jobs, payments—one thumb-friendly app. Fewer taps, faster rands, your evenings back.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
              <Button asChild size="lg"><Link to="/signup">Start Free — Be Live in 5 Minutes</Link></Button>
              <Button asChild size="lg" variant="secondary"><Link to="/login">View Demo</Link></Button>
            </div>
            <div className="text-xs text-neutral-600 mt-2">No credit card needed. Cancel anytime. B-BBEE compliant.</div>
          </div>
        </div>
      </section>

      {/* Logo */}
      <section className="flex justify-center">
        <img 
          src="/Logo.png" 
          alt="OnSite Logo" 
          className="h-32 w-auto object-contain"
        />
      </section>

      {/* Differentiators */}
      <section id="about">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-4">
          {[{
            icon: Rocket,
            title: 'Fewer taps. More jobs.',
            text: 'Skip the admin. Ship quotes, schedule fast, keep the bakkie moving.',
          },{
            icon: Smartphone,
            title: 'Built for SA conditions',
            text: 'Works offline, loads fast on mobile data, perfect for load shedding.',
          },{
            icon: Zap,
            title: 'Live in 5 minutes',
            text: 'Import clients, add your logo, send your first quote today—no IT skills needed.',
          },{
            icon: Sparkles,
            title: 'AI that works for you',
            text: 'Drafts, summaries, follow-ups—locally relevant, always under your control.',
          }].map((d) => (
            <Card key={d.title}>
              <CardHeader className="flex flex-row items-center gap-3">
                <d.icon className="text-brand-orange" />
                <CardTitle className="text-base">{d.title}</CardTitle>
              </CardHeader>
              <CardContent className="text-neutral-700 text-sm">{d.text}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features">
        <div className="max-w-6xl mx-auto px-4 space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold">Your business, simplified</h2>
            <p className="text-neutral-700 mt-2">From lead to paid—today, not tomorrow. Built for South African businesses.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[{
              icon: CalendarDays, title: 'Scheduling', text: 'Drag-and-drop jobs, real-time updates, clear team handoff.'
            },{
              icon: MessageSquare, title: 'Smart Inbox', text: 'WhatsApp, email, and calls in one thread. Templates and quick-replies built-in.'
            },{
              icon: FileCheck2, title: 'Quote Builder', text: 'Fast line items, VAT, signatures, and approvals in a single flow.'
            },{
              icon: Wallet, title: 'Invoices & Payments', text: 'Send invoices, accept cards/EFT, auto-remind overdue balances.'
            },{
              icon: Users, title: 'Client Profiles', text: 'Complete history: jobs, quotes, notes, and B-BBEE status.'
            },{
              icon: Bot, title: 'Automations', text: 'Auto-schedule follow-ups, “on my way” texts, and satisfaction nudges.'
            }].map(f => (
              <Card key={f.title} className="h-full">
                <CardHeader className="flex flex-row items-center gap-3">
                  <f.icon className="text-brand-orange" />
                  <CardTitle className="text-base">{f.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-neutral-700 text-sm">{f.text}</CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow */}
      <section id="workflow">
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-2xl border bg-white p-4 sm:p-6">
            <h3 className="text-lg font-semibold mb-4">From lead to paid, in five delightful steps</h3>
            <div className="grid sm:grid-cols-5 gap-3">
              {[
                { step: '1', title: 'Capture', text: 'Lead lands via WhatsApp, call, or site form—auto-routed to your Inbox.' },
                { step: '2', title: 'Schedule', text: 'Add to calendar, client gets SMS/WhatsApp confirmation instantly.' },
                { step: '3', title: 'Quote', text: 'Build professional quotes on-site with photos and VAT-inclusive pricing.' },
                { step: '4', title: 'Do', text: 'Checklist ensures quality; track materials and labour.' },
                { step: '5', title: 'Get paid', text: 'Instant EFT or card payment; no waiting for funds to clear.' },
              ].map((s, i) => (
                <div key={s.step} className="rounded-xl border p-3">
                  <div className="flex items-center gap-2 font-semibold"><span className="text-brand-orange">{s.step}</span> {s.title}</div>
                  <div className="text-sm text-neutral-700 mt-1">{s.text}</div>
                  {i < 4 && <div className="hidden sm:flex items-center gap-1 text-xs text-neutral-500 mt-2"><ArrowRight size={14} /> next</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section id="testimonials">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-3 gap-4">
          {[
            { quote: 'OnSite cut our admin time in half. Our clients in Joburg and Cape Town love the quick responses.', author: 'Thabo, HVAC Specialist' },
            { quote: 'Quotes that took 20 minutes now take 2. We\'re winning more tenders in Durban.', author: 'Nomsa, Electrical Contractor' },
            { quote: 'Perfect for SA conditions—works offline during load shedding. A game-changer for my team.', author: 'Pieter, Plumbing Business Owner' },
          ].map((t, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-1 text-yellow-500 mb-2">
                  {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                </div>
                <div className="text-sm">“{t.quote}”</div>
                <div className="text-xs text-neutral-700 mt-2">{t.author}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Stats strip */}
      <section>
        <div className="max-w-6xl mx-auto px-4 grid sm:grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { k: '2m+', v: 'ZAR processed' },
            { k: '98%', v: 'on-time completion' },
            { k: '7x', v: 'faster invoicing' },
            { k: 'R0', v: 'setup fees' },
          ].map(s => (
            <div key={s.v} className="rounded-xl border p-4 text-center">
              <div className="text-3xl font-bold">{s.k}</div>
              <div className="text-sm text-neutral-700">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-xl font-semibold mb-4">Questions, answered</h3>
          <div className="space-y-3">
            {[{
              q: 'Do I need a credit card to start?', a: 'No. Start for free—no card needed. We offer EFT and card payments when you upgrade.'
            },{
              q: 'Does it handle VAT and B-BBEE?', a: 'Yes, we support VAT calculations and B-BBEE documentation for your business compliance.'
            },{
              q: 'Will it work during load shedding?', a: 'Absolutely. Core features work offline, and all data syncs automatically when you\'re back online.'
            }].map((f, i) => (
              <details key={i} className="rounded-xl border p-3 bg-white">
                <summary className="cursor-pointer font-medium">{f.q}</summary>
                <div className="text-sm text-neutral-700 mt-2">{f.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section>
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <h3 className="text-2xl sm:text-3xl font-bold">Ready to transform your business?</h3>
          <p className="text-neutral-700 max-w-2xl mx-auto">From Cape Town to Johannesburg, SA businesses trust OnSite to save time and get paid faster. Start free and see the difference today.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg"><Link to="/signup">Start Free Now</Link></Button>
            <Button asChild size="lg" variant="secondary"><Link to="/contact">Book a Demo</Link></Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t py-4 text-center text-xs text-neutral-600">
        <div className="max-w-6xl mx-auto px-4">
          <p>© {new Date().getFullYear()} OnSite. Proudly South African. B-BBEE compliant.</p>
          <div className="mt-2 space-x-4">
            <Link to="/terms" className="hover:underline">Terms</Link>
            <Link to="/privacy" className="hover:underline">Privacy</Link>
            <Link to="/bbbee" className="hover:underline">B-BBEE</Link>
            <Link to="/contact" className="hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

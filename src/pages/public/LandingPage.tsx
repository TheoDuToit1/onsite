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
    <div className="space-y-16 md:space-y-24 pb-24">
      {/* Hero */}
      <section id="welcome" className="pt-0">
        <ExactHeroCarousel />
      </section>

      {/* Differentiators */}
      <section id="about">
        <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-4 gap-4">
          {[{
            icon: Rocket,
            title: 'Outcome over clicks',
            text: 'We design for results—fewer screens, faster actions, smarter defaults.',
          },{
            icon: Smartphone,
            title: 'Mobile-first muscle',
            text: 'Every control is thumb-ready with sensible spacing and offline-friendly flows.',
          },{
            icon: Zap,
            title: 'Blazing setup',
            text: 'Import clients, add your logo, send your first quote in under 5 minutes.',
          },{
            icon: Sparkles,
            title: 'Human + AI',
            text: 'Draft quotes, summarize messages, and auto-follow-up—always under your control.',
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
            <h2 className="text-2xl sm:text-3xl font-bold">Everything you need—beautifully simple</h2>
            <p className="text-neutral-700 mt-2">From lead to paid without switching tabs.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[{
              icon: CalendarDays, title: 'Scheduling', text: 'Drag-and-drop jobs, real-time updates, clear technician handoff.'
            },{
              icon: MessageSquare, title: 'Smart Inbox', text: 'Text, email, and calls in one thread. Templates and quick-replies built-in.'
            },{
              icon: FileCheck2, title: 'Quote Builder', text: 'Fast line items, taxes, signatures, and approvals in a single flow.'
            },{
              icon: Wallet, title: 'Invoices & Payments', text: 'Send invoices, accept cards/ACH, auto-remind overdue balances.'
            },{
              icon: Users, title: 'Client Profiles', text: 'All history in one place: jobs, quotes, notes, attachments.'
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
                { step: '1', title: 'Capture', text: 'Lead lands via SMS, phone, or site form—auto-routed to Inbox.' },
                { step: '2', title: 'Schedule', text: 'Drop on the calendar, client gets confirmation instantly.' },
                { step: '3', title: 'Quote', text: 'Build a quote on-site with photos and clear options.' },
                { step: '4', title: 'Do', text: 'Checklist keeps the job tight; notes and parts tracked.' },
                { step: '5', title: 'Get paid', text: 'Tap to invoice; customer pays on their phone in seconds.' },
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
            { quote: 'OnSite cut our admin time in half. Clients love how fast we respond now.', author: 'Jamie, HVAC Owner' },
            { quote: 'Quotes that used to take 20 minutes now take 2. We win more jobs, period.', author: 'Riley, Electrical Contractor' },
            { quote: 'Finally, a tool that respects the job site and the thumb. Perfect on mobile.', author: 'Morgan, Plumber' },
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
            { k: '2m+', v: 'messages handled' },
            { k: '98%', v: 'on-time jobs' },
            { k: '7x', v: 'faster quoting' },
            { k: '0$', v: 'setup fees' },
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
              q: 'Do I need a credit card to start?', a: 'Nope. Jump in, invite your team, and try real workflows without a card.'
            },{
              q: 'Can I import my existing clients?', a: 'Yes. Upload a CSV and you’re ready to go in minutes.'
            },{
              q: 'Does it work offline?', a: 'Core job flows are designed to be resilient. Take notes and photos; they’ll sync when you’re back online.'
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
          <h3 className="text-2xl sm:text-3xl font-bold">Make your next workday frictionless</h3>
          <p className="text-neutral-700 max-w-2xl mx-auto">Join crews who get more done with OnSite. It’s the tool we wanted on the truck—so we built it.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg"><Link to="/signup">Create your free account</Link></Button>
            <Button asChild size="lg" variant="secondary"><Link to="/login">Log in</Link></Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-xs text-neutral-600">
        © {new Date().getFullYear()} OnSite. Built with care for field service pros.
      </footer>
    </div>
  )
}

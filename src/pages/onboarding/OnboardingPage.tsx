import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/state/auth'

const steps = ['Trade', 'Business', 'Services', 'Payments', 'Preferences', 'Invite']

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const navigate = useNavigate()
  const completeOnboarding = useAuthStore((s) => s.completeOnboarding)
  const [form, setForm] = useState({
    trade: '',
    niche: '',
    businessName: '',
    phone: '',
    city: '',
    services: '',
    rateType: 'hourly' as 'hourly' | 'fixed',
    rate: '',
    acceptCards: 'yes' as 'yes' | 'no',
    bank: '',
    preferences: '',
    invites: ''
  })

  const update = (key: keyof typeof form, value: string) => setForm((f) => ({ ...f, [key]: value }))

  const stepContent = () => {
    switch (step) {
      case 0: // Trade
        return (
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-neutral-700 mb-1">Primary trade</div>
                  <Select value={form.trade} onValueChange={(v)=>update('trade', v)}>
                    <SelectTrigger><SelectValue placeholder="e.g., Plumbing" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="plumbing">Plumbing</SelectItem>
                      <SelectItem value="electrical">Electrical</SelectItem>
                      <SelectItem value="hvac">HVAC</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                      <SelectItem value="landscaping">Landscaping</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="text-sm text-neutral-700 mb-1">Niche (optional)</div>
                  <Input placeholder="e.g., Commercial, Residential" value={form.niche} onChange={(e)=>update('niche', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case 1: // Business
        return (
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <div className="text-sm text-neutral-700 mb-1">Business name</div>
                  <Input placeholder="OnSite Heating & Air" value={form.businessName} onChange={(e)=>update('businessName', e.target.value)} />
                </div>
                <div>
                  <div className="text-sm text-neutral-700 mb-1">Phone</div>
                  <Input placeholder="+27 82 000 0000" value={form.phone} onChange={(e)=>update('phone', e.target.value)} />
                </div>
                <div>
                  <div className="text-sm text-neutral-700 mb-1">City</div>
                  <Input placeholder="Cape Town" value={form.city} onChange={(e)=>update('city', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case 2: // Services
        return (
          <Card>
            <CardContent className="p-4 space-y-3">
              <div>
                <div className="text-sm text-neutral-700 mb-1">Services you offer</div>
                <Textarea placeholder="e.g., Installation, Maintenance, Emergency callouts" value={form.services} onChange={(e)=>update('services', e.target.value)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-neutral-700 mb-1">Rate type</div>
                  <Select value={form.rateType} onValueChange={(v)=>update('rateType', v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="text-sm text-neutral-700 mb-1">Standard rate</div>
                  <Input placeholder={form.rateType==='hourly' ? 'R / hour' : 'R / job'} value={form.rate} onChange={(e)=>update('rate', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case 3: // Payments
        return (
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-neutral-700 mb-1">Accept card payments</div>
                  <Select value={form.acceptCards} onValueChange={(v)=>update('acceptCards', v)}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="text-sm text-neutral-700 mb-1">Bank (for payouts)</div>
                  <Input placeholder="e.g., FNB" value={form.bank} onChange={(e)=>update('bank', e.target.value)} />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      case 4: // Preferences
        return (
          <Card>
            <CardContent className="p-4 space-y-3">
              <div>
                <div className="text-sm text-neutral-700 mb-1">Quote & invoice footer</div>
                <Textarea placeholder="Thank you for your business!" value={form.preferences} onChange={(e)=>update('preferences', e.target.value)} />
              </div>
            </CardContent>
          </Card>
        )
      case 5: // Invite
        return (
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="text-sm text-neutral-700">Invite teammates (optional)</div>
              <div className="grid sm:grid-cols-[1fr_auto] gap-2 max-w-xl">
                <Input placeholder="email@company.com, comma separated" value={form.invites} onChange={(e)=>update('invites', e.target.value)} />
                <Button type="button" variant="outline">Send invites</Button>
              </div>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }
  return (
    <div className="max-w-3xl mx-auto">
      <header className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-semibold">Get set up</h1>
        <div className="text-sm">Step {step + 1} of {steps.length}</div>
      </header>
      <div className="flex gap-2 mb-4">
        {steps.map((_, i) => (
          <div key={i} className={`h-2 flex-1 rounded-full ${i <= step ? 'bg-brand-orange' : 'bg-neutral-200'}`} />
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }} transition={{ duration: 0.25 }} className="rounded-2xl bg-white p-4 border shadow-soft min-h-[200px]">
          {stepContent()}
        </motion.div>
      </AnimatePresence>
      <div className="mt-4 flex justify-between">
        <button className="px-4 py-2 rounded-xl bg-neutral-200" disabled={step===0} onClick={()=>setStep((s)=>Math.max(0,s-1))}>Back</button>
        {step < steps.length - 1 ? (
          <button className="px-4 py-2 rounded-xl bg-brand-orange text-white" onClick={()=>setStep((s)=>Math.min(steps.length-1,s+1))}>Continue</button>
        ) : (
          <button
            className="px-4 py-2 rounded-xl bg-brand-orange text-white"
            onClick={() => { completeOnboarding(); navigate('/dashboard') }}
          >
            Finish and go to Dashboard
          </button>
        )}
      </div>
    </div>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const steps = ['Trade', 'Business', 'Services', 'Payments', 'Preferences', 'Invite']

export default function OnboardingPage() {
  const [step, setStep] = useState(0)
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
          <div className="text-neutral-700">{steps[step]} content (placeholder)</div>
        </motion.div>
      </AnimatePresence>
      <div className="mt-4 flex justify-between">
        <button className="px-4 py-2 rounded-xl bg-neutral-200" disabled={step===0} onClick={()=>setStep((s)=>Math.max(0,s-1))}>Back</button>
        {step < steps.length - 1 ? (
          <button className="px-4 py-2 rounded-xl bg-brand-orange text-white" onClick={()=>setStep((s)=>Math.min(steps.length-1,s+1))}>Continue</button>
        ) : (
          <a className="px-4 py-2 rounded-xl bg-brand-orange text-white" href="/dashboard">Go to Dashboard</a>
        )}
      </div>
    </div>
  )
}

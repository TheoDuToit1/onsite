import { motion } from 'framer-motion'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* Brand panel */}
      <div className="hidden md:flex bg-brand-navy text-white p-10 flex-col justify-between">
        <div className="text-3xl font-bold">OnSite</div>
        <div>
          <h2 className="text-2xl font-semibold mb-2">Run your field ops from anywhere.</h2>
          <ul className="space-y-2 text-neutral-100/90">
            <li>• Schedule jobs faster</li>
            <li>• Send quotes that convert</li>
            <li>• Get paid on time</li>
          </ul>
        </div>
        <div className="h-40 rounded-2xl bg-white/10" />
      </div>

      {/* Form card */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28 }} className="flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white shadow-soft rounded-2xl p-6">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

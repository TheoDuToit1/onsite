import { motion } from 'framer-motion'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gray-50">
      {/* Brand panel - Hidden on mobile, shown on md and up */}
      <div className="hidden md:flex bg-brand-navy text-white p-6 lg:p-10 flex-col justify-between">
        <div className="text-2xl lg:text-3xl font-bold">OnSite</div>
        <div className="space-y-4">
          <h2 className="text-xl lg:text-2xl font-semibold">Run your field ops from anywhere.</h2>
          <ul className="space-y-3 text-neutral-100/90 text-sm lg:text-base">
            <li className="flex items-center gap-2">
              <span>•</span>
              <span>Schedule jobs faster</span>
            </li>
            <li className="flex items-center gap-2">
              <span>•</span>
              <span>Send quotes that convert</span>
            </li>
            <li className="flex items-center gap-2">
              <span>•</span>
              <span>Get paid on time</span>
            </li>
          </ul>
        </div>
        <div className="h-32 lg:h-40 rounded-2xl bg-white/10 mt-6 lg:mt-0" />
      </div>

      {/* Form card */}
      <motion.div 
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.28 }} 
        className="flex items-center justify-center p-4 sm:p-6 w-full"
      >
        <div className="w-full max-w-md bg-white shadow-sm sm:shadow-soft rounded-2xl p-5 sm:p-6 md:p-8">
          {children}
        </div>
      </motion.div>
    </div>
  )
}

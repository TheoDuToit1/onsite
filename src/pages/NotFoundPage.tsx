import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="text-neutral-700">The page you are looking for doesn’t exist.</p>
        <Link to="/dashboard" className="inline-block px-4 py-2 rounded-xl bg-brand-orange text-white">Go Home</Link>
      </div>
    </div>
  )
}

import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Bell, Home, Briefcase, MessageSquare, Wallet, MoreHorizontal, Search, User } from 'lucide-react'
import { useAuthStore } from '../state/auth'

export default function AppLayout() {
  const location = useLocation()
  const user = useAuthStore((s) => s.user)
  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr]">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex flex-col gap-4 border-r bg-white p-4">
        <div className="text-2xl font-bold text-brand-navy">
          OnSite{user?.niche ? <span className="text-base font-medium text-neutral-700"> / {user.niche}</span> : null}
        </div>
        <nav className="flex flex-col gap-1 text-sm">
          <SideLink to="/dashboard" label="Home" icon={<Home size={18} />} />
          <SideLink to="/jobs" label="Jobs" icon={<Briefcase size={18} />} />
          <SideLink to="/inbox" label="Inbox" icon={<MessageSquare size={18} />} />
          <SideLink to="/invoices" label="Finance" icon={<Wallet size={18} />} />
          <SideLink to="/settings" label="More" icon={<MoreHorizontal size={18} />} />
        </nav>
      </aside>

      {/* Main */}
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <div className="font-semibold">{headerTitle(location.pathname)}</div>
            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-neutral-200 rounded-2xl text-sm text-neutral-700">
                <Search size={16} />
                <span className="hidden lg:inline">Search (Ctrl/Cmd + K)</span>
              </div>
              <button aria-label="Notifications" className="p-2 rounded-full hover:bg-neutral-200">
                <Bell size={18} />
              </button>
              <NavLink to="/settings" className="p-2 rounded-full hover:bg-neutral-200">
                <User size={18} />
              </NavLink>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 pb-24 md:p-6 md:pb-6">
          <Outlet />
        </main>

        {/* Bottom Nav (mobile) */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 border-t bg-white grid grid-cols-5">
          <TabLink to="/dashboard" label="Home" icon={<Home size={20} />} />
          <TabLink to="/jobs" label="Jobs" icon={<Briefcase size={20} />} />
          <TabLink to="/inbox" label="Inbox" icon={<MessageSquare size={20} />} />
          <TabLink to="/invoices" label="Finance" icon={<Wallet size={20} />} />
          <TabLink to="/settings" label="More" icon={<MoreHorizontal size={20} />} />
        </nav>
      </div>
    </div>
  )
}

function headerTitle(pathname: string) {
  if (pathname.startsWith('/dashboard')) return 'Today'
  if (pathname.startsWith('/jobs')) return 'Jobs'
  if (pathname.startsWith('/calendar')) return 'Calendar'
  if (pathname.startsWith('/quotes')) return 'Quotes'
  if (pathname.startsWith('/invoices')) return 'Invoices'
  if (pathname.startsWith('/clients')) return 'Clients'
  if (pathname.startsWith('/inbox')) return 'Inbox'
  if (pathname.startsWith('/marketing')) return 'Marketing'
  if (pathname.startsWith('/reports')) return 'Reports'
  if (pathname.startsWith('/settings')) return 'Settings'
  return 'OnSite'
}

function SideLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 rounded-xl px-3 py-2 ${isActive ? 'bg-neutral-200 text-brand-navy font-semibold' : 'hover:bg-neutral-200'}`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  )
}

function TabLink({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center gap-1 py-2 text-xs ${isActive ? 'text-brand-orange' : 'text-neutral-700'}`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  )
}

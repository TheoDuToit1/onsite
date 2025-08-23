import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Bell, Home, Briefcase, MessageSquare, Wallet, MoreHorizontal, Search, User, Calendar, FileSignature, FileText, Users, BarChart3 } from 'lucide-react'
import { useAuthStore } from '../state/auth'
import { useEffect, useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [openCmd, setOpenCmd] = useState(false)
  const user = useAuthStore((s) => s.user)
  // Keyboard shortcut: Ctrl/Cmd + K to open command palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpenCmd((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  return (
    <div className="min-h-screen grid md:grid-cols-[240px_1fr]">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex flex-col gap-4 border-r border-neutral-200 bg-gradient-to-b from-white to-neutral-50 p-4">
        <div className="text-2xl font-bold text-brand-navy">
          OnSite{user?.niche ? <span className="text-base font-medium text-neutral-700"> / {user.niche}</span> : null}
        </div>
        <nav className="flex flex-col gap-3 text-sm">
          <div>
            <div className="px-3 pb-1 text-[11px] uppercase tracking-wide text-neutral-500">Work</div>
            <div className="flex flex-col gap-1">
              <SideLink to="/dashboard" label="Dashboard" icon={<Home size={18} />} />
              <SideLink to="/jobs" label="Jobs" icon={<Briefcase size={18} />} />
              <SideLink to="/calendar" label="Calendar" icon={<Calendar size={18} />} />
            </div>
          </div>
          <hr className="border-neutral-200" />
          <div>
            <div className="px-3 pb-1 text-[11px] uppercase tracking-wide text-neutral-500">Sales</div>
            <div className="flex flex-col gap-1">
              <SideLink to="/quotes" label="Quotes" icon={<FileSignature size={18} />} />
              <SideLink to="/invoices" label="Invoices" icon={<FileText size={18} />} />
              <SideLink to="/clients" label="Clients" icon={<Users size={18} />} />
            </div>
          </div>
          <hr className="border-neutral-200" />
          <div>
            <div className="px-3 pb-1 text-[11px] uppercase tracking-wide text-neutral-500">Communication</div>
            <div className="flex flex-col gap-1">
              <SideLink to="/inbox" label="Inbox" icon={<MessageSquare size={18} />} />
            </div>
          </div>
          <hr className="border-neutral-200" />
          <div>
            <div className="px-3 pb-1 text-[11px] uppercase tracking-wide text-neutral-500">System</div>
            <div className="flex flex-col gap-1">
              <SideLink to="/reports" label="Reports" icon={<BarChart3 size={18} />} />
              <SideLink to="/settings" label="Settings" icon={<MoreHorizontal size={18} />} />
            </div>
          </div>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
          <div className="flex items-center justify-between gap-2 px-4 py-3">
            <div className="font-semibold">{headerTitle(location.pathname)}</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOpenCmd(true)}
                className="hidden md:flex items-center gap-2 px-3 py-2 rounded-2xl text-sm text-neutral-700 border border-neutral-200 hover:border-orange-300 hover:text-orange-700 transition-colors"
                aria-label="Open Search"
              >
                <Search size={16} />
                <span className="hidden lg:inline">Search (Ctrl/Cmd + K)</span>
              </button>
              <button aria-label="Notifications" className="p-2 rounded-full hover:bg-neutral-200">
                <Bell size={18} />
              </button>
              <NavLink to="/settings" className="p-2 rounded-full hover:bg-neutral-200">
                <User size={18} />
              </NavLink>
            </div>
          </div>
        </header>

        {/* Command Palette */}
        <Dialog open={openCmd} onOpenChange={setOpenCmd}>
          <DialogContent className="p-0 overflow-hidden max-w-lg rounded-3xl border-0 bg-gradient-to-br from-white to-orange-50/30 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <Command className="bg-transparent">
              {/* Header */}
              <div className="px-6 py-4 border-b border-orange-100/50">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <h3 className="font-semibold text-neutral-800">Quick Navigation</h3>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Search className="h-4 w-4 text-orange-600" />
                  <CommandInput className="h-10 bg-transparent placeholder:text-neutral-500 border-0 focus-visible:ring-0 focus:outline-none" placeholder="Type to search..." />
                </div>
              </div>

              <CommandList className="max-h-[60vh] px-4 py-3">
                <CommandEmpty className="py-6 text-center text-neutral-600">
                  <div className="text-2xl mb-2">🔍</div>
                  <div>No results found</div>
                </CommandEmpty>

                <CommandGroup heading="QUICK ACTIONS">
                  <CommandItem value="new quote create" onSelect={() => { navigate('/quotes/new'); setOpenCmd(false) }} className="px-3 py-2.5 rounded-xl hover:bg-orange-100/60 aria-selected:bg-orange-200/80 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                        <FileSignature className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-neutral-900">New Quote</div>
                        <div className="text-xs text-neutral-600">Create and send a quote</div>
                      </div>
                      <div className="text-xs text-neutral-400">⌘N</div>
                    </div>
                  </CommandItem>
                  <CommandItem value="new job create" onSelect={() => { navigate('/jobs'); setOpenCmd(false) }} className="px-3 py-2.5 rounded-xl hover:bg-orange-100/60 aria-selected:bg-orange-200/80 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                        <Briefcase className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-neutral-900">New Job</div>
                        <div className="text-xs text-neutral-600">Start a new project</div>
                      </div>
                      <div className="text-xs text-neutral-400">⌘J</div>
                    </div>
                  </CommandItem>
                </CommandGroup>

                <CommandGroup heading="NAVIGATE TO">
                  <CommandItem value="dashboard home" onSelect={() => { navigate('/dashboard'); setOpenCmd(false) }} className="px-3 py-2 rounded-xl hover:bg-orange-100/60 aria-selected:bg-orange-200/80 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Home className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-neutral-900">Dashboard</span>
                    </div>
                  </CommandItem>
                  <CommandItem value="jobs work" onSelect={() => { navigate('/jobs'); setOpenCmd(false) }} className="px-3 py-2 rounded-xl hover:bg-orange-100/60 aria-selected:bg-orange-200/80 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Briefcase className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-neutral-900">Jobs</span>
                    </div>
                  </CommandItem>
                  <CommandItem value="quotes estimates" onSelect={() => { navigate('/quotes'); setOpenCmd(false) }} className="px-3 py-2 rounded-xl hover:bg-orange-100/60 aria-selected:bg-orange-200/80 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <FileSignature className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-neutral-900">Quotes</span>
                    </div>
                  </CommandItem>
                  <CommandItem value="invoices billing" onSelect={() => { navigate('/invoices'); setOpenCmd(false) }} className="px-3 py-2 rounded-xl hover:bg-orange-100/60 aria-selected:bg-orange-200/80 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-neutral-900">Invoices</span>
                    </div>
                  </CommandItem>
                  <CommandItem value="clients customers" onSelect={() => { navigate('/clients'); setOpenCmd(false) }} className="px-3 py-2 rounded-xl hover:bg-orange-100/60 aria-selected:bg-orange-200/80 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-neutral-900">Clients</span>
                    </div>
                  </CommandItem>
                  <CommandItem value="calendar schedule" onSelect={() => { navigate('/calendar'); setOpenCmd(false) }} className="px-3 py-2 rounded-xl hover:bg-orange-100/60 aria-selected:bg-orange-200/80 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-orange-600" />
                      <span className="font-medium text-neutral-900">Calendar</span>
                    </div>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </DialogContent>
        </Dialog>

        <main className="flex-1 p-4 pb-24 md:p-6 md:pb-6">
          <Outlet />
        </main>

        {/* Bottom Nav (mobile) */}
        <nav className="md:hidden fixed bottom-0 inset-x-0 border-t bg-white grid grid-cols-5">
          <TabLink to="/dashboard" label="Home" icon={<Home size={20} />} />
          <TabLink to="/jobs" label="Jobs" icon={<Briefcase size={20} />} />
          <TabLink to="/inbox" label="Inbox" icon={<MessageSquare size={20} />} />
          <TabLink to="/invoices" label="Invoices" icon={<Wallet size={20} />} />
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
        [
          'group relative flex items-center gap-3 rounded-xl px-3 py-2 transition-colors',
          isActive
            ? 'bg-orange-50 text-orange-700 font-semibold border border-orange-200'
            : 'text-slate-700 hover:bg-orange-50 hover:text-orange-700'
        ].join(' ')
      }
    >
      {({ isActive }) => (
        <>
          {isActive ? (
            <span aria-hidden className="absolute left-1 top-1/2 -translate-y-1/2 h-6 w-1 rounded-full bg-[#F97316]" />
          ) : null}
          <span className="shrink-0 text-slate-500 group-hover:text-orange-700 transition-colors">{icon}</span>
          <span className="truncate">{label}</span>
        </>
      )}
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

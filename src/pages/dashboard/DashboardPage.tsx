import { motion } from 'framer-motion'
import { CalendarDays, DollarSign, FileCheck2, UserPlus, Wrench, Sparkles, TrendingUp, Zap, Clock, CheckCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import TypeTagline from '@/components/TypeTagline'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ExpenseForm from '@/components/expenses/ExpenseForm'
import { useFinanceStore } from '@/state/finance'
import { useEffect, useMemo, useState } from 'react'
import { ResponsiveContainer, ComposedChart, Bar, XAxis, YAxis, Tooltip, Legend, Line, CartesianGrid } from 'recharts'
import PageIntro from '@/components/PageIntro'

// Helper functions
const getBusinessName = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('businessName') || 'Team';
  }
  return 'Team';
};

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 18) return 'Afternoon';
  return 'Evening';
};

const getRandomTip = () => {
  const tips = [
    '85% pay more',
    '30% more acceptances',
    'Faster than 92%',
    '3 jobs this week',
    '12% more jobs',
    '4.8/5.0 ⭐',
    '98% on-time',
    'Top 10%'
  ];
  return tips[Math.floor(Math.random() * tips.length)];
};

export default function DashboardPage() {
  const getMonthlySummary = useFinanceStore((s) => s.getMonthlySummary)
  const exportCSV = useFinanceStore((s) => s.exportCSV)
  const exportPDF = useFinanceStore((s) => s.exportPDF)
  const data = useMemo(() => getMonthlySummary().slice(-6), [getMonthlySummary])
  // Getting Started checklist (persist in localStorage)
  const [checklist, setChecklist] = useState([
    { id: 'client', label: 'Add your first client', to: '/clients/new', done: false },
    { id: 'job', label: 'Create your first job', to: '/jobs/new', done: false },
    { id: 'quote', label: 'Send a quote', to: '/quotes/new', done: false },
    { id: 'invoice', label: 'Create an invoice', to: '/invoices/new', done: false },
  ])
  useEffect(() => {
    const raw = localStorage.getItem('gs-v1')
    if (raw) {
      try { setChecklist((prev) => prev.map(s => ({ ...s, done: !!JSON.parse(raw)[s.id] }))) } catch {}
    }
  }, [])
  const toggleDone = (id: string) => {
    setChecklist((prev) => {
      const next = prev.map((s) => s.id === id ? { ...s, done: !s.done } : s)
      const map: Record<string, boolean> = {}
      next.forEach((s) => { map[s.id] = s.done })
      localStorage.setItem('gs-v1', JSON.stringify(map))
      return next
    })
  }
  return (
    <div className="space-y-6 p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header with greeting and stats */}
      <header className="bg-gradient-to-r from-primary/5 to-primary/10 p-6 rounded-2xl border border-primary/20">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-2xl md:text-3xl font-bold text-orange-600" style={{
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '-0.5px',
              lineHeight: 1.1
            }}>
              Good {getTimeOfDay()}, {getBusinessName()} 👋
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              {new Date().toLocaleDateString('en-ZA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          
          {/* Quick Stats + Info */}
          <div className="flex items-start gap-3">
            <div className="grid grid-cols-3 gap-3 min-w-fit">
              {[
                { label: 'Status', value: 'Active', color: 'bg-green-500' },
                { label: 'Rating', value: '4.8/5.0', color: 'bg-amber-400' },
                { label: 'On Time', value: '98%', color: 'bg-blue-500' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`w-2 h-2 rounded-full ${stat.color}`}></span>
                    <span className="font-semibold">{stat.value}</span>
                  </div>
                </div>
              ))}
            </div>
            <PageIntro
              pageKey="dashboard"
              title="Dashboard"
              intro="Your command center. Track today, act quickly, and understand your money at a glance."
              bullets={[
                'Quick stats: health indicators for your business',
                'Quick actions: jump to common tasks (new job, quote, client)',
                "Status overview: helpful context like load shedding and holidays",
                'Your Money: snapshot of revenue, overdue, VAT',
                'Getting Started: guided checklist to set up core items',
                'Expenses & Cashflow: add expenses and view income vs expenses with net profit'
              ]}
            />
          </div>
        </div>
      </header>

      {/* Getting Started */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Getting Started</h2>
            <div className="text-sm text-neutral-600">
              {checklist.filter(s=>s.done).length} / {checklist.length} complete
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {checklist.map((s) => (
              <div key={s.id} className={`flex items-center justify-between gap-3 rounded-xl border p-3 ${s.done ? 'bg-emerald-50 border-emerald-200' : ''}`}>
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleDone(s.id)} className={`w-6 h-6 rounded-full border flex items-center justify-center ${s.done ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-neutral-300'}`} aria-label="Mark complete">
                    {s.done ? <CheckCircle size={16} /> : <span className="w-3 h-3 rounded-full" />}
                  </button>
                  <div className="font-medium">{s.label}</div>
                </div>
                <Button asChild size="sm" variant={s.done ? 'secondary' : 'default'}>
                  <Link to={s.to}>{s.done ? 'View' : 'Start'}</Link>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            title: 'Jobs Today', 
            value: '3', 
            change: '+2', 
            icon: <Wrench className="w-5 h-5 text-blue-500" />, 
            trend: 'up',
            color: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20'
          },
          { 
            title: 'Pending Quotes', 
            value: '5', 
            change: '+1', 
            icon: <FileCheck2 className="w-5 h-5 text-amber-500" />, 
            trend: 'up',
            color: 'bg-amber-500/10',
            borderColor: 'border-amber-500/20'
          },
          { 
            title: 'Revenue (Week)', 
            value: 'R152K', 
            change: '12%', 
            icon: <DollarSign className="w-5 h-5 text-emerald-500" />, 
            trend: 'up',
            color: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20'
          },
          { 
            title: 'Overdue', 
            value: 'R24.5K', 
            change: '8%', 
            icon: <Clock className="w-5 h-5 text-rose-500" />, 
            trend: 'down',
            color: 'bg-rose-500/10',
            borderColor: 'border-rose-500/20'
          },
        ].map((stat, index) => (
          <motion.div 
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-5 rounded-xl border ${stat.borderColor} ${stat.color} backdrop-blur-sm`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${stat.trend === 'up' ? 'bg-green-100 dark:bg-green-900/30' : 'bg-rose-100 dark:bg-rose-900/30'}`}>
                {stat.icon}
              </div>
            </div>
            <div className={`mt-3 text-sm font-medium ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-rose-600 dark:text-rose-400'}`}>
              <span>{stat.change} {stat.trend === 'up' ? '↑' : '↑'}</span>
              <span className="text-muted-foreground text-xs ml-1">vs last week</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions & Status */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Quick Actions</h2>
          <Button variant="ghost" size="sm" className="text-primary">
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { 
              label: 'New Job', 
              icon: <Wrench className="w-5 h-5" />,
              color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
              href: '/jobs/new'
            },
            { 
              label: 'Create Quote', 
              icon: <FileCheck2 className="w-5 h-5" />,
              color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
              href: '/quotes/new'
            },
            { 
              label: 'Record Payment', 
              icon: <DollarSign className="w-5 h-5" />,
              color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
              href: '/payments/new'
            },
            { 
              label: 'Add Client', 
              icon: <UserPlus className="w-5 h-5" />,
              color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
              href: '/clients/new'
            },
          ].map((action, index) => (
            <motion.div 
              key={action.label}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to={action.href}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${action.color}`}>
                      {action.icon}
                    </div>
                    <div className="font-medium">{action.label}</div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Status Overview */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Status Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { 
              label: 'Load Shedding', 
              value: 'Stage 2', 
              icon: <Zap className="w-5 h-5 text-amber-500" />,
              trend: 'down',
              change: 'Improving',
              color: 'bg-amber-500/10',
              href: '/loadshedding'
            },
            { 
              label: 'Public Holiday', 
              value: 'None', 
              icon: <CalendarDays className="w-5 h-5 text-blue-500" />,
              trend: 'neutral',
              change: 'Next: 24 Sep',
              color: 'bg-blue-500/10',
              href: '/calendar'
            },
          ].map((item) => (
            <motion.div 
              key={item.label}
              whileHover={{ y: -2, transition: { duration: 0.15 } }}
            >
              <Link to={item.href}>
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${item.color}`}>
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">{item.label}</div>
                          <div className="text-xl font-semibold">{item.value}</div>
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {item.change}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Your Money */}
      <div className="space-y-2">
        <div className="font-semibold">Your Money (ZAR)</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Revenue (week)', value: 'R152,100', icon: <DollarSign /> },
            { label: 'Overdue invoices', value: 'R24,500', icon: <CalendarDays /> },
            { label: 'VAT to pay', value: 'R21,315', icon: <DollarSign /> },
            { label: 'Next payment run', value: '28 Feb', icon: <CalendarDays /> },
          ].map((s) => (
            <motion.div whileHover={{ scale: 1.01 }} key={s.label}>
              <Card>
                <CardContent className="p-4">
                  <div className="text-neutral-700 text-sm flex items-center gap-2">
                    <span className="opacity-70">{s.icon}</span>
                    {s.label}
                  </div>
                  <div className="mt-1 text-2xl font-bold">{s.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {[
          { label: 'Schedule Job', to: '/jobs/new' },
          { label: 'Send Quote', to: '/quotes/new' },
          { label: 'Collect EFT', to: '/invoices/new' },
          { label: 'Add Client', to: '/clients/new' },
          { label: 'Load Shedding', to: '/schedule' },
        ].map((a) => (
          <Button
            asChild
            key={a.label}
            variant="secondary"
            className="rounded-2xl text-xs sm:text-sm font-semibold h-auto py-3 sm:py-4 hover:shadow-lg transition-shadow"
          >
            <Link to={a.to}>{a.label}</Link>
          </Button>
        ))}
      </div>

      {/* Agenda & Route */}
      <Tabs defaultValue="agenda" className="space-y-3">
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="agenda" className="flex-1 sm:flex-none">Today's Agenda</TabsTrigger>
          <TabsTrigger value="route" className="flex-1 sm:flex-none">Optimized Route</TabsTrigger>
          <TabsTrigger value="loadshedding" className="flex-1 sm:flex-none">Load Shedding</TabsTrigger>
        </TabsList>
        <TabsContent value="agenda">
          <Card>
            <CardContent className="p-0 divide-y">
              {[
                { id: 'j1', time: '9:00 AM', title: 'Smith Family — HVAC tune-up', addr: '12 Oak St' },
                { id: 'j2', time: '11:30 AM', title: 'Acme LLC — Quarterly maintenance', addr: '500 Market' },
                { id: 'j3', time: '2:00 PM', title: 'Lopez Home — Leak inspection', addr: '77 Elm Ave' },
              ].map((item) => (
                <div key={item.title} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
                  <div>
                    <div className="text-sm text-neutral-700">{item.time}</div>
                    <div className="font-semibold">{item.title}</div>
                    <div className="text-sm text-neutral-700">{item.addr}</div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button asChild variant="secondary" className="w-full sm:w-auto"><Link to={`/jobs/${item.id}`}>On my way</Link></Button>
                    <Button asChild className="w-full sm:w-auto"><Link to={`/jobs/${item.id}`}>Start</Link></Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="route">
          <Card>
            <CardContent className="p-4 h-64">Map & route optimization (coming soon)</CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pipeline Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {['New', 'Scheduled', 'Completed'].map((col) => (
          <Card key={col}>
            <CardContent className="p-4 space-y-3">
              <div className="font-semibold">{col}</div>
              <div className="rounded-xl border p-3">{col} job 1</div>
              <div className="rounded-xl border p-3">{col} job 2</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-0 divide-y">
          {[
            'Quote #Q-102 sent to Acme LLC',
            'Invoice #INV-220 paid by Smith Family',
            'Job scheduled: Lopez Home — 2:00 PM',
            'New client added: Rivera Corp',
          ].map((a) => (
            <div key={a} className="p-4 text-sm">{a}</div>
          ))}
        </CardContent>
      </Card>

      {/* Expenses & Cashflow */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-semibold">Expenses & Cashflow</h2>
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCSV}>Export CSV</Button>
            <Button onClick={exportPDF}>Export PDF</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Add Expense */}
          <div className="space-y-2">
            <div className="text-sm text-neutral-700">Add expense: amount, description, link to a job (optional)</div>
            <ExpenseForm />
          </div>
          {/* Chart */}
          <Card>
            <CardContent className="p-4 h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(val: any) => `R ${Number(val).toLocaleString('en-ZA')}`} />
                  <Legend />
                  <Bar dataKey="income" name="Income" fill="#10b981" radius={[6,6,0,0]} isAnimationActive animationBegin={100} animationDuration={600} />
                  <Bar dataKey="expenses" name="Expenses" fill="#ef4444" radius={[6,6,0,0]} isAnimationActive animationBegin={200} animationDuration={700} />
                  <Line type="monotone" dataKey="net" name="Net Profit" stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive />
                </ComposedChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

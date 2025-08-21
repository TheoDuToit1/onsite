import { motion } from 'framer-motion'
import { CalendarDays, DollarSign, FileCheck2, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import TypeTagline from '@/components/TypeTagline'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Today</h1>
          <p className="text-sm text-neutral-700">{new Date().toLocaleDateString()}</p>
        </div>
      </header>

      {/* Welcome card */}
      <Card>
        <CardContent className="p-4">
          <TypeTagline />
        </CardContent>
      </Card>

      {/* Your Jobs at a Glance */}
      <div className="space-y-2">
        <div className="font-semibold">Your Jobs at a Glance</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Jobs today', value: 3, icon: <Wrench /> },
            { label: 'Pending quotes', value: 5, icon: <FileCheck2 /> },
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

      {/* Your Money */}
      <div className="space-y-2">
        <div className="font-semibold">Your Money</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Revenue (week)', value: '$8,450', icon: <DollarSign /> },
            { label: 'Overdue invoices', value: 2, icon: <CalendarDays /> },
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
          { label: 'Collect Payment', to: '/invoices/new' },
          { label: 'New Client', to: '/clients/new' },
          { label: 'On My Way', to: '/jobs' },
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
          <TabsTrigger value="agenda" className="flex-1 sm:flex-none">Agenda</TabsTrigger>
          <TabsTrigger value="route" className="flex-1 sm:flex-none">Route</TabsTrigger>
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
    </div>
  )
}

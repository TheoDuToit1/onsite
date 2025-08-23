import { Link, useLocation } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'
import PageIntro from '@/components/PageIntro'
import { useEffect, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'

export default function JobsPage() {
  const location = useLocation()
  const [tab, setTab] = useState<'today' | 'schedule' | 'pipeline'>('today')

  useEffect(() => {
    const hash = (location.hash || '').replace('#', '') as 'today' | 'schedule' | 'pipeline' | ''
    if (hash && ['today', 'schedule', 'pipeline'].includes(hash)) {
      setTab(hash)
    }
  }, [location.hash])

  const jobs = [
    { id: 'j1', client: 'Smith Family', address: '12 Oak St', time: '9:00–11:00', status: 'Morning' },
    { id: 'j2', client: 'Acme LLC', address: '500 Market', time: '11:30–13:00', status: 'Ongoing' },
    { id: 'j3', client: 'Lopez Home', address: '77 Elm Ave', time: '14:00–16:00', status: 'Afternoon' },
  ]
  return (
    <div className="space-y-4">
      <PageHeader
        title="Jobs"
        actions={(
          <div className="flex items-center gap-2">
            <PageIntro
              pageKey="jobs"
              title="Jobs"
              intro="Plan the day, schedule work, and track job progress from new to completed."
              bullets={[
                'Today: see and start jobs scheduled for today',
                'Schedule: plan upcoming work via calendar',
                'Pipeline: track jobs across New, Scheduled, Completed',
                'Create job: schedule a new visit and assign techs',
                'Details: client, address, notes, and time windows'
              ]}
            />
            <Button asChild>
              <Link to="/jobs/new">Create job</Link>
            </Button>
          </div>
        )}
      />

      <Tabs value={tab} onValueChange={(v)=>setTab(v as typeof tab)} className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline</TabsTrigger>
        </TabsList>

        <TabsContent value="today">
          <Card>
            <CardContent className="p-0 divide-y">
              {jobs.map(j => (
                <Link key={j.id} to={`/jobs/${j.id}`} className="flex justify-between p-4 hover:bg-neutral-200/50">
                  <div>
                    <div className="font-semibold">{j.client}</div>
                    <div className="text-sm text-neutral-700">{j.address}</div>
                  </div>
                  <div className="text-sm text-neutral-700">{j.time}</div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardContent className="p-4">
              <div className="grid md:grid-cols-[1fr_1.2fr] gap-4 items-start">
                <div className="rounded-2xl border p-3">
                  <Calendar mode="single" className="w-full" />
                </div>
                <div className="space-y-3">
                  <div className="font-semibold">Upcoming</div>
                  {jobs.map(j => (
                    <div key={j.id} className="rounded-xl border p-3 text-sm flex items-center justify-between">
                      <div>
                        <div className="font-medium">{j.client}</div>
                        <div className="text-neutral-700">{j.address}</div>
                      </div>
                      <div className="text-neutral-700">{j.time}</div>
                    </div>
                  ))}
                  <div className="pt-1">
                    <Button asChild variant="outline"><Link to="/calendar">Open full calendar</Link></Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline">
          <div className="grid md:grid-cols-3 gap-3">
            {['New', 'Scheduled', 'Completed'].map(col => (
              <Card key={col}>
                <CardContent className="p-4 space-y-3">
                  <div className="font-semibold">{col}</div>
                  <div className="rounded-xl border p-3">Sample job</div>
                  <div className="rounded-xl border p-3">Another job</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

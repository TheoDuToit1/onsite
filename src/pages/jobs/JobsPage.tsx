import { Link } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import TypeTagline from '@/components/TypeTagline'

export default function JobsPage() {
  const jobs = [
    { id: 'j1', client: 'Smith Family', address: '12 Oak St', time: '9:00–11:00', status: 'Morning' },
    { id: 'j2', client: 'Acme LLC', address: '500 Market', time: '11:30–13:00', status: 'Ongoing' },
    { id: 'j3', client: 'Lopez Home', address: '77 Elm Ave', time: '14:00–16:00', status: 'Afternoon' },
  ]
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Jobs</h1>
        <Button asChild><Link to="/jobs/new">Create job</Link></Button>
      </div>
      <TypeTagline />

      <Tabs defaultValue="today" className="space-y-4">
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
            <CardContent className="p-4 h-64">Calendar view (coming soon)</CardContent>
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

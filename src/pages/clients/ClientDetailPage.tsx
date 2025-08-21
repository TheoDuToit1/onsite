import { Link, useParams } from 'react-router-dom'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export default function ClientDetailPage() {
  const { id } = useParams()
  const name = id === 'c1' ? 'Smith Family' : id === 'c2' ? 'Acme LLC' : `Client ${id}`
  const jobs = [
    { id: 'j101', title: 'AC maintenance', date: '2025-08-18', status: 'Completed' },
    { id: 'j102', title: 'Furnace tune-up', date: '2025-08-25', status: 'Scheduled' },
  ]
  const quotes = [
    { id: 'q201', title: 'New condenser install', amount: 3200, status: 'Sent' },
    { id: 'q202', title: 'Duct cleaning', amount: 450, status: 'Draft' },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">{name}</h1>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="secondary"><Link to={`/clients`}>Back to clients</Link></Button>
          <Button asChild variant="secondary"><Link to={`/jobs/new`}>New job</Link></Button>
          <Button asChild><Link to={`/quotes/new`}>New quote</Link></Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="flex flex-wrap gap-2 mb-3 sm:mb-4">
          <TabsTrigger value="overview" className="flex-1 sm:flex-none">Overview</TabsTrigger>
          <TabsTrigger value="jobs" className="flex-1 sm:flex-none">Jobs</TabsTrigger>
          <TabsTrigger value="quotes" className="flex-1 sm:flex-none">Quotes</TabsTrigger>
          <TabsTrigger value="contact" className="flex-1 sm:flex-none">Contact</TabsTrigger>
          <TabsTrigger value="tags" className="flex-1 sm:flex-none">Tags</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-2 sm:mt-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Overview (Client {id})</CardTitle>
                <CardDescription>Account summary and recent activity.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border p-4">
                    <div className="text-sm text-neutral-700">Total jobs</div>
                    <div className="text-2xl font-semibold">{jobs.length}</div>
                  </div>
                  <div className="rounded-xl border p-4">
                    <div className="text-sm text-neutral-700">Quotes</div>
                    <div className="text-2xl font-semibold">{quotes.length}</div>
                  </div>
                  <div className="rounded-xl border p-4">
                    <div className="text-sm text-neutral-700">Lifetime value</div>
                    <div className="text-2xl font-semibold">$3,650</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-neutral-700 mb-2">Recent activity</div>
                  <div className="rounded-xl border divide-y">
                    <div className="p-3">Quote {quotes[0].id} sent — {quotes[0].title}</div>
                    <div className="p-3">Job {jobs[0].id} completed — {jobs[0].title}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact</CardTitle>
                <CardDescription>Primary contact details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">Phone: <span className="text-neutral-700">(555) 123-4567</span></div>
                <div className="text-sm">Email: <span className="text-neutral-700">smith@example.com</span></div>
                <div className="text-sm">Address: <span className="text-neutral-700">123 Main St, San Jose, CA</span></div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Jobs */}
        <TabsContent value="jobs" className="mt-2 sm:mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Jobs</CardTitle>
              <CardDescription>Work history for this client.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y">
              {jobs.map(j => (
                <Link key={j.id} to={`/jobs/${j.id}`} className="flex items-center justify-between p-3 hover:bg-neutral-200/50 rounded-xl">
                  <div>
                    <div className="font-medium">{j.title}</div>
                    <div className="text-sm text-neutral-700">{j.date}</div>
                  </div>
                  <div className="text-sm text-neutral-700">{j.status}</div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quotes */}
        <TabsContent value="quotes" className="mt-2 sm:mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Quotes</CardTitle>
              <CardDescription>Estimates and proposals for this client.</CardDescription>
            </CardHeader>
            <CardContent className="divide-y">
              {quotes.map(q => (
                <Link key={q.id} to={`/quotes/${q.id}`} className="flex items-center justify-between p-3 hover:bg-neutral-200/50 rounded-xl">
                  <div>
                    <div className="font-medium">{q.title}</div>
                    <div className="text-sm text-neutral-700">{q.status}</div>
                  </div>
                  <div className="font-medium">${'{'}q.amount{'}'}</div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact */}
        <TabsContent value="contact" className="mt-2 sm:mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
              <CardDescription>Update primary contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <div className="text-sm text-neutral-700 mb-1">Name</div>
                  <Input defaultValue={name} />
                </div>
                <div>
                  <div className="text-sm text-neutral-700 mb-1">Phone</div>
                  <Input defaultValue="(555) 123-4567" />
                </div>
                <div>
                  <div className="text-sm text-neutral-700 mb-1">Email</div>
                  <Input defaultValue="smith@example.com" />
                </div>
                <div className="sm:col-span-2">
                  <div className="text-sm text-neutral-700 mb-1">Address</div>
                  <Input defaultValue="123 Main St, San Jose, CA" />
                </div>
                <div className="sm:col-span-2">
                  <div className="text-sm text-neutral-700 mb-1">Notes</div>
                  <Textarea placeholder="Gate code, pets, parking…" />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary">Cancel</Button>
                <Button>Save changes</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tags */}
        <TabsContent value="tags" className="mt-2 sm:mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Organize this client with tags.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded-full border text-sm">HVAC</span>
                <span className="px-2 py-1 rounded-full border text-sm">VIP</span>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                <Input placeholder="Add a tag" className="flex-1" />
                <Button className="w-full sm:w-auto">Add</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

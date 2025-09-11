import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function ClientDetailPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [client, setClient] = useState<{
    id: string
    name: string
    email: string | null
    phone: string | null
    address: any | null
  } | null>(null)
  const [jobs, setJobs] = useState<Array<{ id: string; title: string; scheduled_at: string | null; status: string }>>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const load = async () => {
      if (!id) return
      setLoading(true)
      try {
        const { data: c, error: cErr } = await supabase
          .schema('core')
          .from('v_clients')
          .select('id, name, email, phone, address')
          .eq('id', id)
          .maybeSingle()
        if (cErr) {
          console.debug('Load client error', cErr)
        }
        if (c) {
          setClient(c as any)
          setName((c as any).name || '')
          setPhone((c as any).phone || '')
          setEmail((c as any).email || '')
          setAddress((c as any).address?.text || '')
        }
        const { data: js, error: jErr } = await supabase
          .schema('core')
          .from('v_jobs')
          .select('id, title, scheduled_at, status')
          .eq('client_id', id)
          .order('scheduled_at', { ascending: false, nullsFirst: false })
        if (jErr) {
          console.debug('Load jobs error', jErr)
        }
        setJobs(js || [])
      } catch (e) {
        console.debug('Client detail load exception', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const onSaveContact = async () => {
    if (!client) return
    try {
      const { error } = await supabase
        .schema('core')
        .from('v_clients')
        .update({
          name: name.trim() || null,
          phone: phone || null,
          email: email || null,
          address: address ? { text: address } : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', client.id)
      if (error) throw error
      toast.success('Client updated')
    } catch (e) {
      console.error(e)
      toast.error('Could not update client')
    }
  }

  const titleName = client?.name || `Client ${id}`

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">{titleName}</h1>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="secondary"><Link to={`/clients`}>Back to clients</Link></Button>
          <Button asChild variant="secondary"><Link to={`/jobs/new`}>Create Job</Link></Button>
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
                <CardTitle>Overview</CardTitle>
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
                    <div className="text-2xl font-semibold">0</div>
                  </div>
                  <div className="rounded-xl border p-4">
                    <div className="text-sm text-neutral-700">Lifetime value</div>
                    <div className="text-2xl font-semibold">—</div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-neutral-700 mb-2">Recent activity</div>
                  <div className="rounded-xl border divide-y">
                    {jobs.length === 0 ? (
                      <div className="p-3">No recent activity</div>
                    ) : (
                      <div className="p-3">Job {jobs[0].id} — {jobs[0].title}</div>
                    )}
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
                <div className="text-sm">Phone: <span className="text-neutral-700">{client?.phone || '—'}</span></div>
                <div className="text-sm">Email: <span className="text-neutral-700">{client?.email || '—'}</span></div>
                <div className="text-sm">Address: <span className="text-neutral-700">{client?.address?.text || '—'}</span></div>
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
                    <div className="text-sm text-neutral-700">{j.scheduled_at ? new Date(j.scheduled_at).toLocaleString() : 'Unscheduled'}</div>
                  </div>
                  <div className="text-sm text-neutral-700 capitalize">{j.status.replace('_',' ')}</div>
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
              <div className="p-3 text-sm text-neutral-700">No quotes yet.</div>
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
                  <Input value={name} onChange={(e)=> setName(e.target.value)} />
                </div>
                <div>
                  <div className="text-sm text-neutral-700 mb-1">Phone</div>
                  <Input value={phone} onChange={(e)=> setPhone(e.target.value)} />
                </div>
                <div>
                  <div className="text-sm text-neutral-700 mb-1">Email</div>
                  <Input value={email} onChange={(e)=> setEmail(e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <div className="text-sm text-neutral-700 mb-1">Address</div>
                  <Input value={address} onChange={(e)=> setAddress(e.target.value)} />
                </div>
                <div className="sm:col-span-2">
                  <div className="text-sm text-neutral-700 mb-1">Notes</div>
                  <Textarea placeholder="Gate code, pets, parking…" value={notes} onChange={(e)=> setNotes(e.target.value)} />
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" type="button">Cancel</Button>
                <Button type="button" onClick={onSaveContact}>Save changes</Button>
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

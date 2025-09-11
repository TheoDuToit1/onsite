import { Link, useLocation } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import PageHeader from '@/components/PageHeader'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function QuotesPage() {
  const location = useLocation()
  const [tab, setTab] = useState<'all'|'draft'|'sent'|'accepted'|'declined'>('all')
  const [loading, setLoading] = useState(true)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [quotes, setQuotes] = useState<Array<{ id: string; status: string; total: number }>>([])

  useEffect(() => {
    const hash = (location.hash || '').replace('#', '') as typeof tab | ''
    const allowed = ['all','draft','sent','accepted','declined'] as const
    if (hash && (allowed as readonly string[]).includes(hash)) {
      setTab(hash as typeof tab)
    }
  }, [location.hash])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setQuotes([]); setOrgId(null); return }
        const uid = user.id
        const { data: prof } = await supabase
          .schema('core')
          .from('profiles')
          .select('default_org_id')
          .eq('id', uid)
          .maybeSingle()
        const currentOrgId = prof?.default_org_id ?? null
        setOrgId(currentOrgId)
        if (!currentOrgId) { setQuotes([]); return }

        const { data, error } = await supabase
          .schema('core')
          .from('v_quotes_summary')
          .select('id, status, total')
          .eq('org_id', currentOrgId)
          .order('created_at', { ascending: false })
        if (error) {
          console.debug('Load quotes error', error)
          setQuotes([])
        } else {
          setQuotes((data || []).map((q: any) => ({ id: q.id, status: (q.status || 'draft'), total: Number(q.total || 0) })))
        }
      } catch (e) {
        console.debug('Quotes load exception', e)
        setQuotes([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const draftCount = quotes.filter(q=>q.status?.toLowerCase()==='draft').length
  const sentCount = quotes.filter(q=>q.status?.toLowerCase()==='sent').length
  const acceptedCount = quotes.filter(q=>q.status?.toLowerCase()==='accepted').length
  const acceptedValue = quotes.filter(q=>q.status?.toLowerCase()==='accepted').reduce((s,q)=>s+q.total,0)

  return (
    <div className="space-y-4">
      <PageHeader
        title="Quotes"
        actions={(
          <Button asChild>
            <Link to="/quotes/new">Create quote</Link>
          </Button>
        )}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Draft', value: draftCount },
          { label: 'Sent', value: sentCount },
          { label: 'Accepted', value: acceptedCount },
          { label: 'Accepted value', value: acceptedValue.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' }) },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4">
              <div className="text-neutral-700 text-sm">{s.label}</div>
              <div className="mt-1 text-xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3 flex flex-col md:flex-row gap-2">
          <Input placeholder="Search by client or #" className="md:max-w-xs" />
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="any">
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Date" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any time</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="ytd">Year to date</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Lists */}
      <Tabs value={tab} onValueChange={(v)=>setTab(v as typeof tab)} className="space-y-3">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="declined">Declined</TabsTrigger>
        </TabsList>

        {(['all','draft','sent','accepted','declined'] as const).map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardContent className="p-0 divide-y">
                {quotes
                  .filter(q => tab==='all' ? true : q.status.toLowerCase()===tab)
                  .map(q => (
                    <Link key={q.id} to={`/quotes/${q.id}`} className="flex justify-between p-4 hover:bg-neutral-200/50">
                      <div>
                        <div className="font-semibold">Quote #{q.id.slice(0,8)}</div>
                        <div className="text-sm text-neutral-700">{q.status}</div>
                      </div>
                      <div className="font-semibold">{q.total.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' })}</div>
                    </Link>
                  ))}
                {(!loading && quotes.filter(q => tab==='all' ? true : q.status.toLowerCase()===tab).length===0) && (
                  <div className="p-4 text-sm text-neutral-700">No quotes.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

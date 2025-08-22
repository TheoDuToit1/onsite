import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import TypeTagline from '@/components/TypeTagline'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function QuotesPage() {
  const quotes = [
    { id: 'q1', client: 'Smith Family', total: 420, status: 'Draft' as const },
    { id: 'q2', client: 'Acme LLC', total: 1280, status: 'Sent' as const },
    { id: 'q3', client: 'Lopez Home', total: 260, status: 'Accepted' as const },
    { id: 'q4', client: 'Rivera Corp', total: 980, status: 'Declined' as const },
  ]

  const draftCount = quotes.filter(q=>q.status==='Draft').length
  const sentCount = quotes.filter(q=>q.status==='Sent').length
  const acceptedCount = quotes.filter(q=>q.status==='Accepted').length
  const acceptedValue = quotes.filter(q=>q.status==='Accepted').reduce((s,q)=>s+q.total,0)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Quotes</h1>
        <Button asChild><Link to="/quotes/new">Create quote</Link></Button>
      </div>
      <TypeTagline />

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
      <Tabs defaultValue="all" className="space-y-3">
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
                        <div className="font-semibold">{q.client}</div>
                        <div className="text-sm text-neutral-700">{q.status}</div>
                      </div>
                      <div className="font-semibold">${q.total}</div>
                    </Link>
                  ))}
                {quotes.filter(q => tab==='all' ? true : q.status.toLowerCase()===tab).length===0 && (
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

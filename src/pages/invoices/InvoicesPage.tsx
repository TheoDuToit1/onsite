import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import TypeTagline from '@/components/TypeTagline'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function InvoicesPage() {
  const invoices = [
    { id: 'i1', client: 'Van der Merwe Residence', due: '2025-08-22', amount: 7560, status: 'Unpaid' as const },
    { id: 'i2', client: 'Mabaso Enterprises', due: '2025-08-25', amount: 23450, status: 'Paid' as const },
    { id: 'i3', client: 'Ndlovu Household', due: '2025-08-18', amount: 4680, status: 'Overdue' as const },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Invoices & Payments</h1>
        <Button asChild><Link to="/invoices/new">Create invoice</Link></Button>
      </div>
      <TypeTagline />

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Outstanding', value: 'R12,240' },
          { label: 'Overdue', value: 'R4,680' },
          { label: 'Paid (month)', value: 'R110,160' },
          { label: 'Avg. time to pay', value: '14 days' },
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
              <SelectItem value="unpaid">Unpaid</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="financial">
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Date range" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="financial">This financial year</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="quarter">This quarter</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Lists */}
      <Tabs defaultValue="all" className="space-y-3">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>

        {(['all','unpaid','paid','overdue'] as const).map((tab) => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardContent className="p-0 divide-y">
                {invoices
                  .filter(inv => tab==='all' ? true : inv.status.toLowerCase()===tab)
                  .map(inv => (
                    <Link key={inv.id} to={`/invoices/${inv.id}`} className="flex justify-between p-4 hover:bg-neutral-200/50">
                      <div>
                        <div className="font-semibold">{inv.client}</div>
                        <div className="text-sm text-neutral-700">Due {new Date(inv.due).toLocaleDateString('en-ZA')} • {inv.status}</div>
                      </div>
                      <div className="font-semibold">{inv.amount.toLocaleString('en-ZA', {style: 'currency', currency: 'ZAR'})}</div>
                    </Link>
                  ))}
                {invoices.filter(inv => tab==='all' ? true : inv.status.toLowerCase()===tab).length===0 && (
                  <div className="p-4 text-sm text-neutral-700">No invoices.</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

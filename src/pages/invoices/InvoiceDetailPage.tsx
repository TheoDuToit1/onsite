import { Link, useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

type Item = { id: string; name: string; qty: number; price: number; tax: number }

export default function InvoiceDetailPage() {
  const { id } = useParams()
  const [status, setStatus] = useState<'Draft'|'Sent'|'Paid'|'Overdue'>('Sent')
  const items: Item[] = [
    { id: 'i1', name: 'Service call', qty: 1, price: 120, tax: 0 },
    { id: 'i2', name: 'Labor', qty: 3, price: 100, tax: 0 },
  ]
  const totals = useMemo(() => {
    const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0)
    const tax = items.reduce((s, it) => s + (it.qty * it.price) * (it.tax / 100), 0)
    const total = subtotal + tax
    return { subtotal, tax, total }
  }, [items])

  const client = { id: 'c1', name: 'Smith Family', phone: '(555) 123-4567', email: 'smith@example.com', address: '12 Oak St, Springfield' }
  const [notes, setNotes] = useState('Net 14. Thank you for your business!')

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-neutral-700">Invoices / <span className="text-neutral-900 font-medium">INV-{id}</span></div>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-xl font-semibold">Invoice {id}</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full px-3">
                  <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: status === 'Draft' ? '#64748B' : status === 'Sent' ? '#2563EB' : status === 'Paid' ? '#16A34A' : '#DC2626' }} />
                  {status}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Set status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(['Draft','Sent','Paid','Overdue'] as const).map(s => (
                  <DropdownMenuItem key={s} onClick={() => setStatus(s)}>{s}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="mt-1 text-xs text-neutral-700">Issued: Apr 10 • Due: Apr 24 • Last updated just now</div>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="secondary"><Link to="/inbox">Send</Link></Button>
          <Button asChild variant="outline"><Link to="/invoices">Download PDF</Link></Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          {/* Details / Items */}
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="font-semibold">Details</div>
              <div className="grid grid-cols-2 gap-2 text-sm text-neutral-700">
                <div>Bill to: {client.name}</div>
                <div>Terms: Net 14</div>
                <div>Invoice #: INV-{id}</div>
                <div>PO #: —</div>
              </div>
              <div className="h-px bg-neutral-200" />
              <div className="text-sm text-neutral-700">Line items</div>
              <div className="space-y-2 text-sm">
                {items.map(it => (
                  <div key={it.id} className="grid grid-cols-5 gap-2">
                    <div className="col-span-2">{it.name}</div>
                    <div className="text-right">{it.qty}</div>
                    <div className="text-right">{(it.price).toLocaleString('en-ZA',{style:'currency',currency:'ZAR'})}</div>
                    <div className="text-right font-medium">{(it.qty*it.price).toLocaleString('en-ZA',{style:'currency',currency:'ZAR'})}</div>
                  </div>
                ))}
              </div>
              <div className="h-px bg-neutral-200" />
              <div className="space-y-1">
                <div className="flex justify-between text-sm text-neutral-700"><span>Subtotal</span><span>{totals.subtotal.toLocaleString('en-ZA',{style:'currency',currency:'ZAR'})}</span></div>
                <div className="flex justify-between text-sm text-neutral-700"><span>VAT (15%)</span><span>{totals.tax.toLocaleString('en-ZA',{style:'currency',currency:'ZAR'})}</span></div>
                <div className="flex justify-between text-base font-semibold"><span>Total</span><span>{totals.total.toLocaleString('en-ZA',{style:'currency',currency:'ZAR'})}</span></div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="font-semibold">Notes</div>
              <Textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
              <div className="flex justify-end">
                <Button variant="secondary">Save notes</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Client */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="font-semibold">Client</div>
              <div>{client.name}</div>
              <div className="text-sm text-neutral-700">{client.address}</div>
              <div className="text-sm text-neutral-700">{client.phone}</div>
              <div className="text-sm text-neutral-700">{client.email}</div>
              <div className="pt-2 flex gap-2">
                <Button asChild variant="secondary"><a href={`tel:${client.phone.replace(/[^\d+]/g,'')}`}>Call</a></Button>
                <Button asChild variant="secondary"><Link to="/inbox">Message</Link></Button>
                <Button asChild><Link to={`/clients/${client.id}`}>Open client</Link></Button>
              </div>
            </CardContent>
          </Card>

          {/* Payments */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="font-semibold">Payments</div>
              <div className="text-sm text-neutral-700">No payments recorded.</div>
              <Button className="w-full" asChild><Link to="/invoices">Record payment</Link></Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

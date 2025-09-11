import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription } from '@/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { supabase } from '@/lib/supabase'

export default function QuoteBuilderPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [quoteId, setQuoteId] = useState<string | null>(null)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [client, setClient] = useState<{ id: string|null; name: string; phone?: string; email?: string; address?: string; notes?: string }>({ id: null, name: 'Select client' })
  const [status, setStatus] = useState<'Draft'|'Sent'|'Accepted'|'Declined'>('Draft')
  type LineItem = { id: string; name: string; description?: string; qty: number; price: number; tax: number; discount: number }
  const [items, setItems] = useState<LineItem[]>([])
  const [loading, setLoading] = useState(true)

  const addItem = () => {
    const nid = `li-${Date.now()}`
    setItems((prev) => [...prev, { id: nid, name: '', description: '', qty: 1, price: 0, tax: 0, discount: 0 }])
  }
  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id))
  const updateItem = (id: string, patch: Partial<LineItem>) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)))
  }

  // Load/create quote and items
  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { return }
        const uid = user.id
        const { data: prof } = await supabase
          .schema('core')
          .from('profiles')
          .select('default_org_id')
          .eq('id', uid)
          .maybeSingle()
        const currentOrgId = prof?.default_org_id ?? null
        setOrgId(currentOrgId)
        if (!currentOrgId) { return }

        // Create draft if /quotes/new
        if (id === 'new') {
          const { data, error } = await supabase
            .schema('core')
            .from('v_quotes')
            .insert({ org_id: currentOrgId, status: 'draft' })
            .select('id, status')
            .single()
          if (error) throw error
          setQuoteId(data!.id)
          setStatus((data!.status || 'draft').toLowerCase() as any)
          navigate(`/quotes/${data!.id}`, { replace: true })
          return
        }

        // Load existing quote
        if (id) {
          const { data: q, error: qErr } = await supabase
            .schema('core')
            .from('v_quotes')
            .select('id, org_id, client_id, status')
            .eq('id', id)
            .maybeSingle()
          if (qErr) throw qErr
          if (q) {
            setQuoteId(q.id)
            setOrgId(q.org_id)
            setStatus((q.status || 'draft').toLowerCase() as any)
            // Load client basic info if available
            if (q.client_id) {
              const { data: c } = await supabase
                .schema('core')
                .from('v_clients')
                .select('id, name, phone, email, address')
                .eq('id', q.client_id)
                .maybeSingle()
              if (c) setClient({ id: c.id, name: c.name, phone: c.phone, email: c.email, address: c.address?.text })
            }
          }

          // Load items
          const { data: its, error: iErr } = await supabase
            .schema('core')
            .from('v_quote_items')
            .select('id, name, description, qty, price, tax, discount, sort_order')
            .eq('quote_id', id)
            .order('sort_order', { ascending: true })
          if (iErr) throw iErr
          setItems((its || []).map((r: any) => ({ id: r.id, name: r.name || '', description: r.description || '', qty: Number(r.qty || 0), price: Number(r.price || 0), tax: Number(r.tax || 0), discount: Number(r.discount || 0) })))
        }
      } catch (e) {
        console.debug('Quote init error', e)
      } finally {
        setLoading(false)
      }
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const onSave = async () => {
    if (!quoteId) return
    try {
      // Update quote status
      await supabase
        .schema('core')
        .from('v_quotes')
        .update({ status: status.toLowerCase() })
        .eq('id', quoteId)

      // Replace items
      await supabase
        .schema('core')
        .from('v_quote_items')
        .delete()
        .eq('quote_id', quoteId)

      if (items.length) {
        const rows = items.map((it, idx) => ({
          quote_id: quoteId,
          name: it.name,
          description: it.description || null,
          qty: it.qty,
          price: it.price,
          tax: it.tax,
          discount: it.discount,
          sort_order: idx,
        }))
        await supabase
          .schema('core')
          .from('v_quote_items')
          .insert(rows)
      }
    } catch (e) {
      console.debug('Quote save error', e)
    }
  }

  const currency = (n: number) => n.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' })
  const calc = useMemo(() => {
    const rows = items.map((i) => {
      const base = i.qty * i.price
      const discountAmt = base * (i.discount / 100)
      const taxable = base - discountAmt
      const taxAmt = taxable * (i.tax / 100)
      const total = taxable + taxAmt
      return { base, discountAmt, taxAmt, total }
    })
    const subtotal = rows.reduce((s, r) => s + r.base, 0)
    const discountTotal = rows.reduce((s, r) => s + r.discountAmt, 0)
    const taxTotal = rows.reduce((s, r) => s + r.taxAmt, 0)
    const total = rows.reduce((s, r) => s + r.total, 0)
    return { subtotal, discountTotal, taxTotal, total }
  }, [items])

  const today = new Date()
  const expiry = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000)
  return (
    <div className="space-y-4">
      {/* Header with meta, status, client name trigger */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs text-neutral-700">Quotes / <span className="text-neutral-900 font-medium">Q-{(quoteId || id)}</span></div>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-xl font-semibold">Quote {(quoteId || id)}</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full px-3">
                  <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: status === 'Draft' ? '#64748B' : status === 'Sent' ? '#2563EB' : status === 'Accepted' ? '#16A34A' : '#DC2626' }} />
                  {status}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Set status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(['Draft','Sent','Accepted','Declined'] as const).map((s) => (
                  <DropdownMenuItem key={s} onClick={() => setStatus(s)}>{s}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="mt-1 text-xs text-neutral-700">
            Issue: {today.toLocaleDateString()} • Expires: {expiry.toLocaleDateString()} • Last updated just now
          </div>
          <div className="mt-2 text-sm text-neutral-700">
            Client:{' '}
            <Sheet>
              <SheetTrigger asChild>
                <button className="font-medium text-brand-navy hover:underline">{client.name}</button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>{client.name}</SheetTitle>
                  <SheetDescription>Client details</SheetDescription>
                </SheetHeader>
                <div className="mt-4">
                  <Tabs defaultValue="details" className="space-y-3">
                    <TabsList>
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="activity">Activity</TabsTrigger>
                      <TabsTrigger value="jobs">Jobs</TabsTrigger>
                      <TabsTrigger value="billing">Billing</TabsTrigger>
                    </TabsList>

                    <TabsContent value="details">
                      <div className="space-y-3">
                        <div className="text-sm"><span className="text-neutral-700">Phone:</span> {client.phone || '-'}</div>
                        <div className="text-sm"><span className="text-neutral-700">Email:</span> {client.email || '-'}</div>
                        <div className="text-sm"><span className="text-neutral-700">Address:</span> {client.address || '-'}</div>
                        <div className="text-sm"><span className="text-neutral-700">Notes:</span> {client.notes || '-'}</div>
                        <div className="pt-2 flex gap-2">
                          {client.phone && <Button asChild variant="secondary"><a href={`tel:${client.phone.replace(/[^\d+]/g,'')}`}>Call</a></Button>}
                          <Button asChild variant="secondary"><Link to="/inbox">Message</Link></Button>
                          {client.id && <Link to={`/clients/${client.id}`}><Button>Open client</Button></Link>}
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="activity">
                      <div className="space-y-2 text-sm">
                        {['Called regarding estimate','Emailed quote Q-101','Client requested earlier slot'].map(a => (
                          <div key={a}>• {a}</div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="jobs">
                      <div className="space-y-2 text-sm">
                        {[
                          { id: 'j1', title: 'HVAC tune-up', when: 'Apr 12' },
                          { id: 'j3', title: 'Filter replacement', when: 'May 2' },
                        ].map(j => (
                          <Link key={j.id} to={`/jobs/${j.id}`} className="block rounded-xl border p-2 hover:bg-neutral-200/50">
                            <div className="font-medium">{j.title}</div>
                            <div className="text-neutral-700">{j.when}</div>
                          </Link>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="billing">
                      <div className="space-y-2 text-sm">
                        <div>Outstanding balance: R4,299</div>
                        <Link to="/invoices/i3" className="block rounded-xl border p-2 hover:bg-neutral-200/50">
                          Invoice #INV-220 • Overdue • R4,299
                        </Link>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={onSave} variant="secondary">Save</Button>
          <Button asChild><Link to="/inbox">Send</Link></Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">More</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild><Link to="/quotes/new">Duplicate</Link></DropdownMenuItem>
              <DropdownMenuItem asChild><Link to="/invoices/new">Convert to Invoice</Link></DropdownMenuItem>
              <DropdownMenuSeparator />
              {quoteId && <DropdownMenuItem asChild><Link to={`/quotes/${quoteId}/preview`}>Download PDF</Link></DropdownMenuItem>}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {/* Content grid */}
      <div className="grid md:grid-cols-[1fr_360px] gap-4">
        <Card>
          <CardContent className="p-0">
            {/* Line Items */}
            <div className="px-4 py-3 border-b flex items-center justify-between">
              <div className="font-medium">Line Items</div>
              <Button size="sm" onClick={addItem}>Add line</Button>
            </div>
            <div className="p-4">
              <div className="hidden md:grid grid-cols-[1.2fr_1.4fr_0.7fr_0.9fr_0.8fr_0.8fr_1fr_40px] gap-3 text-xs text-neutral-700 mb-2">
                <div>Item</div>
                <div>Description</div>
                <div>Qty</div>
                <div>Unit price</div>
                <div>Discount %</div>
                <div>Tax %</div>
                <div className="text-right">Amount</div>
                <div></div>
              </div>
              <div className="space-y-3">
                {items.map((it) => {
                  const base = it.qty * it.price
                  const discountAmt = base * (it.discount / 100)
                  const taxable = base - discountAmt
                  const taxAmt = taxable * (it.tax / 100)
                  const amount = taxable + taxAmt
                  return (
                    <div key={it.id} className="grid grid-cols-1 md:grid-cols-[1.2fr_1.4fr_0.7fr_0.9fr_0.8fr_0.8fr_1fr_40px] gap-3 items-start">
                      <Input placeholder="Item" value={it.name} onChange={(e) => updateItem(it.id, { name: e.target.value })} />
                      <Input placeholder="Description" value={it.description} onChange={(e) => updateItem(it.id, { description: e.target.value })} />
                      <Input type="number" step="1" min="0" value={it.qty} onChange={(e) => updateItem(it.id, { qty: Number(e.target.value) || 0 })} />
                      <Input type="number" step="0.01" min="0" value={it.price} onChange={(e) => updateItem(it.id, { price: Number(e.target.value) || 0 })} />
                      <Input type="number" step="0.1" min="0" value={it.discount} onChange={(e) => updateItem(it.id, { discount: Number(e.target.value) || 0 })} />
                      <Input type="number" step="0.1" min="0" value={it.tax} onChange={(e) => updateItem(it.id, { tax: Number(e.target.value) || 0 })} />
                      <div className="h-10 rounded-xl border bg-neutral-50 flex items-center justify-end px-3 text-sm">{currency(amount)}</div>
                      <div className="flex items-center justify-end">
                        <Button variant="outline" size="sm" onClick={() => removeItem(it.id)}>Delete</Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          <Card className="sticky top-20">
            <CardContent className="p-4">
              <div className="font-medium mb-2">Summary</div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between"><span className="text-neutral-700">Subtotal</span><span>{currency(calc.subtotal)}</span></div>
                <div className="flex items-center justify-between"><span className="text-neutral-700">Discount</span><span>-{currency(calc.discountTotal)}</span></div>
                <div className="flex items-center justify-between"><span className="text-neutral-700">Tax</span><span>{currency(calc.taxTotal)}</span></div>
                <div className="h-px bg-neutral-200 my-2" />
                <div className="flex items-center justify-between text-base font-semibold"><span>Total</span><span>{currency(calc.total)}</span></div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button asChild className="flex-1"><Link to={`/quotes/${id}/preview`}>Send for approval</Link></Button>
                <Button asChild variant="outline" className="flex-1"><Link to={`/quotes/${id}/preview`}>Copy link</Link></Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-sm text-neutral-700">Activity</div>
              <div className="mt-2 space-y-2 text-sm">
                <div>Draft created</div>
                <div>Added line item: Service call</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

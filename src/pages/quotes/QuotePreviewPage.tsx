import { useParams, Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

export default function QuotePreviewPage() {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [clientName, setClientName] = useState<string>('')
  type LineItem = { id: string; name: string; description?: string; qty: number; price: number; tax: number; discount: number }
  const [items, setItems] = useState<LineItem[]>([])
  const [footer, setFooter] = useState<string>('')

  const totals = useMemo(() => {
    const rows = items.map(i => {
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

  useEffect(() => {
    const load = async () => {
      if (!id) return
      setLoading(true)
      try {
        // Load quote to get org and client
        const { data: q, error: qErr } = await supabase
          .schema('core')
          .from('v_quotes')
          .select('id, org_id, client_id')
          .eq('id', id)
          .maybeSingle()
        if (qErr) throw qErr
        setOrgId(q?.org_id || null)
        if (q?.client_id) {
          const { data: c } = await supabase
            .schema('core')
            .from('v_clients')
            .select('name')
            .eq('id', q.client_id)
            .maybeSingle()
          if (c) setClientName(c.name || '')
        }

        // Load items
        const { data: its, error: iErr } = await supabase
          .schema('core')
          .from('v_quote_items')
          .select('id, name, description, qty, price, tax, discount')
          .eq('quote_id', id)
          .order('sort_order', { ascending: true })
        if (iErr) throw iErr
        setItems((its || []).map((r: any) => ({ id: r.id, name: r.name, description: r.description || '', qty: Number(r.qty||0), price: Number(r.price||0), tax: Number(r.tax||0), discount: Number(r.discount||0) })))

        // Load footer template
        if (q?.org_id) {
          const { data: t } = await supabase
            .schema('core')
            .from('v_templates')
            .select('body')
            .eq('org_id', q.org_id)
            .eq('name', 'quote_footer')
            .eq('channel', 'email')
            .maybeSingle()
          if (t?.body) setFooter(t.body)
        }
      } catch (e) {
        console.debug('Quote preview load error', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const currency = (n: number) => n.toLocaleString('en-ZA', { style: 'currency', currency: 'ZAR' })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Quote {id} — Preview</h1>
        <div className="flex items-center gap-2">
          <Button asChild variant="secondary"><Link to={`/quotes/${id}`}>Back to edit</Link></Button>
          <Button asChild><Link to="/invoices/new">Convert to Invoice</Link></Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="text-sm text-neutral-700">Client</div>
          <div className="font-semibold">{clientName || '-'}</div>
          <div className="h-px bg-neutral-200" />
          <div className="text-sm text-neutral-700">Line items</div>
          <div className="space-y-1 text-sm">
            {items.map((it) => {
              const base = it.qty * it.price
              const discountAmt = base * (it.discount / 100)
              const taxable = base - discountAmt
              const taxAmt = taxable * (it.tax / 100)
              const amount = taxable + taxAmt
              return (
                <div key={it.id} className="flex justify-between">
                  <span>{it.name || 'Item'}</span>
                  <span>{currency(amount)}</span>
                </div>
              )
            })}
            {!loading && items.length === 0 && (
              <div className="text-neutral-700">No items</div>
            )}
          </div>
          <div className="h-px bg-neutral-200" />
          <div className="space-y-1">
            <div className="flex justify-between text-sm text-neutral-700"><span>Subtotal</span><span>{currency(totals.subtotal)}</span></div>
            <div className="flex justify-between text-sm text-neutral-700"><span>Discount</span><span>-{currency(totals.discountTotal)}</span></div>
            <div className="flex justify-between text-sm text-neutral-700"><span>Tax</span><span>{currency(totals.taxTotal)}</span></div>
            <div className="flex justify-between text-base font-semibold"><span>Total</span><span>{currency(totals.total)}</span></div>
          </div>
          {footer && <div className="pt-4 text-sm text-neutral-700">{footer}</div>}
        </CardContent>
      </Card>
    </div>
  )
}

import { useParams, Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function QuotePreviewPage() {
  const { id } = useParams()
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
          <div className="font-semibold">Smith Family</div>
          <div className="h-px bg-neutral-200" />
          <div className="text-sm text-neutral-700">Line items</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between"><span>Service call</span><span>$120.00</span></div>
            <div className="flex justify-between"><span>Labor</span><span>$300.00</span></div>
          </div>
          <div className="h-px bg-neutral-200" />
          <div className="space-y-1">
            <div className="flex justify-between text-sm text-neutral-700"><span>Subtotal</span><span>$420.00</span></div>
            <div className="flex justify-between text-sm text-neutral-700"><span>Tax</span><span>$0.00</span></div>
            <div className="flex justify-between text-base font-semibold"><span>Total</span><span>$420.00</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

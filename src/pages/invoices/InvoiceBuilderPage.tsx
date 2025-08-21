import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Link } from 'react-router-dom'

export default function InvoiceBuilderPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Create Invoice</h1>
        <div className="flex items-center gap-2">
          <Button asChild variant="secondary"><Link to="/invoices">Cancel</Link></Button>
          <Button asChild><Link to="/invoices">Save Invoice</Link></Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-neutral-700 mb-1">Client</div>
              <Input placeholder="Search or enter client name" />
            </div>
            <div>
              <div className="text-sm text-neutral-700 mb-1">Due date</div>
              <Input placeholder="YYYY-MM-DD" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-neutral-700 mb-1">Amount</div>
              <Input type="number" step="0.01" placeholder="0.00" />
            </div>
            <div>
              <div className="text-sm text-neutral-700 mb-1">Invoice #</div>
              <Input placeholder="Auto" />
            </div>
          </div>
          <div>
            <div className="text-sm text-neutral-700 mb-1">Notes</div>
            <Textarea placeholder="Payment terms, notes, etc." />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

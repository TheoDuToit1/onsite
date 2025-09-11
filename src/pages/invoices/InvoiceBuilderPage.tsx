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
              <div className="text-sm text-neutral-700 mb-1">Client (Company/Individual)</div>
              <Input placeholder="Search or enter client name" />
            </div>
            <div>
              <div className="text-sm text-neutral-700 mb-1">Due date</div>
              <Input placeholder="DD/MM/YYYY" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-neutral-700 mb-1">Amount (ZAR)</div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">R</span>
                <Input type="number" step="0.01" placeholder="0.00" className="pl-8" />
              </div>
            </div>
            <div>
              <div className="text-sm text-neutral-700 mb-1">Invoice #</div>
              <Input placeholder="INV-XXXX" />
            </div>
          </div>
          <div>
            <div className="text-sm text-neutral-700 mb-1">Notes & Payment Terms</div>
            <Textarea placeholder="Payment terms (e.g., EFT, 30 days), banking details, or special instructions" />
            <p className="mt-1 text-xs text-neutral-500">Standard payment terms: 30 days from invoice date. Late payment interest at SARB repo rate + 3%</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

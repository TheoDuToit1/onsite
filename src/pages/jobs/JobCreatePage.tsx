import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Link } from 'react-router-dom'

export default function JobCreatePage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Create Job</h1>
        <div className="flex items-center gap-2">
          <Button asChild variant="secondary"><Link to="/jobs">Cancel</Link></Button>
          <Button asChild><Link to="/jobs">Save Job</Link></Button>
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
              <div className="text-sm text-neutral-700 mb-1">Scheduled time</div>
              <Input placeholder="e.g., 2025-08-22 09:00" />
            </div>
          </div>
          <div>
            <div className="text-sm text-neutral-700 mb-1">Address</div>
            <Input placeholder="Street, City" />
          </div>
          <div>
            <div className="text-sm text-neutral-700 mb-1">Notes</div>
            <Textarea placeholder="Job details, access codes, etc." />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Link } from 'react-router-dom'

export default function ClientCreatePage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">New Client</h1>
        <div className="flex items-center gap-2">
          <Button asChild variant="secondary"><Link to="/clients">Cancel</Link></Button>
          <Button asChild><Link to="/clients">Save Client</Link></Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-neutral-700 mb-1">Name</div>
              <Input placeholder="Full name or business" />
            </div>
            <div>
              <div className="text-sm text-neutral-700 mb-1">Phone</div>
              <Input placeholder="(555) 123-4567" />
            </div>
            <div>
              <div className="text-sm text-neutral-700 mb-1">Email</div>
              <Input placeholder="name@example.com" />
            </div>
            <div>
              <div className="text-sm text-neutral-700 mb-1">Address</div>
              <Input placeholder="Street, City" />
            </div>
          </div>
          <div>
            <div className="text-sm text-neutral-700 mb-1">Notes</div>
            <Textarea placeholder="Preferences, access notes, etc." />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

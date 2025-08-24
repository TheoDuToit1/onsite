import { Link, useParams } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

type ChecklistItem = { id: string; text: string; done: boolean }

export default function JobDetailPage() {
  const { id } = useParams()
  const [status, setStatus] = useState<'Scheduled'|'In Progress'|'Completed'|'Cancelled'>('Scheduled')
  const [items, setItems] = useState<ChecklistItem[]>([
    { id: 't1', text: 'Call when on the way', done: false },
    { id: 't2', text: 'Take before photos', done: false },
    { id: 't3', text: 'Replace air filter', done: true },
  ])
  const [newItem, setNewItem] = useState('')
  const [notes, setNotes] = useState('Customer mentioned a rattling noise near the outdoor unit. Gate code 1234.')

  const client = useMemo(() => ({
    id: 'c1',
    name: 'Smith Family',
    phone: '(555) 123-4567',
    email: 'smith@example.com',
    address: '12 Oak St, Springfield',
  }), [])

  const toggleItem = (cid: string) => setItems(prev => prev.map(it => it.id === cid ? { ...it, done: !it.done } : it))
  const addItem = () => {
    if (!newItem.trim()) return
    const id = 't' + Date.now()
    setItems(prev => [...prev, { id, text: newItem.trim(), done: false }])
    setNewItem('')
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs text-neutral-700">Jobs / <span className="text-neutral-900 font-medium">J-{id}</span></div>
          <div className="mt-1 flex items-center gap-3">
            <h1 className="text-xl font-semibold">Job {id}</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="rounded-full px-3">
                  <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: status === 'Scheduled' ? '#2563EB' : status === 'In Progress' ? '#F59E0B' : status === 'Completed' ? '#16A34A' : '#6B7280' }} />
                  {status}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel>Set status</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {(['Scheduled','In Progress','Completed','Cancelled'] as const).map(s => (
                  <DropdownMenuItem key={s} onClick={() => setStatus(s)}>{s}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="mt-1 text-xs text-neutral-700">Today • 9:00–11:00 • Assigned to Alex</div>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button asChild variant="secondary" className="w-full sm:w-auto"><Link to={`/clients/${client.id}`}>Open client</Link></Button>
          <Button asChild className="w-full sm:w-auto"><Link to="/quotes/new">Create quote</Link></Button>
          <Button asChild className="w-full sm:w-auto"><Link to="/invoices/new">Create invoice</Link></Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-4">
          {/* Timeline */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="font-semibold">Timeline (Job {id})</div>
              {["Job created","Scheduled for today","Technician assigned: Alex"].map(ev => (
                <div key={ev} className="text-sm">• {ev}</div>
              ))}
            </CardContent>
          </Card>

          {/* Checklist */}
          <Card>
            <CardContent className="p-4">
              <div className="font-semibold mb-3">Checklist</div>
              <div className="space-y-2">
                {items.map(it => (
                  <label key={it.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="h-4 w-4" checked={it.done} onChange={() => toggleItem(it.id)} />
                    <span className={it.done ? 'line-through text-neutral-600' : ''}>{it.text}</span>
                  </label>
                ))}
              </div>
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2">
                <Input className="w-full" placeholder="Add item" value={newItem} onChange={(e) => setNewItem(e.target.value)} />
                <Button className="w-full sm:w-auto" size="sm" onClick={addItem}>Add</Button>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="font-semibold">Notes</div>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5} />
              <div className="flex justify-end">
                <Button variant="secondary">Save notes</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Client Card */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="font-semibold">Client</div>
              <div>{client.name}</div>
              <div className="text-sm text-neutral-700">{client.address}</div>
              <div className="text-sm text-neutral-700">{client.phone}</div>
              <div className="text-sm text-neutral-700">{client.email}</div>
              <div className="pt-2 flex flex-wrap gap-2">
                <Button asChild variant="secondary" className="w-full sm:w-auto"><a href={`tel:${client.phone.replace(/[^\d+]/g,'')}`}>Call</a></Button>
                <Button asChild variant="secondary" className="w-full sm:w-auto"><Link to="/inbox">Message</Link></Button>
                <Button asChild className="w-full sm:w-auto"><Link to={`/clients/${client.id}`}>Open client</Link></Button>
              </div>
            </CardContent>
          </Card>

          {/* Attachments */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="font-semibold">Attachments</div>
              <div className="space-y-1 text-sm">
                <div className="rounded-xl border p-2">Before.jpg</div>
                <div className="rounded-xl border p-2">Unit-serial.txt</div>
              </div>
              <div className="pt-2">
                <Button variant="outline" className="w-full">Upload</Button>
              </div>
            </CardContent>
          </Card>

          {/* Financials */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <div className="font-semibold">Financials</div>
              <div className="text-sm text-neutral-700">No invoice yet.</div>
              <div className="flex gap-2 pt-1">
                <Button asChild><Link to="/invoices/new">Create invoice</Link></Button>
                <Button asChild variant="secondary"><Link to="/quotes/new">Create quote</Link></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

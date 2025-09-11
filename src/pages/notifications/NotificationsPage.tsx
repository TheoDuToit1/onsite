import PageHeader from '@/components/PageHeader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useMemo, useState } from 'react'

type Notice = {
  id: string
  type: 'job' | 'message' | 'system' | 'billing'
  title: string
  body: string
  read: boolean
  date: string
}

export default function NotificationsPage() {
  const [notices, setNotices] = useState<Notice[]>([
    { id: 'n1', type: 'job', title: 'Job scheduled', body: 'Lopez Home • Tomorrow 9:00', read: false, date: '2025-08-23T09:10:00Z' },
    { id: 'n2', type: 'message', title: 'New message', body: 'Acme LLC: “Can we move to 11:30?”', read: false, date: '2025-08-23T08:20:00Z' },
    { id: 'n3', type: 'billing', title: 'Invoice paid', body: 'Invoice #1024 • R 7,560', read: true, date: '2025-08-22T16:05:00Z' },
    { id: 'n4', type: 'system', title: 'System update', body: 'New reports available', read: true, date: '2025-08-22T12:00:00Z' },
  ])

  const unreadCount = useMemo(() => notices.filter(n => !n.read).length, [notices])

  const markAsRead = (id: string) => setNotices((prev) => prev.map(n => n.id === id ? { ...n, read: true } : n))
  const clearAll = () => setNotices((prev) => prev.map(n => ({ ...n, read: true })))

  const renderList = (items: Notice[]) => (
    <Card>
      <CardContent className="p-0 divide-y">
        {items.length === 0 ? (
          <div className="p-4 text-sm text-neutral-700">No notifications.</div>
        ) : items.map(n => (
          <div key={n.id} className={`p-4 flex items-start justify-between gap-3 ${n.read ? 'bg-white' : 'bg-orange-50/50'}`}>
            <div>
              <div className="font-medium">{n.title}</div>
              <div className="text-sm text-neutral-700">{n.body}</div>
              <div className="text-xs text-neutral-500 mt-1">{new Date(n.date).toLocaleString('en-ZA')}</div>
            </div>
            {!n.read && (
              <Button size="sm" variant="outline" onClick={() => markAsRead(n.id)}>Mark as read</Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-4">
      <PageHeader title="Notifications" actions={<Button variant="outline" onClick={clearAll} disabled={unreadCount===0}>Mark all as read</Button>} />

      <Tabs defaultValue="all" className="space-y-3">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="unread">Unread {unreadCount ? `(${unreadCount})` : ''}</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {renderList(notices)}
        </TabsContent>
        <TabsContent value="unread">
          {renderList(notices.filter(n => !n.read))}
        </TabsContent>
        <TabsContent value="system">
          {renderList(notices.filter(n => n.type === 'system'))}
        </TabsContent>
      </Tabs>
    </div>
  )
}

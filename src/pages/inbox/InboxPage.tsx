import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Link } from 'react-router-dom'
import PageHeader from '@/components/PageHeader'

type Conversation = { id: string; name: string; preview: string; unread?: boolean }
type Message = { id: string; from: 'client' | 'me'; text: string; time: string }

export default function InboxPage() {
  const conversations: Conversation[] = [
    { id: 'c1', name: 'Smith Family', preview: 'Can you come tomorrow?', unread: true },
    { id: 'c2', name: 'Acme LLC', preview: 'Approved the quote.' },
    { id: 'c3', name: 'Lopez Home', preview: 'Gate code is 1234.' },
  ]
  const [activeId, setActiveId] = useState('c1')
  const active = conversations.find(c => c.id === activeId)!
  const messages: Message[] = [
    { id: 'm1', from: 'client', text: 'Hi, can you come tomorrow morning?', time: '9:02 AM' },
    { id: 'm2', from: 'me', text: 'Yes, we can do 9–11 AM. Does that work?', time: '9:05 AM' },
    { id: 'm3', from: 'client', text: 'Perfect. See you then!', time: '9:06 AM' },
  ]

  return (
    <div className="space-y-4">
      <PageHeader title="Inbox" />
      <div className="grid grid-cols-1 md:grid-cols-[320px_1fr] gap-4 pb-24 md:pb-0">
      {/* Sidebar */}
      <Card>
        <CardContent className="p-3 space-y-3">
          <Input placeholder="Search" />
          <Tabs defaultValue="all" className="space-y-2">
            <TabsList className="flex flex-wrap gap-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
              <TabsTrigger value="assigned">Assigned</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="divide-y rounded-xl border">
                {conversations.map(c => (
                  <button
                    key={c.id}
                    onClick={()=>setActiveId(c.id)}
                    className={`w-full text-left p-3 hover:bg-neutral-200/50 ${activeId===c.id ? 'bg-neutral-200/50' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{c.name}</div>
                      {c.unread && <span className="text-xs rounded-full bg-brand-orange text-white px-2 py-0.5">New</span>}
                    </div>
                    <div className="text-sm text-neutral-700 truncate">{c.preview}</div>
                  </button>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="unread">
              <div className="text-sm text-neutral-700 p-3">No unread messages.</div>
            </TabsContent>
            <TabsContent value="assigned">
              <div className="text-sm text-neutral-700 p-3">Nothing assigned.</div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Thread */}
      <Card className="flex flex-col">
        <CardContent className="p-0 flex-1 flex flex-col min-h-[480px]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b">
            <div>
              <div className="font-semibold">{active.name}</div>
              <div className="text-sm text-neutral-700">SMS • (555) 123-4567</div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button asChild variant="secondary" className="w-full sm:w-auto"><Link to="/inbox">Mark done</Link></Button>
              <Button asChild className="w-full sm:w-auto"><Link to="/quotes/new">New quote</Link></Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-auto p-4 space-y-2 bg-neutral-50 pb-24 md:pb-6">
            {messages.map(m => (
              <div key={m.id} className={`flex ${m.from==='me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-3 py-2 ${m.from==='me' ? 'bg-brand-orange text-white' : 'bg-white border'}`}>
                  <div className="text-sm">{m.text}</div>
                  <div className={`text-[10px] mt-1 ${m.from==='me' ? 'text-white/90' : 'text-neutral-600'}`}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Composer */}
          <form className="border-t p-3 flex flex-col sm:flex-row items-stretch sm:items-end gap-2">
            <Textarea placeholder="Write a message…" className="min-h-[44px] flex-1" />
            <Button type="submit" className="w-full sm:w-auto">Send</Button>
          </form>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}

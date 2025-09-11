import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Clock, MapPin, Users, Calendar as CalendarIcon, Briefcase, FileSignature } from 'lucide-react'
import { motion } from 'framer-motion'
import PageHeader from '@/components/PageHeader'

interface Event {
  id: string
  title: string
  date: Date
  time: string
  type: 'job' | 'meeting' | 'quote' | 'personal'
  location?: string
  description?: string
  client?: string
}

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [events, setEvents] = useState<Event[]>([
    {
      id: '1',
      title: 'Kitchen Installation - Smith Residence',
      date: new Date(),
      time: '09:00',
      type: 'job',
      location: '123 Oak Street, Cape Town',
      client: 'John Smith',
      description: 'Complete kitchen cabinet installation and countertop fitting'
    },
    {
      id: '2',
      title: 'Quote Meeting - Office Renovation',
      date: new Date(Date.now() + 86400000),
      time: '14:30',
      type: 'quote',
      location: 'CBD Business Centre',
      client: 'ABC Corp',
      description: 'Initial consultation for office space renovation project'
    },
    {
      id: '3',
      title: 'Team Meeting',
      date: new Date(Date.now() + 172800000),
      time: '10:00',
      type: 'meeting',
      description: 'Weekly team sync and project updates'
    }
  ])
  
  const [newEvent, setNewEvent] = useState({
    title: '',
    time: '',
    type: 'job' as Event['type'],
    location: '',
    description: '',
    client: ''
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const getEventTypeIcon = (type: Event['type']) => {
    switch (type) {
      case 'job': return <Briefcase className="h-4 w-4" />
      case 'quote': return <FileSignature className="h-4 w-4" />
      case 'meeting': return <Users className="h-4 w-4" />
      default: return <CalendarIcon className="h-4 w-4" />
    }
  }

  const getEventTypeColor = (type: Event['type']) => {
    switch (type) {
      case 'job': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'quote': return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'meeting': return 'bg-green-100 text-green-700 border-green-200'
      default: return 'bg-neutral-100 text-neutral-700 border-neutral-200'
    }
  }

  const selectedDateEvents = events.filter(event => 
    selectedDate && event.date.toDateString() === selectedDate.toDateString()
  )

  const handleAddEvent = () => {
    if (!newEvent.title || !selectedDate) return
    
    const event: Event = {
      id: Date.now().toString(),
      title: newEvent.title,
      date: selectedDate,
      time: newEvent.time,
      type: newEvent.type,
      location: newEvent.location || undefined,
      description: newEvent.description || undefined,
      client: newEvent.client || undefined
    }
    
    setEvents([...events, event])
    setNewEvent({ title: '', time: '', type: 'job', location: '', description: '', client: '' })
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        actions={(
          <Button className="bg-orange-600 hover:bg-orange-700" onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        )}
      />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="Enter event title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>
                  <Select value={newEvent.type} onValueChange={(value: Event['type']) => setNewEvent({ ...newEvent, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="job">Job</SelectItem>
                      <SelectItem value="quote">Quote</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="personal">Personal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="client">Client (optional)</Label>
                <Input
                  id="client"
                  value={newEvent.client}
                  onChange={(e) => setNewEvent({ ...newEvent, client: e.target.value })}
                  placeholder="Client name"
                />
              </div>
              <div>
                <Label htmlFor="location">Location (optional)</Label>
                <Input
                  id="location"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Event location"
                />
              </div>
              <div>
                <Label htmlFor="description">Description (optional)</Label>
                <Textarea
                  id="description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  placeholder="Event details"
                  rows={3}
                />
              </div>
              <Button onClick={handleAddEvent} className="w-full bg-orange-600 hover:bg-orange-700">
                Add Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="w-full"
            />
          </div>
        </div>

        {/* Events for Selected Date */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border shadow-sm p-6">
            <h3 className="font-semibold text-neutral-900 mb-4">
              {selectedDate ? selectedDate.toLocaleDateString('en-ZA', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              }) : 'Select a date'}
            </h3>
            
            {selectedDateEvents.length === 0 ? (
              <div className="text-center py-8 text-neutral-500">
                <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No events scheduled</p>
                <p className="text-sm">Click "Add Event" to create one</p>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedDateEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-4 rounded-xl border ${getEventTypeColor(event.type)}`}
                  >
                    <div className="flex items-start gap-3">
                      {getEventTypeIcon(event.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{event.title}</h4>
                        {event.client && (
                          <p className="text-sm opacity-80">Client: {event.client}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-sm opacity-70">
                          {event.time && (
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {event.time}
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate">{event.location}</span>
                            </div>
                          )}
                        </div>
                        {event.description && (
                          <p className="text-sm mt-2 opacity-80">{event.description}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

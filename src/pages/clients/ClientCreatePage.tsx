import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { toast } from 'sonner'

export default function ClientCreatePage() {
  const navigate = useNavigate()
  const [orgId, setOrgId] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const init = async () => {
      const { data: sess } = await supabase.auth.getSession()
      const u = sess?.session?.user || (await supabase.auth.getUser()).data?.user || null
      if (!u) return
      setUserId(u.id)
      const { data: prof } = await supabase
        .schema('core')
        .from('profiles')
        .select('default_org_id')
        .eq('id', u.id)
        .maybeSingle()
      setOrgId(prof?.default_org_id ?? null)
    }
    init()
  }, [])

  const onSave = async () => {
    if (!orgId || !userId) {
      toast.error('Create or select a business first')
      return
    }
    if (!name.trim()) {
      toast.error('Name is required')
      return
    }
    setSaving(true)
    try {
      const { data, error } = await supabase
        .schema('core')
        .from('v_clients')
        .insert({
          org_id: orgId,
          name: name.trim(),
          email: email || null,
          phone: phone || null,
          address: address ? { text: address } : null,
          created_by: userId,
        })
        .select('id')
        .single()
      if (error || !data) throw error
      toast.success('Client created')
      navigate(`/clients/${data.id}`)
    } catch (e) {
      console.error(e)
      toast.error('Could not create client')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">New Client</h1>
        <div className="flex items-center gap-2">
          <Button asChild variant="secondary"><Link to="/clients">Cancel</Link></Button>
          <Button onClick={onSave} disabled={!orgId || saving}>{saving ? 'Saving…' : 'Save Client'}</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid md:grid-cols-2 gap-3">
            <div>
              <div className="text-sm text-neutral-700 mb-1">Name</div>
              <Input placeholder="Full name or business" value={name} onChange={(e)=> setName(e.target.value)} />
            </div>
            <div>
              <div className="text-sm text-neutral-700 mb-1">Phone</div>
              <Input placeholder="(555) 123-4567" value={phone} onChange={(e)=> setPhone(e.target.value)} />
            </div>
            <div>
              <div className="text-sm text-neutral-700 mb-1">Email</div>
              <Input placeholder="name@example.com" value={email} onChange={(e)=> setEmail(e.target.value)} />
            </div>
            <div>
              <div className="text-sm text-neutral-700 mb-1">Address</div>
              <Input placeholder="Street, City" value={address} onChange={(e)=> setAddress(e.target.value)} />
            </div>
          </div>
          <div>
            <div className="text-sm text-neutral-700 mb-1">Notes</div>
            <Textarea placeholder="Preferences, access notes, etc." value={notes} onChange={(e)=> setNotes(e.target.value)} />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

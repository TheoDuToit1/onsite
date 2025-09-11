import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/state/auth'
import PageHeader from '@/components/PageHeader'
import PageIntro from '@/components/PageIntro'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function SettingsPage() {
  const navigate = useNavigate()
  const logout = useAuthStore(s => s.logout)
  const authUser = useAuthStore(s => s.user)

  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [initialEmail, setInitialEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [orgId, setOrgId] = useState<string | null>(null)
  const [orgName, setOrgName] = useState('')
  const [orgAddress, setOrgAddress] = useState('')
  const [orgCity, setOrgCity] = useState('')
  const [orgState, setOrgState] = useState('')
  const [orgZip, setOrgZip] = useState('')
  const [orgTaxRate, setOrgTaxRate] = useState('')
  // Team state
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'owner' | 'admin' | 'staff' | 'viewer'>('staff')
  const [members, setMembers] = useState<Array<{ user_id: string; role: string; full_name: string | null }>>([])
  const [invites, setInvites] = useState<Array<{ id: string; email: string; role: string; token: string; expires_at: string }>>([])
  // Templates state
  const [quoteFooter, setQuoteFooter] = useState('')
  const [invoiceFooter, setInvoiceFooter] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      // Prefer session check to avoid false negatives while user hydrates
      const { data: sessData, error: sessErr } = await supabase.auth.getSession()
      let u = sessData?.session?.user ?? null
      if ((!u || sessErr) ) {
        // Fallback to direct getUser (can still be null briefly during hydration)
        const { data: userRes } = await supabase.auth.getUser()
        u = userRes?.user ?? null
      }
      // If no active session yet, do not redirect from here.
      // Let the outer Protected route handle auth, and render using local store data meanwhile.
      if (!u) {
        if (authUser) {
          setUserId(authUser.id)
          setEmail(authUser.email ?? '')
          setLoading(false)
          return
        } else {
          setLoading(false)
          return
        }
      }
      if (u) {
        setUserId(u.id)
        setEmail(u.email ?? '')
        setInitialEmail(u.email ?? '')
      }
      // Fallback to auth store while DB loads
      if (authUser?.name) setName(authUser.name)
      if (authUser?.phone) setPhone(authUser.phone)

      // Determine which user ID to use for profile fetch
      const profileId = u?.id ?? authUser?.id ?? null
      if (!profileId) {
        setLoading(false)
        return
      }

      const { data: prof, error: profErr } = await supabase
        .schema('core')
        .from('profiles')
        .select('full_name, phone, default_org_id')
        .eq('id', profileId)
        .maybeSingle()

      if (profErr) {
        console.error(profErr)
        // If unauthorized or permission denied, skip redirect here and allow UI to render minimally
        const code = (profErr as any)?.code
        const status = (profErr as any)?.status
        if (status === 401 || code === '42501') {
          setLoading(false)
          return
        }
      }
      if (prof) {
        setName(prof.full_name ?? '')
        setPhone(prof.phone ?? '')
        setOrgId(prof.default_org_id ?? null)
        if (prof.default_org_id) {
          const { data: org, error: orgErr } = await supabase
            .schema('core')
            .from('organizations')
            .select('id, name, address, city, state, zip, tax_rate')
            .eq('id', prof.default_org_id)
            .maybeSingle()
          if (!orgErr && org) {
            console.debug('Loaded org by default_org_id', org)
            setOrgName(org.name ?? '')
            setOrgAddress(org.address ?? '')
            setOrgCity(org.city ?? '')
            setOrgState(org.state ?? '')
            setOrgZip(org.zip ?? '')
            setOrgTaxRate(org.tax_rate != null ? String(org.tax_rate) : '')
            try { localStorage.setItem('businessName', org.name ?? '') } catch {}
          }
          // If org not found yet, try localStorage fallback so Business tab is not empty
          if (orgErr) {
            const code = (orgErr as any)?.code
            const status = (orgErr as any)?.status
            if (status === 401 || code === '42501') {
              setLoading(false)
              return
            }
          }
          if ((!org || orgErr) && !orgName) {
            try {
              const cached = localStorage.getItem('businessName')
              if (cached) setOrgName(cached)
            } catch {}
          }
        } else {
          // No default_org_id yet; attempt to find the most recent org created by this user
          const { data: latestOrg, error: latestErr } = await supabase
            .schema('core')
            .from('organizations')
            .select('id, name, address, city, state, zip, tax_rate')
            .eq('created_by', profileId)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
          if (!latestErr && latestOrg) {
            console.debug('Loaded latest org by created_by', latestOrg)
            setOrgId(latestOrg.id)
            setOrgName(latestOrg.name ?? '')
            setOrgAddress(latestOrg.address ?? '')
            setOrgCity(latestOrg.city ?? '')
            setOrgState(latestOrg.state ?? '')
            setOrgZip(latestOrg.zip ?? '')
            setOrgTaxRate(latestOrg.tax_rate != null ? String(latestOrg.tax_rate) : '')
            try { localStorage.setItem('businessName', latestOrg.name ?? '') } catch {}
            // Link it as default_org_id for future loads
            const { error: linkErr } = await supabase
              .schema('core')
              .from('profiles')
              .upsert({ id: profileId, default_org_id: latestOrg.id })
            if (linkErr) {
              console.debug('Failed to link default_org_id', linkErr)
            }
          } else {
            if (latestErr) {
              const code = (latestErr as any)?.code
              const status = (latestErr as any)?.status
              if (status === 401 || code === '42501') {
                setLoading(false)
                return
              }
            }
            // Fallback to localStorage name so the tab isn't empty
            try {
              const cached = localStorage.getItem('businessName')
              if (cached) setOrgName(cached)
            } catch {}
          }
        }
      } else {
        // No profile row; try to load latest org by created_by and link it
        if (authUser?.user_metadata?.full_name) setName(authUser.user_metadata.full_name)
        const { data: latestOrgNoProf, error: latestErrNoProf } = await supabase
          .schema('core')
          .from('organizations')
          .select('id, name, address, city, state, zip, tax_rate')
          .eq('created_by', profileId)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        if (!latestErrNoProf && latestOrgNoProf) {
          setOrgId(latestOrgNoProf.id)
          setOrgName(latestOrgNoProf.name ?? '')
          setOrgAddress(latestOrgNoProf.address ?? '')
          setOrgCity(latestOrgNoProf.city ?? '')
          setOrgState(latestOrgNoProf.state ?? '')
          setOrgZip(latestOrgNoProf.zip ?? '')
          setOrgTaxRate(latestOrgNoProf.tax_rate != null ? String(latestOrgNoProf.tax_rate) : '')
          try { localStorage.setItem('businessName', latestOrgNoProf.name ?? '') } catch {}
          // Create/link profile so future loads use default_org_id
          const { error: createProfErr } = await supabase
            .schema('core')
            .from('profiles')
            .upsert({ id: profileId, default_org_id: latestOrgNoProf.id })
          if (createProfErr) {
            console.debug('Failed to create/link profile without existing row', createProfErr)
          }
        } else {
          // Final fallback to localStorage name so the tab isn't empty
          if (!orgName) {
            try {
              const cached = localStorage.getItem('businessName')
              if (cached) setOrgName(cached)
            } catch {}
          }
        }
      }
      setLoading(false)
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Load team members and pending invites when org changes
  useEffect(() => {
    const loadTeam = async () => {
      if (!orgId) return
      try {
        // Load memberships for this org
        const { data: memRows, error: memErr } = await supabase
          .schema('core')
          .from('memberships')
          .select('user_id, role')
          .eq('org_id', orgId)
        if (memErr) {
          console.debug('Load memberships error', memErr)
        }
        const userIds = (memRows || []).map(m => m.user_id)
        let profilesMap = new Map<string, string | null>()
        if (userIds.length) {
          const { data: profs, error: profErr } = await supabase
            .schema('core')
            .from('profiles')
            .select('id, full_name')
            .in('id', userIds)
          if (!profErr && profs) {
            for (const p of profs) profilesMap.set(p.id as string, (p as any).full_name ?? null)
          }
        }
        const memList = (memRows || []).map(m => ({
          user_id: m.user_id as string,
          role: m.role as string,
          full_name: profilesMap.get(m.user_id as string) ?? null,
        }))
        setMembers(memList)

        // Load invites for this org
        const { data: invRows, error: invErr } = await supabase
          .schema('core')
          .from('invitations')
          .select('id, email, role, token, expires_at')
          .eq('org_id', orgId)
        if (invErr) {
          console.debug('Load invitations error', invErr)
        }
        const nowIso = new Date().toISOString()
        setInvites((invRows || []).filter(i => !i.expires_at || (i.expires_at as string) > nowIso) as any)
      } catch (e) {
        console.debug('Team load exception', e)
      }
    }
    loadTeam()
  }, [orgId])

  // Load templates for this org
  useEffect(() => {
    const loadTemplates = async () => {
      if (!orgId) return
      try {
        const { data, error } = await supabase
          .schema('comms')
          .from('templates')
          .select('name, channel, subject, body')
          .eq('org_id', orgId)
          .eq('channel', 'email')
        if (error) {
          console.debug('Load templates error', error)
          return
        }
        const q = data?.find(t => t.name === 'quote_footer')?.body
        const i = data?.find(t => t.name === 'invoice_footer')?.body
        setQuoteFooter(q ?? 'This quote is valid for 14 days. Work scheduled upon deposit payment.')
        setInvoiceFooter(i ?? 'Please pay within 7 days. EFT preferred. Use Invoice # as reference.')
      } catch (e) {
        console.debug('Templates load exception', e)
      }
    }
    loadTemplates()
  }, [orgId])

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setLoading(true)
    const { error } = await supabase
      .schema('core')
      .from('profiles')
      .upsert({ id: userId, full_name: name, phone })
    if (error) {
      toast.error('Could not save profile')
    }
    // update email if changed
    if (email && email !== initialEmail) {
      const { error: emailErr } = await supabase.auth.updateUser({ email })
      if (emailErr) {
        toast.error('Email update failed')
      } else {
        toast.success('Email update requested. Please confirm via the link sent to the new address.')
        setInitialEmail(email)
      }
    }
    // reflect locally
    useAuthStore.getState().login({ id: userId, name: name || authUser?.name || '', email, phone })
    setLoading(false)
    toast.success('Settings saved')
  }

  const onSaveTemplates = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!orgId) {
      toast.error('Create or select a business first')
      return
    }
    setLoading(true)
    try {
      // Upsert quote footer
      const { error: qErr } = await supabase
        .schema('comms')
        .from('templates')
        .upsert({
          org_id: orgId,
          name: 'quote_footer',
          channel: 'email',
          subject: null,
          body: quoteFooter || 'This quote is valid for 14 days. Work scheduled upon deposit payment.',
        }, { onConflict: 'org_id,name,channel' as any })
      if (qErr) throw qErr

      // Upsert invoice footer
      const { error: iErr } = await supabase
        .schema('comms')
        .from('templates')
        .upsert({
          org_id: orgId,
          name: 'invoice_footer',
          channel: 'email',
          subject: null,
          body: invoiceFooter || 'Please pay within 7 days. EFT preferred. Use Invoice # as reference.',
        }, { onConflict: 'org_id,name,channel' as any })
      if (iErr) throw iErr

      toast.success('Templates saved')
    } catch (err) {
      console.error(err)
      toast.error('Could not save templates')
    } finally {
      setLoading(false)
    }
  }

  const onInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (!userId) {
        toast.error('Not signed in')
        return
      }
      if (!orgId) {
        toast.error('Create or select a business first')
        return
      }
      if (!inviteEmail) {
        toast.error('Enter an email to invite')
        return
      }
      const token = (globalThis.crypto && 'randomUUID' in globalThis.crypto) ? (globalThis.crypto as any).randomUUID() : Math.random().toString(36).slice(2)
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      const { error: insErr } = await supabase
        .schema('core')
        .from('invitations')
        .insert({
          org_id: orgId,
          email: inviteEmail,
          role: inviteRole,
          token,
          expires_at: expiresAt,
          created_by: userId,
        })
      if (insErr) throw insErr
      // Refresh invites
      try {
        const { data: invRows } = await supabase
          .schema('core')
          .from('invitations')
          .select('id, email, role, token, expires_at')
          .eq('org_id', orgId)
        const nowIso = new Date().toISOString()
        setInvites((invRows || []).filter(i => !i.expires_at || (i.expires_at as string) > nowIso) as any)
      } catch {}
      // Prepare a shareable link
      const link = `${window.location.origin}/accept-invite?token=${token}`
      try {
        await navigator.clipboard.writeText(link)
        toast.success('Invite created. Link copied to clipboard')
      } catch {
        toast.success('Invite created. Copy this link to share: ' + link)
      }
      setInviteEmail('')
    } catch (err) {
      console.error(err)
      toast.error('Could not create invite')
    }
  }
  const onSaveBusiness = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setLoading(true)
    try {
      let currentOrgId = orgId
      if (!currentOrgId) {
        // create org if missing and set as default
        const { data: newOrg, error: createErr } = await supabase
          .schema('core')
          .from('organizations')
          .insert({
            name: orgName || 'My Business',
            address: orgAddress || null,
            city: orgCity || null,
            state: orgState || null,
            zip: orgZip || null,
            tax_rate: orgTaxRate ? Number(orgTaxRate) : null,
            created_by: userId,
          })
          .select('id')
          .single()
        if (createErr || !newOrg) throw createErr
        currentOrgId = newOrg.id
        setOrgId(currentOrgId)
        const { error: linkErr } = await supabase.schema('core').from('profiles').upsert({ id: userId, default_org_id: currentOrgId })
        if (linkErr) {
          console.debug('Failed to set default_org_id on profile', linkErr)
        }
      }
      // update org name
      const { error: updErr } = await supabase
        .schema('core')
        .from('organizations')
        .update({
          name: orgName,
          address: orgAddress || null,
          city: orgCity || null,
          state: orgState || null,
          zip: orgZip || null,
          tax_rate: orgTaxRate ? Number(orgTaxRate) : null,
          created_by: userId,
        })
        .eq('id', currentOrgId)
      if (updErr) throw updErr

      // Re-fetch org to confirm and sync UI state
      try {
        const { data: fresh, error: reErr } = await supabase
          .schema('core')
          .from('organizations')
          .select('id, name, address, city, state, zip, tax_rate')
          .eq('id', currentOrgId)
          .maybeSingle()
        if (!reErr && fresh) {
          console.debug('Re-fetched org after save', fresh)
          setOrgName(fresh.name ?? '')
          setOrgAddress(fresh.address ?? '')
          setOrgCity(fresh.city ?? '')
          setOrgState(fresh.state ?? '')
          setOrgZip(fresh.zip ?? '')
          setOrgTaxRate(fresh.tax_rate != null ? String(fresh.tax_rate) : '')
          try { localStorage.setItem('businessName', fresh.name ?? '') } catch {}
        } else if (reErr) {
          console.debug('Org re-fetch error', reErr)
        }
      } catch (e) {
        console.debug('Org re-fetch exception', e)
      }

      // reflect locally; keep user's name distinct from business name
      if (currentOrgId) {
        // Always ensure profile points to this org after save
        try {
          const { error: relinkErr } = await supabase
            .schema('core')
            .from('profiles')
            .upsert({ id: userId, default_org_id: currentOrgId })
          if (relinkErr) console.debug('Failed to relink default_org_id after update', relinkErr)
        } catch (e) {
          console.debug('Relink exception', e)
        }
        const current = useAuthStore.getState().user
        if (current) {
          // Do not overwrite the user's personal name with business name
          useAuthStore.getState().login({ id: current.id, name: current.name, email: email || current.email, phone: phone || current.phone })
        }
        try { localStorage.setItem('businessName', orgName || '') } catch {}
      }
      toast.success('Business saved')
    } catch (err) {
      console.error(err)
      toast.error('Could not save business')
    } finally {
      setLoading(false)
    }
  }
  const onLogout = () => { logout(); navigate('/welcome', { replace: true }) }
  return (
    <div className="space-y-4">
      <PageHeader 
        title="Settings" 
        actions={(
          <PageIntro
            pageKey="settings"
            title="Settings"
            intro="Configure your business, team, documents, and notifications. These preferences power quotes and invoices."
            bullets={[
              'Profile: your personal details',
              'Business: name, address, tax rates used on documents',
              'Team: invite teammates and set roles',
              'Templates: default quote/invoice texts',
              'Integrations: Stripe, QuickBooks and more',
              'Notifications: choose how you get notified'
            ]}
          />
        )}
      />
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="flex flex-wrap gap-2 mb-3 sm:mb-4">
          <TabsTrigger value="profile" className="flex-1 sm:flex-none">Profile</TabsTrigger>
          <TabsTrigger value="business" className="flex-1 sm:flex-none">Business</TabsTrigger>
          <TabsTrigger value="team" className="flex-1 sm:flex-none">Team</TabsTrigger>
          <TabsTrigger value="templates" className="flex-1 sm:flex-none">Templates</TabsTrigger>
          <TabsTrigger value="integrations" className="flex-1 sm:flex-none">Integrations</TabsTrigger>
          <TabsTrigger value="billing" className="flex-1 sm:flex-none">Billing</TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1 sm:flex-none">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-2 sm:mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Personal details visible to your team and on documents.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSave} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <Label>Name</Label>
                    <Input
                      placeholder="Alex Contractor"
                      className="mt-1"
                      value={name}
                      disabled={loading}
                      onChange={(e)=> setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      placeholder="owner@business.com"
                      className="mt-1"
                      value={email}
                      disabled
                      onChange={()=>{}}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      placeholder="+15551234567"
                      className="mt-1"
                      value={phone}
                      disabled={loading}
                      onChange={(e)=> setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button type="submit" className="sm:w-auto" disabled={loading}>{loading ? 'Saving…' : 'Save changes'}</Button>
                  <Button type="button" variant="secondary" className="text-red-600 sm:w-auto" onClick={onLogout}>Log out</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="business" className="mt-2 sm:mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Business</CardTitle>
              <CardDescription>Your company identity used on quotes and invoices.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSaveBusiness} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <Label>Business name</Label>
                    <Input
                      placeholder="OnSite Heating & Air"
                      className="mt-1"
                      value={orgName}
                      disabled={loading}
                      onChange={(e)=> setOrgName(e.target.value)}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label>Address</Label>
                    <Input
                      placeholder="123 Main St"
                      className="mt-1"
                      value={orgAddress}
                      disabled={loading}
                      onChange={(e)=> setOrgAddress(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>City</Label>
                    <Input
                      placeholder="San Jose"
                      className="mt-1"
                      value={orgCity}
                      disabled={loading}
                      onChange={(e)=> setOrgCity(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input
                      placeholder="CA"
                      className="mt-1"
                      value={orgState}
                      disabled={loading}
                      onChange={(e)=> setOrgState(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>ZIP</Label>
                    <Input
                      placeholder="95112"
                      className="mt-1"
                      value={orgZip}
                      disabled={loading}
                      onChange={(e)=> setOrgZip(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Tax rate</Label>
                    <Input
                      placeholder="8.25"
                      className="mt-1"
                      inputMode="decimal"
                      value={orgTaxRate}
                      disabled={loading}
                      onChange={(e)=> setOrgTaxRate(e.target.value)}
                    />
                  </div>
                </div>
                <Button type="submit" disabled={loading}>{loading ? 'Saving…' : 'Save changes'}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="mt-2 sm:mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>Invite teammates and manage roles.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={onInvite} className="flex flex-col sm:flex-row gap-2 max-w-2xl">
                <Input 
                  type="email" 
                  placeholder="teammate@business.com" 
                  className="flex-1" 
                  value={inviteEmail}
                  onChange={(e)=> setInviteEmail(e.target.value)}
                  disabled={!orgId}
                />
                <Select value={inviteRole} onValueChange={(v)=> setInviteRole(v as any)}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="staff">Staff</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="submit" className="w-full sm:w-auto" disabled={!orgId}>Invite</Button>
              </form>

              <div className="space-y-3">
                <div className="font-medium">Members</div>
                {members.length === 0 ? (
                  <div className="text-sm text-neutral-600">No members yet.</div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {members.map(m => (
                      <Card key={m.user_id}>
                        <CardContent className="p-4">
                          <div className="font-medium">{m.full_name || m.user_id.slice(0,8)}</div>
                          <div className="text-sm text-neutral-700 capitalize">{m.role}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div className="font-medium">Pending invites</div>
                {invites.length === 0 ? (
                  <div className="text-sm text-neutral-600">No pending invites.</div>
                ) : (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {invites.map(inv => (
                      <Card key={inv.id}>
                        <CardContent className="p-4">
                          <div className="font-medium">{inv.email}</div>
                          <div className="text-sm text-neutral-700 capitalize">{inv.role}</div>
                          <div className="text-xs text-neutral-500 mt-1">Expires {new Date(inv.expires_at).toLocaleDateString()}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="mt-2 sm:mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Templates</CardTitle>
              <CardDescription>Default texts used on quotes and invoices.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSaveTemplates} className="space-y-4 max-w-2xl">
                <div>
                  <Label>Quote footer</Label>
                  <Textarea 
                    placeholder="This quote is valid for 14 days. Work scheduled upon deposit payment."
                    className="mt-1"
                    value={quoteFooter}
                    onChange={(e)=> setQuoteFooter(e.target.value)}
                    disabled={!orgId || loading}
                  />
                </div>
                <div>
                  <Label>Invoice footer</Label>
                  <Textarea 
                    placeholder="Please pay within 7 days. EFT preferred. Use Invoice # as reference."
                    className="mt-1"
                    value={invoiceFooter}
                    onChange={(e)=> setInvoiceFooter(e.target.value)}
                    disabled={!orgId || loading}
                  />
                </div>
                <Button type="submit" disabled={!orgId || loading}>{loading ? 'Saving…' : 'Save changes'}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="mt-2 sm:mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Connect your favorite tools.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-xl border p-3">
                <div>
                  <div className="font-medium">Stripe</div>
                  <div className="text-sm text-neutral-700">Accept payments online</div>
                </div>
                <Button className="w-full sm:w-auto">Connect</Button>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-xl border p-3">
                <div>
                  <div className="font-medium">QuickBooks</div>
                  <div className="text-sm text-neutral-700">Sync invoices and clients</div>
                </div>
                <Button variant="secondary" className="w-full sm:w-auto">Connect</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="mt-2 sm:mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing</CardTitle>
              <CardDescription>Manage your subscription</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-xl border p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-medium">Current plan</div>
                    <div className="text-sm text-neutral-700">Pro — R499/mo</div>
                  </div>
                  <Button className="w-full sm:w-auto">Manage billing</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-2 sm:mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Choose how you want to be notified.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSave} className="space-y-4 max-w-md">
                <div>
                  <Label>Email notifications</Label>
                  <Select defaultValue="all">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="important">Important only</SelectItem>
                      <SelectItem value="all">All activity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Mobile push</Label>
                  <Select defaultValue="important">
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="off">Off</SelectItem>
                      <SelectItem value="important">Important only</SelectItem>
                      <SelectItem value="all">All activity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit">Save changes</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

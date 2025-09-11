import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'
import PageIntro from '@/components/PageIntro'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/state/auth'

export default function ClientsPage() {
  const authUser = useAuthStore(s => s.user)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [clients, setClients] = useState<Array<{ id: string; name: string; created_at: string }>>([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        // Determine user and org
        const { data: sess } = await supabase.auth.getSession()
        let uid = sess?.session?.user?.id || authUser?.id || null
        if (!uid) {
          const { data: gu } = await supabase.auth.getUser()
          uid = gu?.user?.id || null
        }
        if (!uid) { setLoading(false); return }
        const { data: prof } = await supabase
          .schema('core')
          .from('profiles')
          .select('default_org_id')
          .eq('id', uid)
          .maybeSingle()
        const currentOrgId = prof?.default_org_id ?? null
        setOrgId(currentOrgId)
        if (!currentOrgId) { setClients([]); setLoading(false); return }

        // Load clients for org
        const { data, error } = await supabase
          .schema('core')
          .from('v_clients')
          .select('id, name, created_at')
          .eq('org_id', currentOrgId)
          .order('created_at', { ascending: false })
        if (error) {
          console.debug('Load clients error', error)
          setClients([])
        } else {
          setClients(data || [])
        }
      } catch (e) {
        console.debug('Clients load exception', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])
  return (
    <div className="space-y-4">
      <PageHeader
        title="Clients"
        actions={(
          <div className="flex items-center gap-2">
            <PageIntro
              pageKey="clients"
              title="Clients"
              intro="Manage your customer base and view lifetime value, recent jobs, and contact info."
              bullets={[
                'Create: add new client records with essentials',
                'Details: see jobs, invoices, balance, and notes',
                'Search: quickly find clients by name',
                'LTV: understand your most valuable customers'
              ]}
            />
            <Button asChild>
              <Link to="/clients/new">New client</Link>
            </Button>
          </div>
        )}
      />
      {!orgId ? (
        <div className="rounded-2xl bg-yellow-50 border border-yellow-200 p-4 text-sm">
          Link or create a business in Settings → Business to start adding clients.
        </div>
      ) : (
        <div className="rounded-2xl bg-white border shadow-soft divide-y">
          {loading && clients.length === 0 ? (
            <div className="p-4 text-sm text-neutral-700">Loading…</div>
          ) : clients.length === 0 ? (
            <div className="p-4 text-sm text-neutral-700">No clients yet.</div>
          ) : (
            clients.map(c => (
              <Link key={c.id} to={`/clients/${c.id}`} className="flex justify-between p-4 hover:bg-neutral-200/50">
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-sm text-neutral-700">Created {new Date(c.created_at).toLocaleDateString()}</div>
                </div>
                <div className="text-sm text-neutral-600">View</div>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}

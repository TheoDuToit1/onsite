import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'
import PageIntro from '@/components/PageIntro'

export default function ClientsPage() {
  const clients = [
    { id: 'c1', name: 'Smith Family', jobs: 4, ltv: 2200 },
    { id: 'c2', name: 'Acme LLC', jobs: 12, ltv: 10400 },
  ]
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
      <div className="rounded-2xl bg-white border shadow-soft divide-y">
        {clients.map(c => (
          <Link key={c.id} to={`/clients/${c.id}`} className="flex justify-between p-4 hover:bg-neutral-200/50">
            <div>
              <div className="font-semibold">{c.name}</div>
              <div className="text-sm text-neutral-700">{c.jobs} jobs</div>
            </div>
            <div className="font-semibold">${c.ltv}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

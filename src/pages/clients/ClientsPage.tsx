import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function ClientsPage() {
  const clients = [
    { id: 'c1', name: 'Smith Family', jobs: 4, ltv: 2200 },
    { id: 'c2', name: 'Acme LLC', jobs: 12, ltv: 10400 },
  ]
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Clients</h1>
        <Button asChild><Link to="/clients/new">New client</Link></Button>
      </div>
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

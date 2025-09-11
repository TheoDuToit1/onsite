import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { useFinanceStore } from '@/state/finance'

export default function ExpenseForm() {
  const addExpense = useFinanceStore((s) => s.addExpense)
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [jobId, setJobId] = useState('')
  const [jobTitle, setJobTitle] = useState('')

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amt = Number(amount)
    if (!amt || !description.trim()) return
    addExpense({
      date: new Date(date).toISOString(),
      amount: amt,
      description: description.trim(),
      jobId: jobId || undefined,
      jobTitle: jobTitle || undefined,
    })
    setAmount('')
    setDescription('')
    setJobId('')
    setJobTitle('')
  }

  return (
    <Card>
      <CardContent className="p-4">
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-sm text-neutral-700 mb-1">Amount (ZAR)</div>
            <Input type="number" step="0.01" min="0" value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="e.g., 1250.00" />
          </div>
          <div>
            <div className="text-sm text-neutral-700 mb-1">Date</div>
            <Input type="date" value={date} onChange={(e)=>setDate(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <div className="text-sm text-neutral-700 mb-1">Description</div>
            <Textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Fuel, supplies, subcontractor, etc." />
          </div>
          <div>
            <div className="text-sm text-neutral-700 mb-1">Linked Job (ID)</div>
            <Input value={jobId} onChange={(e)=>setJobId(e.target.value)} placeholder="Optional: job id (e.g., j1)" />
          </div>
          <div>
            <div className="text-sm text-neutral-700 mb-1">Linked Job (Title)</div>
            <Input value={jobTitle} onChange={(e)=>setJobTitle(e.target.value)} placeholder="Optional: Smith — HVAC install" />
          </div>
          <div className="md:col-span-2">
            <Button type="submit" className="w-full md:w-auto">Add Expense</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

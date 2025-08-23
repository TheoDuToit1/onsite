import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Expense = {
  id: string
  date: string // ISO date
  amount: number
  description: string
  jobId?: string
  jobTitle?: string
}

export type Revenue = {
  id: string
  date: string // ISO date
  amount: number
  source: 'invoice' | 'other'
}

interface FinanceState {
  expenses: Expense[]
  revenues: Revenue[]
  addExpense: (e: Omit<Expense, 'id'>) => void
  addRevenue: (r: Omit<Revenue, 'id'>) => void
  getMonthlySummary: () => { month: string; income: number; expenses: number; net: number }[]
  exportCSV: () => void
  exportPDF: () => void
}

const monthKey = (d: string) => {
  const dt = new Date(d)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
}

export const useFinanceStore = create<FinanceState>()(
  persist(
    (set, get) => ({
      expenses: [
        { id: 'e1', date: new Date().toISOString(), amount: 1250, description: 'Fuel', jobId: 'j1', jobTitle: 'Smith Family — HVAC' },
        { id: 'e2', date: new Date().toISOString(), amount: 980, description: 'Supplies', jobId: 'j2', jobTitle: 'Acme LLC — Maintenance' },
      ],
      revenues: [
        { id: 'r1', date: new Date().toISOString(), amount: 152100, source: 'invoice' },
      ],
      addExpense: (e) => set((s) => ({ expenses: [...s.expenses, { ...e, id: crypto.randomUUID() }] })),
      addRevenue: (r) => set((s) => ({ revenues: [...s.revenues, { ...r, id: crypto.randomUUID() }] })),
      getMonthlySummary: () => {
        const incomeByMonth = new Map<string, number>()
        const expByMonth = new Map<string, number>()
        for (const r of get().revenues) {
          const k = monthKey(r.date)
          incomeByMonth.set(k, (incomeByMonth.get(k) || 0) + r.amount)
        }
        for (const e of get().expenses) {
          const k = monthKey(e.date)
          expByMonth.set(k, (expByMonth.get(k) || 0) + e.amount)
        }
        const months = new Set<string>([...incomeByMonth.keys(), ...expByMonth.keys()])
        const sorted = [...months].sort()
        return sorted.map((m) => {
          const income = incomeByMonth.get(m) || 0
          const expenses = expByMonth.get(m) || 0
          return { month: m, income, expenses, net: income - expenses }
        })
      },
      exportCSV: () => {
        const rows: string[] = []
        rows.push('Type,Date,Amount,Description,JobId,JobTitle,Source')
        for (const e of get().expenses) {
          rows.push(['Expense', e.date, e.amount.toString(), e.description, e.jobId || '', e.jobTitle || '', ''].join(','))
        }
        for (const r of get().revenues) {
          rows.push(['Revenue', r.date, r.amount.toString(), '', '', '', r.source].join(','))
        }
        const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'finance.csv'
        a.click()
        URL.revokeObjectURL(url)
      },
      exportPDF: () => {
        // Basic print-to-PDF via new window
        const data = get().getMonthlySummary()
        const win = window.open('', '_blank')
        if (!win) return
        const tableRows = data
          .map((d) => `<tr><td style="padding:6px 10px;border:1px solid #ddd">${d.month}</td><td style="padding:6px 10px;border:1px solid #ddd">${d.income.toFixed(2)}</td><td style="padding:6px 10px;border:1px solid #ddd">${d.expenses.toFixed(2)}</td><td style="padding:6px 10px;border:1px solid #ddd">${d.net.toFixed(2)}</td></tr>`)
          .join('')
        win.document.write(`<!doctype html><html><head><title>Cashflow</title></head><body>
          <h2>Income vs Expenses</h2>
          <table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:12px">
            <thead><tr><th style="padding:6px 10px;border:1px solid #ddd">Month</th><th style="padding:6px 10px;border:1px solid #ddd">Income</th><th style="padding:6px 10px;border:1px solid #ddd">Expenses</th><th style="padding:6px 10px;border:1px solid #ddd">Net</th></tr></thead>
            <tbody>${tableRows}</tbody>
          </table>
          <script>window.print();</script>
        </body></html>`)
        win.document.close()
      },
    }),
    { name: 'finance-store' }
  )
)

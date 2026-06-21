import { useState } from 'react'
import { Upload } from 'lucide-react'
import Button from '../ui/Button.jsx'
import Spinner from '../ui/Spinner.jsx'

const METHODS = ['bank_transfer', 'card', 'cash']

export default function PaymentForm({ totalAmount, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState({
    method: 'bank_transfer',
    reference: '',
    payerName: '',
    paidAmount: totalAmount || '',
    paidDate: '',
  })

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Payment Method</label>
        <select value={form.method} onChange={set('method')}
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
          {METHODS.map(m => <option key={m} value={m}>{m.replace('_', ' ').toUpperCase()}</option>)}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Reference / Transaction ID</label>
        <input value={form.reference} onChange={set('reference')} required placeholder="TXN123456"
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">Payer Name</label>
        <input value={form.payerName} onChange={set('payerName')} required placeholder="Full name on payment"
          className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Amount Paid (LKR)</label>
          <input type="number" value={form.paidAmount} onChange={set('paidAmount')} required
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Payment Date</label>
          <input type="date" value={form.paidDate} onChange={set('paidDate')} required
            className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
        </div>
      </div>
      <div className="flex gap-2 pt-1">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel} className="flex-1">Cancel</Button>
        <Button type="submit" size="sm" className="flex-1" disabled={loading}>
          {loading ? <Spinner className="w-4 h-4" /> : <><Upload size={14} /> Submit</>}
        </Button>
      </div>
    </form>
  )
}

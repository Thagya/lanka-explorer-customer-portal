const COLORS = {
  pending_payment:      'bg-yellow-100 text-yellow-800',
  under_review:         'bg-blue-100 text-blue-800',
  payment_rejected:     'bg-red-100 text-red-800',
  confirmed:            'bg-green-100 text-green-800',
  reschedule_requested: 'bg-purple-100 text-purple-800',
  amendment_requested:  'bg-indigo-100 text-indigo-800',
  cancelled:            'bg-gray-100 text-gray-600',
  completed:            'bg-teal-100 text-teal-800',
}

const LABELS = {
  pending_payment:      'Pending Payment',
  under_review:         'Under Review',
  payment_rejected:     'Payment Rejected',
  confirmed:            'Confirmed',
  reschedule_requested: 'Reschedule Requested',
  amendment_requested:  'Amendment Requested',
  cancelled:            'Cancelled',
  completed:            'Completed',
}

export default function Badge({ status, className = '' }) {
  const color = COLORS[status] || 'bg-gray-100 text-gray-600'
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${color} ${className}`}>
      {LABELS[status] || status}
    </span>
  )
}

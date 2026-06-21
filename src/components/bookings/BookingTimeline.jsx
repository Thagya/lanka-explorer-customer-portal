const ACTION_LABELS = {
  created:           'Booking Created',
  submit_payment:    'Payment Submitted',
  resubmit_payment:  'Payment Resubmitted',
  reject_payment:    'Payment Rejected',
  confirm:           'Booking Confirmed',
  complete:          'Booking Completed',
  cancel:            'Booking Cancelled',
  request_reschedule:'Reschedule Requested',
  approve_reschedule:'Reschedule Approved',
  request_amendment: 'Amendment Requested',
  approve_amendment: 'Amendment Approved',
}

const ACTION_COLORS = {
  confirm:           'bg-green-500',
  complete:          'bg-teal-500',
  cancel:            'bg-red-400',
  reject_payment:    'bg-red-400',
  submit_payment:    'bg-blue-500',
  resubmit_payment:  'bg-blue-500',
  created:           'bg-gray-400',
}

export default function BookingTimeline({ history = [] }) {
  const sorted = [...history].reverse()
  return (
    <div className="space-y-4">
      {sorted.map((h, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ${ACTION_COLORS[h.action] || 'bg-gray-300'}`} />
            {i < sorted.length - 1 && <div className="w-0.5 bg-gray-200 flex-1 mt-1" />}
          </div>
          <div className="pb-4">
            <p className="text-sm font-medium text-gray-800">
              {ACTION_LABELS[h.action] || h.action?.replace(/_/g, ' ')}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              by <span className="capitalize">{h.actor}</span>
              {' · '}
              {new Date(h.at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </p>
            {h.note && (
              <p className="text-xs text-gray-500 italic mt-1 bg-gray-50 rounded-lg px-2 py-1">"{h.note}"</p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

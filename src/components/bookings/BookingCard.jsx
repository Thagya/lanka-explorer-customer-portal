import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays } from 'lucide-react'
import Badge from '../ui/Badge.jsx'
import Card from '../ui/Card.jsx'

const TYPE_ICONS = { hotel: '🏨', tour: '🗺️', vehicle: '🚙' }

export default function BookingCard({ booking }) {
  const { _id, listingName, type, status, pricing, createdAt } = booking
  return (
    <Link to={`/bookings/${_id}`}>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-xl flex-shrink-0">
              {TYPE_ICONS[type] || '📋'}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-gray-900 truncate">{listingName}</p>
              <p className="text-xs text-gray-500 capitalize mb-2">{type}</p>
              <Badge status={status} />
              <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                <CalendarDays size={11} />
                {new Date(createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-teal-500 font-bold text-sm">
              LKR {pricing?.total?.toLocaleString()}
            </p>
            <ArrowRight size={16} className="text-gray-300 mt-3 ml-auto" />
          </div>
        </div>
      </Card>
    </Link>
  )
}

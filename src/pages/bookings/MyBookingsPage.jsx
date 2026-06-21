import { Link } from 'react-router-dom'
import { CalendarDays } from 'lucide-react'
import { useMyBookings } from '../../hooks/useBookings.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import BookingCard from '../../components/bookings/BookingCard.jsx'
import Button from '../../components/ui/Button.jsx'
import Spinner from '../../components/ui/Spinner.jsx'

export default function MyBookingsPage() {
  const { user } = useAuth()
  const { bookings, loading, error } = useMyBookings()

  if (!user) return (
    <div className="text-center py-24">
      <p className="text-gray-600 mb-4">Please sign in to view your bookings.</p>
      <Link to="/login"><Button>Sign In</Button></Link>
    </div>
  )

  if (loading) return <div className="flex justify-center py-24"><Spinner className="w-12 h-12" /></div>

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-teal-500 mb-1">My Bookings</h1>
      <p className="text-gray-500 text-sm mb-6">Manage your reservations</p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm mb-4">
          Failed to load bookings. Please refresh and try again.
        </div>
      )}

      {!error && bookings.length === 0 ? (
        <div className="text-center py-16">
          <CalendarDays size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No bookings yet.</p>
          <Link to="/listings"><Button>Explore Listings</Button></Link>
        </div>
      ) : !error ? (
        <div className="space-y-4">
          {bookings.map(b => <BookingCard key={b._id} booking={b} />)}
        </div>
      ) : null}
    </div>
  )
}

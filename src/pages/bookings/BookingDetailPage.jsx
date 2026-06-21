import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Upload, Star } from 'lucide-react'
import { useBooking } from '../../hooks/useBookings.js'
import Badge from '../../components/ui/Badge.jsx'
import Button from '../../components/ui/Button.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import BookingTimeline from '../../components/bookings/BookingTimeline.jsx'
import PaymentForm from '../../components/bookings/PaymentForm.jsx'
import { formatCurrency, formatDate } from '../../utils/formatters.js'
import api from '../../api/client.js'

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0)
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(s => (
        <button key={s} type="button" onClick={() => onChange(s)}
          onMouseEnter={() => setHover(s)} onMouseLeave={() => setHover(0)}>
          <Star size={28} className={s <= (hover || value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
        </button>
      ))}
    </div>
  )
}

export default function BookingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { booking, loading, error: bookingError, actionLoading, doAction } = useBooking(id)
  const [showPayment, setShowPayment] = useState(false)
  const [actionError, setActionError] = useState('')
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' })
  const [reviewSubmitted, setReviewSubmitted] = useState(false)
  const [reviewError, setReviewError] = useState('')
  const [reviewLoading, setReviewLoading] = useState(false)

  const handleAction = async (action, payload = {}) => {
    setActionError('')
    try {
      await doAction(action, payload)
      setShowPayment(false)
    } catch (err) {
      setActionError(err.response?.data?.message || err.message || 'Action failed')
    }
  }

  const handlePayment = (paymentData) => handleAction('submit_payment', { payment: paymentData })

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setReviewError('')
    if (reviewForm.rating === 0) { setReviewError('Please select a star rating'); return }
    if (!reviewForm.comment.trim()) { setReviewError('Please write a comment'); return }
    setReviewLoading(true)
    try {
      await api.post(`/listings/${booking.listingId}/reviews`, reviewForm)
      setReviewSubmitted(true)
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review')
    } finally {
      setReviewLoading(false)
    }
  }

  if (loading) return <div className="flex justify-center py-24"><Spinner className="w-12 h-12" /></div>
  if (bookingError) return <div className="text-center py-24 text-gray-500">{bookingError === 'Not found' ? 'Booking not found.' : 'Failed to load booking. Please try again.'}</div>
  if (!booking) return null

  const { status, listingName, type, customer, details, pricing, payment, history } = booking

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <button onClick={() => navigate('/bookings')} className="flex items-center gap-2 text-teal-500 text-sm mb-4 hover:underline">
        <ArrowLeft size={16} /> My Bookings
      </button>

      {/* Main card */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{listingName}</h1>
            <p className="text-sm text-gray-500 capitalize">{type}</p>
          </div>
          <Badge status={status} />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <InfoRow label="Guest"  value={customer?.name} />
          <InfoRow label="Email"  value={customer?.email} />
          {customer?.phone && <InfoRow label="Phone" value={customer.phone} />}
          {Object.entries(details || {}).map(([k, v]) => (
            <InfoRow key={k} label={k.replace(/([A-Z])/g, ' $1').trim()} value={String(v)} />
          ))}
        </div>

        <div className="border-t pt-4 flex justify-between text-sm font-bold">
          <span className="text-gray-700">Total Amount</span>
          <span className="text-teal-500">{formatCurrency(pricing?.total)}</span>
        </div>
      </div>

      {/* Payment action */}
      {(status === 'pending_payment' || status === 'payment_rejected') && (
        <div className={`rounded-2xl p-5 mb-4 border ${status === 'payment_rejected' ? 'bg-red-50 border-red-200' : 'bg-yellow-50 border-yellow-200'}`}>
          <p className={`text-sm font-semibold mb-1 ${status === 'payment_rejected' ? 'text-red-800' : 'text-yellow-800'}`}>
            {status === 'payment_rejected' ? 'Payment Rejected — Please Resubmit' : 'Payment Required'}
          </p>
          <p className={`text-xs mb-4 ${status === 'payment_rejected' ? 'text-red-600' : 'text-yellow-700'}`}>
            {status === 'payment_rejected'
              ? 'Your payment was rejected. Please provide correct payment details.'
              : 'Make a bank transfer or card payment and submit proof below.'}
          </p>
          {!showPayment ? (
            <Button size="sm" onClick={() => setShowPayment(true)}>
              <Upload size={14} /> {status === 'payment_rejected' ? 'Resubmit Payment' : 'Submit Payment Proof'}
            </Button>
          ) : (
            <PaymentForm
              totalAmount={pricing?.total}
              onSubmit={handlePayment}
              onCancel={() => setShowPayment(false)}
              loading={actionLoading}
            />
          )}
        </div>
      )}

      {/* Cancel button */}
      {['pending_payment', 'under_review', 'confirmed'].includes(status) && (
        <div className="mb-4">
          <Button
            variant="secondary"
            size="sm"
            className="border-red-300 text-red-500 hover:bg-red-50"
            onClick={() => { if (confirm('Cancel this booking?')) handleAction('cancel') }}
            disabled={actionLoading}
          >
            Cancel Booking
          </Button>
        </div>
      )}

      {actionError && <p className="text-red-500 text-sm mb-4 bg-red-50 rounded-xl px-3 py-2">{actionError}</p>}

      {/* Review form — only for confirmed bookings */}
      {['confirmed', 'completed'].includes(status) && (
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
          <h3 className="font-semibold text-gray-800 mb-4">Leave a Review</h3>
          {reviewSubmitted ? (
            <div className="text-center py-4">
              <div className="text-3xl mb-2">⭐</div>
              <p className="text-teal-600 font-medium text-sm">Thank you for your review!</p>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">Your Rating</p>
                <StarPicker value={reviewForm.rating} onChange={v => setReviewForm(f => ({ ...f, rating: v }))} />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Your Comment</p>
                <textarea
                  value={reviewForm.comment}
                  onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                  rows={3}
                  maxLength={1000}
                  placeholder="Share your experience..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                />
              </div>
              {reviewError && <p className="text-red-500 text-sm bg-red-50 rounded-xl px-3 py-2">{reviewError}</p>}
              <Button type="submit" disabled={reviewLoading}>
                {reviewLoading ? <Spinner className="w-4 h-4" /> : 'Submit Review'}
              </Button>
            </form>
          )}
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Activity Timeline</h3>
        <BookingTimeline history={history} />
      </div>
    </div>
  )
}

function InfoRow({ label, value }) {
  return (
    <div>
      <p className="text-xs text-gray-400 capitalize">{label}</p>
      <p className="text-gray-800 font-medium text-sm">{value}</p>
    </div>
  )
}

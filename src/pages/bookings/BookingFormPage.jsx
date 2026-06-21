import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getListing } from '../../api/listings.js'
import { createBooking } from '../../api/bookings.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import Button from '../../components/ui/Button.jsx'
import Spinner from '../../components/ui/Spinner.jsx'

const STEPS = ['Details', 'Review', 'Confirm']

const today = () => new Date().toISOString().split('T')[0]

const diffDays = (from, to) => {
  if (!from || !to) return 0
  const ms = new Date(to) - new Date(from)
  return Math.max(0, Math.round(ms / 86400000))
}

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

export default function BookingFormPage() {
  const { listingId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [listing, setListing] = useState(null)
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    phone: '', specialRequests: '',
    checkIn: '', checkOut: '', roomType: '',
    tourDate: '', participants: 1,
    pickupDate: '', returnDate: '',
  })

  useEffect(() => {
    getListing(listingId)
      .then(({ data }) => setListing(data))
      .catch(err => setError(err.response?.status === 404 ? 'Listing not found.' : 'Failed to load listing. Please go back and try again.'))
      .finally(() => setLoading(false))
  }, [listingId])

  const set = (k) => (e) => {
    const val = e.target.value
    setForm(f => {
      const next = { ...f, [k]: val }
      // Auto-adjust checkout if checkin moves past it
      if (k === 'checkIn' && next.checkOut && val >= next.checkOut) {
        const d = new Date(val); d.setDate(d.getDate() + 1)
        next.checkOut = d.toISOString().split('T')[0]
      }
      // Auto-adjust return if pickup moves past it
      if (k === 'pickupDate' && next.returnDate && val >= next.returnDate) {
        const d = new Date(val); d.setDate(d.getDate() + 1)
        next.returnDate = d.toISOString().split('T')[0]
      }
      return next
    })
    setErrors(e => ({ ...e, [k]: '' }))
  }

  if (loading) return <div className="flex justify-center py-24"><Spinner className="w-12 h-12" /></div>
  if (!listing) return <div className="text-center py-24 text-gray-500">{error || 'Listing not found.'}</div>

  const type = listing.listingType

  // Computed quantities from dates
  const nights = diffDays(form.checkIn, form.checkOut)
  const days    = diffDays(form.pickupDate, form.returnDate)

  const getQuantity = () => {
    if (type === 'hotel') return nights || 1
    if (type === 'tour') return Number(form.participants) || 1
    return days || 1
  }

  const total = listing.price.amount * getQuantity()

  const getDetails = () => {
    if (type === 'hotel') return { checkIn: form.checkIn, checkOut: form.checkOut, nights, roomType: form.roomType, guests: 2 }
    if (type === 'tour') return { tourDate: form.tourDate, participants: Number(form.participants), specialRequests: form.specialRequests }
    return { pickupDate: form.pickupDate, returnDate: form.returnDate, days }
  }

  const validate = () => {
    const e = {}
    const todayStr = today()

    if (type === 'hotel') {
      if (!form.checkIn)  e.checkIn  = 'Check-in date is required'
      else if (form.checkIn < todayStr) e.checkIn = 'Check-in cannot be in the past'
      if (!form.checkOut) e.checkOut = 'Check-out date is required'
      else if (form.checkOut <= form.checkIn) e.checkOut = 'Check-out must be after check-in'
      if (nights < 1) e.checkOut = 'Minimum 1 night stay required'
    }
    if (type === 'tour') {
      if (!form.tourDate) e.tourDate = 'Tour date is required'
      else if (form.tourDate < todayStr) e.tourDate = 'Tour date cannot be in the past'
      if (!form.participants || Number(form.participants) < 1) e.participants = 'At least 1 participant required'
    }
    if (type === 'vehicle') {
      if (!form.pickupDate)  e.pickupDate  = 'Pick-up date is required'
      else if (form.pickupDate < todayStr) e.pickupDate = 'Pick-up date cannot be in the past'
      if (!form.returnDate)  e.returnDate  = 'Return date is required'
      else if (form.returnDate <= form.pickupDate) e.returnDate = 'Return must be after pick-up date'
      if (days < 1) e.returnDate = 'Minimum 1 day rental required'
    }
    if (!form.phone.trim()) e.phone = 'Contact phone is required'
    else if (!/^\+?[\d\s\-]{7,15}$/.test(form.phone.trim())) e.phone = 'Enter a valid phone number'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleContinue = () => {
    if (validate()) setStep(1)
  }

  const handleSubmit = async () => {
    setSubmitting(true); setError('')
    try {
      const { data } = await createBooking({
        listingId: listing._id,
        customer: { name: user.name, email: user.email, phone: form.phone },
        details: getDetails(),
        pricing: { unitPrice: listing.price.amount, quantity: getQuantity(), extras: 0, total, currency: 'LKR' },
      })
      navigate(`/bookings/${data._id}`)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create booking')
    } finally {
      setSubmitting(false)
    }
  }

  const PRICE_UNIT = { hotel: 'night', tour: 'person', vehicle: 'day' }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      {/* Steps */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${i <= step ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {i + 1}
            </div>
            <span className={`ml-2 text-sm hidden md:block ${i <= step ? 'text-teal-500 font-medium' : 'text-gray-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-3 ${i < step ? 'bg-teal-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm p-6">
        {/* Listing header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b">
          <img src={listing.images[0]} alt={listing.name} className="w-16 h-16 object-cover rounded-xl" />
          <div>
            <h2 className="font-bold text-gray-900">{listing.name}</h2>
            <p className="text-sm text-gray-500 capitalize">{listing.listingType} · {listing.region}</p>
            <p className="text-sm font-semibold text-teal-500 mt-0.5">
              LKR {listing.price.amount.toLocaleString()} <span className="font-normal text-gray-400 text-xs">/ {PRICE_UNIT[type]}</span>
            </p>
          </div>
        </div>

        {/* Step 0 — Details */}
        {step === 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Booking Details</h3>

            {type === 'hotel' && (
              <>
                <Field label="Check-in Date" type="date" value={form.checkIn} onChange={set('checkIn')} min={today()} error={errors.checkIn} />
                <Field label="Check-out Date" type="date" value={form.checkOut} onChange={set('checkOut')} min={form.checkIn || today()} error={errors.checkOut} />
                {nights > 0 && (
                  <div className="bg-teal-50 border border-teal-100 rounded-xl px-4 py-3 flex justify-between items-center">
                    <span className="text-sm text-teal-700 font-medium">{nights} night{nights > 1 ? 's' : ''}</span>
                    <span className="text-teal-600 font-bold">LKR {(listing.price.amount * nights).toLocaleString()}</span>
                  </div>
                )}
                {listing.options?.roomTypes?.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Room Type</label>
                    <select value={form.roomType} onChange={set('roomType')} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm">
                      <option value="">Select room type</option>
                      {listing.options.roomTypes.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                )}
              </>
            )}

            {type === 'tour' && (
              <>
                <Field label="Tour Date" type="date" value={form.tourDate} onChange={set('tourDate')} min={today()} error={errors.tourDate} />
                <Field label="Number of Participants" type="number" value={form.participants} onChange={set('participants')} min={1} max={50} error={errors.participants} />
                {Number(form.participants) > 0 && (
                  <div className="bg-teal-50 border border-teal-100 rounded-xl px-4 py-3 flex justify-between items-center">
                    <span className="text-sm text-teal-700 font-medium">{form.participants} participant{form.participants > 1 ? 's' : ''}</span>
                    <span className="text-teal-600 font-bold">LKR {(listing.price.amount * Number(form.participants)).toLocaleString()}</span>
                  </div>
                )}
                <Field label="Special Requests (optional)" value={form.specialRequests} onChange={set('specialRequests')} placeholder="Dietary requirements, etc." />
              </>
            )}

            {type === 'vehicle' && (
              <>
                <Field label="Pick-up Date" type="date" value={form.pickupDate} onChange={set('pickupDate')} min={today()} error={errors.pickupDate} />
                <Field label="Return Date" type="date" value={form.returnDate} onChange={set('returnDate')} min={form.pickupDate || today()} error={errors.returnDate} />
                {days > 0 && (
                  <div className="bg-teal-50 border border-teal-100 rounded-xl px-4 py-3 flex justify-between items-center">
                    <span className="text-sm text-teal-700 font-medium">{days} day{days > 1 ? 's' : ''}</span>
                    <span className="text-teal-600 font-bold">LKR {(listing.price.amount * days).toLocaleString()}</span>
                  </div>
                )}
              </>
            )}

            <Field label="Contact Phone" value={form.phone} onChange={set('phone')} placeholder="+94 77 123 4567" error={errors.phone} />
            <Button onClick={handleContinue} className="w-full">Continue to Review</Button>
          </div>
        )}

        {/* Step 1 — Review */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">Review Booking</h3>
            <ReviewRow label="Guest" value={user.name} />
            <ReviewRow label="Email" value={user.email} />
            <ReviewRow label="Phone" value={form.phone} />
            {type === 'hotel' && <>
              <ReviewRow label="Check-in"  value={formatDate(form.checkIn)} />
              <ReviewRow label="Check-out" value={formatDate(form.checkOut)} />
              <ReviewRow label="Nights"    value={nights} />
              {form.roomType && <ReviewRow label="Room Type" value={form.roomType} />}
            </>}
            {type === 'tour' && <>
              <ReviewRow label="Tour Date"     value={formatDate(form.tourDate)} />
              <ReviewRow label="Participants"  value={form.participants} />
              {form.specialRequests && <ReviewRow label="Special Requests" value={form.specialRequests} />}
            </>}
            {type === 'vehicle' && <>
              <ReviewRow label="Pick-up" value={formatDate(form.pickupDate)} />
              <ReviewRow label="Return"  value={formatDate(form.returnDate)} />
              <ReviewRow label="Days"    value={days} />
            </>}
            <div className="border-t pt-3 mt-2">
              <ReviewRow label={`LKR ${listing.price.amount.toLocaleString()} × ${getQuantity()} ${PRICE_UNIT[type]}${getQuantity() > 1 ? 's' : ''}`} value={`LKR ${total.toLocaleString()}`} bold />
            </div>
            {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(0)} className="flex-1">Back</Button>
              <Button onClick={() => setStep(2)} className="flex-1">Confirm</Button>
            </div>
          </div>
        )}

        {/* Step 2 — Confirm */}
        {step === 2 && (
          <div className="space-y-4 text-center">
            <div className="text-5xl mb-2">✅</div>
            <h3 className="font-bold text-xl text-gray-900">Ready to Book!</h3>
            <p className="text-gray-600 text-sm">
              Your booking for <strong>{listing.name}</strong> will be created with status <strong>Pending Payment</strong>.
              You can upload payment proof afterwards.
            </p>
            <div className="bg-sand rounded-xl p-4 text-left space-y-2">
              <ReviewRow label="Total Amount" value={`LKR ${total.toLocaleString()}`} bold />
            </div>
            {error && <p className="text-red-500 text-sm bg-red-50 rounded-lg px-3 py-2">{error}</p>}
            <div className="flex gap-3">
              <Button variant="secondary" onClick={() => setStep(1)} className="flex-1">Back</Button>
              <Button onClick={handleSubmit} className="flex-1" disabled={submitting}>
                {submitting ? <Spinner className="w-4 h-4" /> : 'Create Booking'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, error, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        className={`w-full border rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 text-sm transition-colors ${
          error ? 'border-red-400 focus:ring-red-300 bg-red-50' : 'border-gray-200 focus:ring-teal-500'
        }`}
        {...props}
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  )
}

function ReviewRow({ label, value, bold }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={bold ? 'font-bold text-teal-500' : 'text-gray-800'}>{value}</span>
    </div>
  )
}

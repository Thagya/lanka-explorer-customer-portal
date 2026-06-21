export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const BOOKING_STATUSES = {
  PENDING_PAYMENT:      'pending_payment',
  UNDER_REVIEW:         'under_review',
  PAYMENT_REJECTED:     'payment_rejected',
  CONFIRMED:            'confirmed',
  RESCHEDULE_REQUESTED: 'reschedule_requested',
  AMENDMENT_REQUESTED:  'amendment_requested',
  CANCELLED:            'cancelled',
  COMPLETED:            'completed',
}

export const LISTING_TYPES = ['hotel', 'tour', 'vehicle']

export const ATTRACTION_CATEGORIES = ['Historical', 'Scenic', 'Beach', 'Cultural', 'Wildlife']

export const REGIONS = ['Colombo', 'Kandy', 'Galle', 'Central', 'Southern', 'Hill Country', 'Northern', 'Eastern']

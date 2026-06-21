export function formatCurrency(amount, currency = 'LKR') {
  return `${currency} ${Number(amount).toLocaleString()}`
}

export function formatDate(date, options = {}) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
    ...options,
  })
}

export function formatDateTime(date) {
  return new Date(date).toLocaleString('en-GB', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  })
}

export function capitalize(str = '') {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function slugify(str = '') {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
}

export const PRICE_UNIT_LABELS = {
  per_night:  '/night',
  per_person: '/person',
  per_day:    '/day',
}

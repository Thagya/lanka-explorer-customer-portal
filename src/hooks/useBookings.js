import { useState, useEffect, useCallback } from 'react'
import { getMyBookings, getBooking, transitionBooking } from '../api/bookings.js'

export function useMyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    getMyBookings()
      .then(({ data }) => setBookings(data))
      .catch(err => setError(err.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  return { bookings, loading, error, reload: load }
}

export function useBooking(id) {
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  const load = useCallback(() => {
    if (!id) return
    setLoading(true)
    getBooking(id)
      .then(({ data }) => setBooking(data))
      .catch(err => setError(err.response?.data?.message || 'Not found'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => { load() }, [load])

  const doAction = useCallback(async (action, payload = {}) => {
    setActionLoading(true)
    try {
      const { data } = await transitionBooking(id, { action, ...payload })
      setBooking(data)
      return data
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Action failed')
    } finally {
      setActionLoading(false)
    }
  }, [id])

  return { booking, loading, error, actionLoading, doAction, reload: load }
}

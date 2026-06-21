import { useState, useEffect } from 'react'
import { getListings } from '../api/listings.js'

export function useListings(params = {}) {
  const [listings, setListings] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getListings(params)
      .then(({ data }) => setListings(Array.isArray(data) ? data : []))
      .catch(err => setError(err.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [JSON.stringify(params)])

  return { listings, loading, error }
}

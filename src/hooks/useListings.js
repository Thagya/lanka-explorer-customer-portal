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
      .then(({ data }) => {
        if (!Array.isArray(data)) throw new Error('Unexpected response from server')
        setListings(data)
      })
      .catch(err => setError(err.response?.data?.message || 'Failed to load. Please refresh.'))
      .finally(() => setLoading(false))
  }, [JSON.stringify(params)])

  return { listings, loading, error }
}

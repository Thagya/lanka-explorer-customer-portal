import { useState, useEffect } from 'react'
import { getAttractions } from '../api/attractions.js'

export function useAttractions(params = {}) {
  const [attractions, setAttractions] = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    getAttractions(params)
      .then(({ data }) => setAttractions(Array.isArray(data) ? data : []))
      .catch(err => setError(err.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [JSON.stringify(params)])

  return { attractions, loading, error }
}

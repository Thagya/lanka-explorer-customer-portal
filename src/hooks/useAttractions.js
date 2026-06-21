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
      .then(({ data }) => {
        if (!Array.isArray(data)) throw new Error('Unexpected response from server')
        setAttractions(data)
      })
      .catch(err => setError(err.response?.data?.message || 'Failed to load. Please refresh.'))
      .finally(() => setLoading(false))
  }, [JSON.stringify(params)])

  return { attractions, loading, error }
}

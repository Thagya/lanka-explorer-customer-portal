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
      .then((res) => { console.log('attractions res:', typeof res.data, Array.isArray(res.data), JSON.stringify(res.data).substring(0,100)); setAttractions(res.data) })
      .catch(err => setError(err.response?.data?.message || 'Failed to load'))
      .finally(() => setLoading(false))
  }, [JSON.stringify(params)])

  return { attractions, loading, error }
}

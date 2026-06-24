import { useState, useCallback } from 'react'

export function useGeolocation() {
  const [lat, setLat]       = useState(null)
  const [lng, setLng]       = useState(null)
  const [error, setError]   = useState(null)
  const [loading, setLoading] = useState(false)

  const request = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.')
      return
    }
    setLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setLat(coords.latitude)
        setLng(coords.longitude)
        setLoading(false)
      },
      (err) => {
        setError(err.message || 'Unable to retrieve your location.')
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    )
  }, [])

  return { lat, lng, error, loading, request }
}

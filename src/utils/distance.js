// Haversine formula — returns distance in km between two lat/lng points
export function haversineKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const toRad = deg => (deg * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(a))
}

export function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m away`
  return `${km.toFixed(1)} km away`
}

// geo: URI opens native maps on Android/iOS; falls back to Google Maps on desktop
export function directionsUrl(lat, lng, label = '') {
  const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent)
  if (isMobile) return `geo:${lat},${lng}?q=${lat},${lng}(${encodeURIComponent(label)})`
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}

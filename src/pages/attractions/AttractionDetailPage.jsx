import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Clock, Ticket, Tag, ArrowLeft, ExternalLink, Heart, Navigation, LocateFixed } from 'lucide-react'
import { getAttraction } from '../../api/attractions.js'
import ImageGallery from '../../components/ui/ImageGallery.jsx'
import Spinner from '../../components/ui/Spinner.jsx'
import { useFavourites } from '../../contexts/FavouritesContext.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useGeolocation } from '../../hooks/useGeolocation.js'
import { haversineKm, formatDistance, directionsUrl } from '../../utils/distance.js'

export default function AttractionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [attraction, setAttraction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const { isFav, toggle, error: favError } = useFavourites()
  const { user } = useAuth()
  const { lat: userLat, lng: userLng, error: geoError, loading: geoLoading, request: requestLocation } = useGeolocation()

  useEffect(() => {
    setFetchError('')
    getAttraction(id)
      .then(({ data }) => setAttraction(data))
      .catch(err => setFetchError(err.response?.status === 404 ? 'Attraction not found.' : 'Failed to load attraction. Please try again.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="flex justify-center py-24"><Spinner className="w-12 h-12" /></div>
  if (fetchError) return <div className="text-center py-24 text-gray-500">{fetchError}</div>

  const hasCoords = attraction.lat && attraction.lng
  const mapsUrl = hasCoords
    ? `https://www.openstreetmap.org/?mlat=${attraction.lat}&mlon=${attraction.lng}#map=14/${attraction.lat}/${attraction.lng}`
    : `https://www.openstreetmap.org/search?query=${encodeURIComponent(attraction.name + ' Sri Lanka')}`

  const distanceKm =
    hasCoords && userLat && userLng
      ? haversineKm(userLat, userLng, attraction.lat, attraction.lng)
      : null

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {favError && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-2.5 text-sm mb-3">{favError}</div>
      )}

      <div className="flex items-center justify-between mb-4">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-teal-500 text-sm hover:underline">
          <ArrowLeft size={16} /> Back
        </button>
        {user && (
          <button
            onClick={() => toggle(id, 'attraction')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${
              isFav(id)
                ? 'bg-red-50 border-red-200 text-red-500'
                : 'bg-white border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-400'
            }`}
          >
            <Heart size={15} className={isFav(id) ? 'fill-red-500 text-red-500' : ''} />
            {isFav(id) ? 'Saved' : 'Save'}
          </button>
        )}
      </div>

      <div className="md:grid md:grid-cols-5 md:gap-8">
        {/* Gallery */}
        <div className="md:col-span-3">
          <ImageGallery images={attraction.images} alt={attraction.name} />

          {/* Embedded map below gallery */}
          {hasCoords && (
            <div className="mt-4 rounded-2xl overflow-hidden border border-gray-200">
              <iframe
                title={`Map of ${attraction.name}`}
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${attraction.lng - 0.05},${attraction.lat - 0.05},${attraction.lng + 0.05},${attraction.lat + 0.05}&layer=mapnik&marker=${attraction.lat},${attraction.lng}`}
                className="w-full h-52 border-0"
                loading="lazy"
              />
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-teal-600 hover:bg-gray-50 transition-colors border-t border-gray-200"
              >
                <ExternalLink size={12} /> Open in OpenStreetMap
              </a>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="md:col-span-2 mt-6 md:mt-0">
          <span className="inline-block bg-teal-500/10 text-teal-500 text-xs font-semibold px-3 py-1 rounded-full mb-3">
            {attraction.category}
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{attraction.name}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
            <span className="flex items-center gap-1"><MapPin size={14} /> {attraction.region}</span>
          </div>
          <p className="text-gray-700 text-sm mb-5 leading-relaxed">{attraction.description}</p>

          <div className="space-y-3 text-sm">
            {attraction.openingHours && (
              <div className="flex items-start gap-2">
                <Clock size={16} className="text-teal-500 mt-0.5" />
                <div><p className="font-medium text-gray-700">Opening Hours</p><p className="text-gray-600">{attraction.openingHours}</p></div>
              </div>
            )}
            {attraction.entryFee && (
              <div className="flex items-start gap-2">
                <Ticket size={16} className="text-teal-500 mt-0.5" />
                <div><p className="font-medium text-gray-700">Entry Fee</p><p className="text-gray-600">{attraction.entryFee}</p></div>
              </div>
            )}
            {(attraction.address || hasCoords) && (
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-teal-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-700">Location</p>
                  <p className="text-gray-600">{attraction.address || attraction.region + ', Sri Lanka'}</p>
                </div>
              </div>
            )}
          </div>

          {attraction.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {attraction.tags.map(t => (
                <span key={t} className="flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                  <Tag size={10} /> {t}
                </span>
              ))}
            </div>
          )}

          {/* Geolocation — distance + directions */}
          {hasCoords && (
            <div className="mt-6 space-y-2">
              {distanceKm != null ? (
                <>
                  <div className="flex items-center gap-2 bg-teal-50 border border-teal-100 rounded-xl px-4 py-2.5 text-sm text-teal-700 font-medium">
                    <LocateFixed size={15} className="shrink-0" />
                    {formatDistance(distanceKm)} from your location
                  </div>
                  <a
                    href={directionsUrl(attraction.lat, attraction.lng, attraction.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-xl transition-colors text-sm"
                  >
                    <Navigation size={16} /> Get Directions
                  </a>
                </>
              ) : (
                <>
                  {geoError && (
                    <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">{geoError}</p>
                  )}
                  <button
                    onClick={requestLocation}
                    disabled={geoLoading}
                    className="w-full flex items-center justify-center gap-2 border border-teal-500 text-teal-600 hover:bg-teal-50 font-medium py-3 px-4 rounded-xl transition-colors text-sm disabled:opacity-50"
                  >
                    <Navigation size={16} />
                    {geoLoading ? 'Getting location…' : 'Get Directions'}
                  </button>
                </>
              )}
            </div>
          )}

          {!hasCoords && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 w-full flex items-center justify-center gap-2 bg-teal-500 hover:bg-teal-600 text-white font-medium py-3 px-4 rounded-xl transition-colors text-sm"
            >
              <MapPin size={16} /> View on Map
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

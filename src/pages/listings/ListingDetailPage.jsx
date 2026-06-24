import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, ArrowLeft, Check, Navigation, Car, Star, Heart } from 'lucide-react'
import { getListing } from '../../api/listings.js'
import api from '../../api/client.js'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { useFavourites } from '../../contexts/FavouritesContext.jsx'
import ImageGallery from '../../components/ui/ImageGallery.jsx'
import Button from '../../components/ui/Button.jsx'
import Spinner from '../../components/ui/Spinner.jsx'

const PRICE_LABELS = { per_night: '/night', per_person: '/person', per_day: '/day' }

function Stars({ value, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map(s => (
        <Star key={s} size={size} className={s <= Math.round(value) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
      ))}
    </div>
  )
}

export default function ListingDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isFav, toggle, error: favError } = useFavourites()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState('')
  const [reviews, setReviews] = useState([])

  useEffect(() => {
    setFetchError('')
    getListing(id)
      .then(({ data }) => setListing(data))
      .catch(err => setFetchError(err.response?.status === 404 ? 'Listing not found.' : 'Failed to load listing. Please try again.'))
      .finally(() => setLoading(false))
    api.get(`/listings/${id}/reviews`).then(({ data }) => setReviews(data)).catch(() => {})
  }, [id])

  if (loading) return <div className="flex justify-center py-24"><Spinner className="w-12 h-12" /></div>
  if (fetchError) return <div className="text-center py-24 text-gray-500">{fetchError}</div>

  const handleBook = () => {
    if (!user) { navigate('/login'); return }
    navigate(`/book/${listing._id}`)
  }

  const amenities = listing.options?.amenities || listing.options?.includes || []
  const roomTypes = listing.options?.roomTypes || []

  const avgRating = listing.rating > 0 ? listing.rating : null
  const totalReviews = listing.reviewCount || 0


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
            onClick={() => toggle(id, 'listing')}
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
        <div className="md:col-span-3">
          <ImageGallery images={listing.images} alt={listing.name} />
        </div>

        <div className="md:col-span-2 mt-6 md:mt-0">
          <span className="inline-block bg-teal-500 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 capitalize">
            {listing.listingType}
          </span>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{listing.name}</h1>

          {avgRating && (
            <div className="flex items-center gap-1.5 mb-3">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={14} className={s <= Math.round(avgRating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
              ))}
              <span className="text-sm font-semibold text-gray-700">{avgRating}</span>
              <span className="text-xs text-gray-400">({totalReviews} review{totalReviews !== 1 ? 's' : ''})</span>
            </div>
          )}

          {(() => {
            const address = listing.address || listing.region + ', Sri Lanka'
            const isMobile = /android|iphone|ipad|ipod/i.test(navigator.userAgent)
            const mapsLink = isMobile
              ? `geo:0,0?q=${encodeURIComponent(address)}`
              : `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`

            if (listing.listingType === 'vehicle') {
              return (
                <div className="mb-4">
                  <div className="flex items-start gap-2 mb-2">
                    <Car size={15} className="text-teal-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-0.5">Pickup Location</p>
                      <p className="text-gray-700 text-sm font-medium">{address}</p>
                    </div>
                  </div>
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-600 bg-teal-50 border border-teal-100 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors"
                  >
                    <Navigation size={12} /> Get to Pickup Point
                  </a>
                </div>
              )
            }

            return (
              <div className="flex items-start gap-2 mb-4">
                <MapPin size={15} className="text-teal-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-gray-700 text-sm font-medium">{address}</p>
                  <a
                    href={mapsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:underline mt-0.5"
                  >
                    <Navigation size={11} /> Get Directions
                  </a>
                </div>
              </div>
            )
          })()}

          <p className="text-gray-700 text-sm mb-5 leading-relaxed">{listing.description}</p>

          <div className="bg-sand rounded-2xl p-4 mb-5">
            <div className="text-teal-500 font-bold text-2xl">
              LKR {listing.price.amount.toLocaleString()}
              <span className="text-gray-500 font-normal text-sm ml-1">{PRICE_LABELS[listing.price.unit]}</span>
            </div>
          </div>

          {roomTypes.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Room / Options</p>
              <div className="space-y-1">
                {roomTypes.map(r => (
                  <div key={r} className="flex items-center gap-2 text-sm text-gray-600">
                    <Check size={14} className="text-teal-500" /> {r}
                  </div>
                ))}
              </div>
            </div>
          )}

          {amenities.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-medium text-gray-700 mb-2">Includes / Amenities</p>
              <div className="flex flex-wrap gap-2">
                {amenities.map(a => (
                  <span key={a} className="flex items-center gap-1 bg-white border border-gray-200 text-gray-600 text-xs px-2.5 py-1 rounded-full">
                    <Check size={10} className="text-teal-500" /> {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Button onClick={handleBook} className="w-full" size="lg">
            {user ? 'Book Now' : 'Sign In to Book'}
          </Button>
        </div>
      </div>

      {/* Reviews — display only */}
      {reviews.length > 0 && (
        <div className="mt-10 border-t pt-8">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xl font-bold text-gray-900">Customer Reviews</h2>
            <div className="flex items-center gap-1.5">
              <Stars value={avgRating} />
              <span className="text-sm font-semibold text-gray-700">{avgRating}</span>
              <span className="text-xs text-gray-400">({totalReviews} review{totalReviews !== 1 ? 's' : ''})</span>
            </div>
          </div>
          <div className="space-y-4">
            {reviews.map(r => (
              <div key={r._id} className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900 text-sm">{r.userName}</p>
                    <Stars value={r.rating} size={13} />
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{r.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

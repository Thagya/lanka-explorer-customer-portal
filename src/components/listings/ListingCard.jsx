import { Link } from 'react-router-dom'
import { MapPin, Heart, Star } from 'lucide-react'
import Card from '../ui/Card.jsx'
import { useFavourites } from '../../contexts/FavouritesContext.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'

const PRICE_LABELS = { per_night: '/night', per_person: '/person', per_day: '/day' }
const TYPE_ICONS   = { hotel: '🏨', tour: '🗺️', vehicle: '🚙' }

export default function ListingCard({ listing }) {
  const { _id, name, listingType, region, images, description, price, rating, reviewCount } = listing
  const { isFav, toggle } = useFavourites()
  const { user } = useAuth()
  const fav = isFav(_id)

  const handleHeart = (e) => {
    e.preventDefault()
    if (user) toggle(_id, 'listing')
  }

  return (
    <Link to={`/listings/${_id}`}>
      <Card className="hover:shadow-md transition-all hover:-translate-y-1 h-full">
        <div className="relative overflow-hidden">
          <img
            src={images?.[0]}
            alt={name}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
          />
          <span className="absolute top-3 left-3 bg-teal-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full capitalize flex items-center gap-1">
            {TYPE_ICONS[listingType]} {listingType}
          </span>
          {user && (
            <button
              onClick={handleHeart}
              className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm transition-colors hover:bg-white"
            >
              <Heart size={16} className={fav ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
            </button>
          )}
          {images?.length > 1 && (
            <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full">
              +{images.length - 1} photos
            </span>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{name}</h3>
          <div className="flex items-center gap-1 text-gray-500 text-xs mb-2">
            <MapPin size={12} /> {region}
          </div>
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{description}</p>
          {rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={12} className={s <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
              ))}
              <span className="text-xs font-medium text-gray-600 ml-0.5">{rating}</span>
              <span className="text-xs text-gray-400">({reviewCount})</span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-teal-500 font-bold text-lg">
                LKR {price?.amount?.toLocaleString()}
              </span>
              <span className="text-gray-400 text-xs ml-1">{PRICE_LABELS[price?.unit]}</span>
            </div>
            <span className="text-xs bg-teal-50 text-teal-600 border border-teal-100 px-2.5 py-1 rounded-lg font-medium">
              Book Now
            </span>
          </div>
        </div>
      </Card>
    </Link>
  )
}

import { Link } from 'react-router-dom'
import { MapPin, Heart, Navigation } from 'lucide-react'
import Card from '../ui/Card.jsx'
import { useFavourites } from '../../contexts/FavouritesContext.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import { formatDistance } from '../../utils/distance.js'

export default function AttractionCard({ attraction, distanceKm }) {
  const { _id, name, category, region, address, images, shortDescription } = attraction
  const { isFav, toggle } = useFavourites()
  const { user } = useAuth()
  const fav = isFav(_id)

  const handleHeart = (e) => {
    e.preventDefault()
    if (user) toggle(_id, 'attraction')
  }

  return (
    <Link to={`/attractions/${_id}`}>
      <Card className="hover:shadow-md transition-all hover:-translate-y-1 h-full">
        <div className="relative overflow-hidden">
          <img
            src={images?.[0]}
            alt={name}
            className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
            onError={e => { e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22400%22 height%3D%22200%22%3E%3Crect width%3D%22400%22 height%3D%22200%22 fill%3D%22%23f3f4f6%22%2F%3E%3Ctext x%3D%22200%22 y%3D%22105%22 font-family%3D%22sans-serif%22 font-size%3D%2213%22 fill%3D%22%239ca3af%22 text-anchor%3D%22middle%22%3EImage not available%3C%2Ftext%3E%3C%2Fsvg%3E'; e.currentTarget.onerror = null }}
          />
          <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full text-teal-600">
            {category}
          </span>
          {user && (
            <button
              onClick={handleHeart}
              className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm transition-colors hover:bg-white"
            >
              <Heart size={16} className={fav ? 'fill-red-500 text-red-500' : 'text-gray-400'} />
            </button>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{name}</h3>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1 text-gray-500 text-xs">
              <MapPin size={12} /> {region}
            </div>
            {distanceKm != null && (
              <span className="flex items-center gap-1 text-xs font-medium text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                <Navigation size={10} /> {formatDistance(distanceKm)}
              </span>
            )}
          </div>
          {address && (
            <p className="text-gray-400 text-xs mb-2 line-clamp-1">{address}</p>
          )}
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">{shortDescription}</p>
          <div className="flex items-center justify-end">
            <span className="text-xs text-teal-500 font-medium">View Details →</span>
          </div>
        </div>
      </Card>
    </Link>
  )
}

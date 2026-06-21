import { Link } from 'react-router-dom'
import { MapPin, Heart } from 'lucide-react'
import Card from '../ui/Card.jsx'
import { useFavourites } from '../../contexts/FavouritesContext.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function AttractionCard({ attraction }) {
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
          <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
            <MapPin size={12} /> {region}
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

import AttractionCard from './AttractionCard.jsx'
import Spinner from '../ui/Spinner.jsx'
import { MapPin } from 'lucide-react'
import { haversineKm } from '../../utils/distance.js'

export default function AttractionGrid({ attractions, loading, userLocation }) {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="w-10 h-10" />
      </div>
    )
  }

  if (!attractions.length) {
    return (
      <div className="flex flex-col items-center py-20 text-gray-400">
        <MapPin size={48} className="mb-3 opacity-30" />
        <p className="text-lg font-medium">No attractions found</p>
        <p className="text-sm mt-1">Try a different search or category</p>
      </div>
    )
  }

  // Attach distance to each attraction when user location is known
  let items = attractions.map(a => ({
    attraction: a,
    distanceKm:
      userLocation && a.lat && a.lng
        ? haversineKm(userLocation.lat, userLocation.lng, a.lat, a.lng)
        : null,
  }))

  // Sort by distance (attractions without coords go last)
  if (userLocation) {
    items = items.sort((a, b) => {
      if (a.distanceKm == null && b.distanceKm == null) return 0
      if (a.distanceKm == null) return 1
      if (b.distanceKm == null) return -1
      return a.distanceKm - b.distanceKm
    })
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {items.map(({ attraction, distanceKm }) => (
        <AttractionCard key={attraction._id} attraction={attraction} distanceKm={distanceKm} />
      ))}
    </div>
  )
}

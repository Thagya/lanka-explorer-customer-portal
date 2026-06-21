import AttractionCard from './AttractionCard.jsx'
import Spinner from '../ui/Spinner.jsx'
import { MapPin } from 'lucide-react'

export default function AttractionGrid({ attractions, loading }) {
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {attractions.map(a => (
        <AttractionCard key={a._id} attraction={a} />
      ))}
    </div>
  )
}

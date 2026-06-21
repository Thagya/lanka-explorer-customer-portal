import ListingCard from './ListingCard.jsx'
import Spinner from '../ui/Spinner.jsx'
import { Building2 } from 'lucide-react'

export default function ListingGrid({ listings, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner className="w-10 h-10" />
      </div>
    )
  }

  if (!listings.length) {
    return (
      <div className="flex flex-col items-center py-20 text-gray-400">
        <Building2 size={48} className="mb-3 opacity-30" />
        <p className="text-lg font-medium">No listings found</p>
        <p className="text-sm mt-1">Try a different type or check back later</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {listings.map(l => (
        <ListingCard key={l._id} listing={l} />
      ))}
    </div>
  )
}

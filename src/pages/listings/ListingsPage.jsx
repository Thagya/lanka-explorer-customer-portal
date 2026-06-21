import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ListingFilter from '../../components/listings/ListingFilter.jsx'
import ListingGrid from '../../components/listings/ListingGrid.jsx'
import { useListings } from '../../hooks/useListings.js'

export default function ListingsPage() {
  const [searchParams] = useSearchParams()
  const [type, setType] = useState(searchParams.get('type') || '')

  const { listings, loading, error } = useListings(type ? { type } : {})

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-teal-500 mb-1">Stay &amp; Tours</h1>
      <p className="text-gray-500 text-sm mb-6">Hotels, guided tours, and vehicle rentals</p>

      <ListingFilter type={type} onType={setType} />
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm mb-4">
          Failed to load listings. Please try again.
        </div>
      )}
      <ListingGrid listings={listings} loading={loading} />
    </div>
  )
}

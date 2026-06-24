import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Navigation, LocateFixed, X } from 'lucide-react'
import AttractionFilter from '../../components/attractions/AttractionFilter.jsx'
import AttractionGrid from '../../components/attractions/AttractionGrid.jsx'
import { useAttractions } from '../../hooks/useAttractions.js'
import { useDebounce } from '../../hooks/useDebounce.js'
import { useGeolocation } from '../../hooks/useGeolocation.js'

export default function AttractionsPage() {
  const [searchParams] = useSearchParams()
  const [search, setSearch]     = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'All')
  const debouncedSearch = useDebounce(search)

  const { lat, lng, error: geoError, loading: geoLoading, request: requestLocation } = useGeolocation()
  const userLocation = lat && lng ? { lat, lng } : null

  const params = {}
  if (category !== 'All') params.category = category
  if (debouncedSearch)    params.search   = debouncedSearch

  const { attractions, loading, error } = useAttractions(params)

  const nearMeButton = userLocation ? (
    <button
      onClick={() => window.location.reload()}
      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-teal-500 bg-teal-50 text-teal-600 text-sm font-medium whitespace-nowrap shrink-0"
    >
      <LocateFixed size={15} />
      Sorted by distance
      <X size={13} className="opacity-60" />
    </button>
  ) : (
    <button
      onClick={requestLocation}
      disabled={geoLoading}
      className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-gray-600 hover:border-teal-400 hover:text-teal-600 text-sm font-medium whitespace-nowrap shrink-0 transition-colors disabled:opacity-50"
    >
      <Navigation size={15} />
      {geoLoading ? 'Locating…' : 'Near Me'}
    </button>
  )

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-teal-500 mb-1">Explore Attractions</h1>
      <p className="text-gray-500 text-sm mb-6">Discover the best of Sri Lanka</p>

      <AttractionFilter
        search={search}     onSearch={setSearch}
        category={category} onCategory={setCategory}
        extra={nearMeButton}
      />

      {geoError && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl px-4 py-2.5 text-sm mb-4">
          {geoError}
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm mb-4">
          Failed to load attractions. Please try again.
        </div>
      )}

      <AttractionGrid attractions={attractions} loading={loading} userLocation={userLocation} />
    </div>
  )
}

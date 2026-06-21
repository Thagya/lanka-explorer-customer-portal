import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import AttractionFilter from '../../components/attractions/AttractionFilter.jsx'
import AttractionGrid from '../../components/attractions/AttractionGrid.jsx'
import { useAttractions } from '../../hooks/useAttractions.js'
import { useDebounce } from '../../hooks/useDebounce.js'

export default function AttractionsPage() {
  const [searchParams] = useSearchParams()
  const [search, setSearch]     = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || 'All')
  const debouncedSearch = useDebounce(search)

  const params = {}
  if (category !== 'All') params.category = category
  if (debouncedSearch)    params.search   = debouncedSearch

  const { attractions, loading, error } = useAttractions(params)

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-teal-500 mb-1">Explore Attractions</h1>
      <p className="text-gray-500 text-sm mb-6">Discover the best of Sri Lanka</p>

      <AttractionFilter
        search={search}    onSearch={setSearch}
        category={category} onCategory={setCategory}
      />
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm mb-4">
          Failed to load attractions. Please try again.
        </div>
      )}
      <AttractionGrid attractions={attractions} loading={loading} />
    </div>
  )
}

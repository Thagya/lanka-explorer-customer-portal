import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'
import Button from '../components/ui/Button.jsx'
import AttractionCard from '../components/attractions/AttractionCard.jsx'
import ListingCard from '../components/listings/ListingCard.jsx'
import Spinner from '../components/ui/Spinner.jsx'
import { useAttractions } from '../hooks/useAttractions.js'
import { useListings } from '../hooks/useListings.js'

const HERO = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=80'

const HIGHLIGHTS = [
  { label: 'Cultural Sites',  count: '150+', emoji: '🏛️' },
  { label: 'Beaches',         count: '100+', emoji: '🏖️' },
  { label: 'Wildlife Parks',  count: '26',   emoji: '🐘' },
  { label: 'Heritage Hotels', count: '80+',  emoji: '🏨' },
]

export default function HomePage() {
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  const { attractions, loading: attractionsLoading } = useAttractions()
  const { listings,    loading: listingsLoading }    = useListings()

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/attractions?search=${encodeURIComponent(search)}`)
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative h-[75vh] min-h-[480px] flex items-center justify-center overflow-hidden">
        <img src={HERO} alt="Sri Lanka" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <p className="text-gold font-medium text-sm tracking-widest uppercase mb-3">Discover Sri Lanka</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            The Pearl of the<br className="hidden md:block" /> Indian Ocean
          </h1>
          <p className="text-white/80 text-lg mb-8 hidden md:block">
            Ancient temples, golden beaches, lush hill country, and vibrant wildlife awaits.
          </p>
          <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto">
            <div className="flex-1 relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search destinations..."
                className="w-full pl-10 pr-4 py-3 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <Button type="submit" size="lg">Search</Button>
          </form>
        </div>
      </section>

      {/* Highlights strip */}
      <section className="bg-teal-500 text-white py-8">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {HIGHLIGHTS.map(h => (
            <div key={h.label}>
              <div className="text-3xl mb-1">{h.emoji}</div>
              <div className="text-2xl font-bold text-gold">{h.count}</div>
              <div className="text-sm text-white/80">{h.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Explore Destinations */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Explore Destinations</h2>
            <p className="text-gray-500 text-sm mt-1">Discover Sri Lanka's most iconic places</p>
          </div>
          <Link
            to="/attractions"
            className="flex items-center gap-1 text-sm font-medium text-teal-500 hover:text-teal-600 transition-colors whitespace-nowrap"
          >
            View All <ArrowRight size={15} />
          </Link>
        </div>

        {attractionsLoading ? (
          <div className="flex justify-center py-12"><Spinner className="w-8 h-8" /></div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {attractions.slice(0, 3).map(a => (
              <AttractionCard key={a._id} attraction={a} />
            ))}
          </div>
        )}
      </section>

      {/* Hotels Tours Vehicles */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Hotels, Tours &amp; Vehicles</h2>
              <p className="text-gray-500 text-sm mt-1">Find and book your perfect stay or transport</p>
            </div>
            <Link
              to="/listings"
              className="flex items-center gap-1 text-sm font-medium text-teal-500 hover:text-teal-600 transition-colors whitespace-nowrap"
            >
              View All <ArrowRight size={15} />
            </Link>
          </div>

          {listingsLoading ? (
            <div className="flex justify-center py-12"><Spinner className="w-8 h-8" /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {listings.slice(0, 3).map(l => (
                <ListingCard key={l._id} listing={l} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-teal-500 rounded-3xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Ready to Plan Your Trip?</h2>
          <p className="text-white/80 mb-6 max-w-md mx-auto">
            Browse all destinations and book hotels, tours, or vehicles for your Sri Lanka adventure.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Button onClick={() => navigate('/listings')} variant="secondary" size="lg">
              Browse Listings
            </Button>
            <Button
              onClick={() => navigate('/attractions')}
              className="bg-gold text-teal-600 hover:opacity-90 px-6 py-3 rounded-xl font-medium text-base inline-flex items-center gap-2"
            >
              Explore Destinations <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}

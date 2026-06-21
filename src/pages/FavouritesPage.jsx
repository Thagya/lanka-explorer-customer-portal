import { Link } from 'react-router-dom'
import { Heart, MapPin, Building2 } from 'lucide-react'
import { useFavourites } from '../contexts/FavouritesContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import AttractionCard from '../components/attractions/AttractionCard.jsx'
import ListingCard from '../components/listings/ListingCard.jsx'
import Button from '../components/ui/Button.jsx'
import Spinner from '../components/ui/Spinner.jsx'

export default function FavouritesPage() {
  const { user } = useAuth()
  const { attractions, listings, loading, error } = useFavourites()

  if (!user) return (
    <div className="text-center py-24">
      <p className="text-gray-600 mb-4">Please sign in to view your favourites.</p>
      <Link to="/login"><Button>Sign In</Button></Link>
    </div>
  )

  if (loading) return <div className="flex justify-center py-24"><Spinner className="w-12 h-12" /></div>

  if (error) return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-teal-500 mb-6">My Favourites</h1>
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl px-4 py-3 text-sm">{error}</div>
    </div>
  )

  const total = attractions.length + listings.length

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-teal-500 mb-1">My Favourites</h1>
      <p className="text-gray-500 text-sm mb-6">Places and listings you've saved</p>

      {total === 0 ? (
        <div className="text-center py-16">
          <Heart size={48} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">No favourites yet. Tap the heart on any destination or listing to save it here.</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/attractions"><Button>Browse Destinations</Button></Link>
            <Link to="/listings"><Button variant="secondary">Browse Listings</Button></Link>
          </div>
        </div>
      ) : (
        <>
          {attractions.length > 0 && (
            <section className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <MapPin size={18} className="text-teal-500" />
                <h2 className="text-lg font-semibold text-gray-800">Destinations</h2>
                <span className="text-xs bg-teal-500/10 text-teal-600 font-semibold px-2 py-0.5 rounded-full">{attractions.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {attractions.map(a => <AttractionCard key={a._id} attraction={a} />)}
              </div>
            </section>
          )}

          {listings.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Building2 size={18} className="text-teal-500" />
                <h2 className="text-lg font-semibold text-gray-800">Hotels, Tours &amp; Vehicles</h2>
                <span className="text-xs bg-teal-500/10 text-teal-600 font-semibold px-2 py-0.5 rounded-full">{listings.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {listings.map(l => <ListingCard key={l._id} listing={l} />)}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  )
}

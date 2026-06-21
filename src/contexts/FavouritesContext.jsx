import { createContext, useContext, useEffect, useState } from 'react'
import api from '../api/client.js'
import { useAuth } from './AuthContext.jsx'

const FavouritesContext = createContext(null)

export function FavouritesProvider({ children }) {
  const { user } = useAuth()
  const [favouriteIds, setFavouriteIds] = useState(new Set())
  const [attractions, setAttractions] = useState([])
  const [listings, setListing] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      setFavouriteIds(new Set())
      setAttractions([])
      setListing([])
      setError('')
      return
    }
    setLoading(true)
    setError('')
    api.get('/favourites')
      .then(({ data }) => {
        setAttractions(data.attractions)
        setListing(data.listings)
        setFavouriteIds(new Set([
          ...data.attractions.map(a => a._id),
          ...data.listings.map(l => l._id),
        ]))
      })
      .catch(() => setError('Failed to load favourites. Please refresh.'))
      .finally(() => setLoading(false))
  }, [user])

  const isFav = (id) => favouriteIds.has(id)

  const toggle = async (itemId, itemType) => {
    if (!user) return
    try {
      if (favouriteIds.has(itemId)) {
        await api.delete(`/favourites/${itemId}`)
        setFavouriteIds(prev => { const s = new Set(prev); s.delete(itemId); return s })
        if (itemType === 'attraction') setAttractions(prev => prev.filter(a => a._id !== itemId))
        else setListing(prev => prev.filter(l => l._id !== itemId))
      } else {
        await api.post('/favourites', { itemId, itemType })
        setFavouriteIds(prev => new Set([...prev, itemId]))
        if (itemType === 'attraction') {
          const { data } = await api.get(`/attractions/${itemId}`)
          setAttractions(prev => [...prev, data])
        } else {
          const { data } = await api.get(`/listings/${itemId}`)
          setListing(prev => [...prev, data])
        }
      }
    } catch {
      setError('Could not update favourites. Please try again.')
    }
  }

  return (
    <FavouritesContext.Provider value={{ isFav, toggle, attractions, listings, loading, error }}>
      {children}
    </FavouritesContext.Provider>
  )
}

export const useFavourites = () => useContext(FavouritesContext)

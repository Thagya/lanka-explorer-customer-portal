import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { FavouritesProvider } from './contexts/FavouritesContext.jsx'
import FavouritesPage from './pages/FavouritesPage.jsx'
import Layout from './components/layout/Layout.jsx'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import AttractionsPage from './pages/attractions/AttractionsPage.jsx'
import AttractionDetailPage from './pages/attractions/AttractionDetailPage.jsx'
import ListingsPage from './pages/listings/ListingsPage.jsx'
import ListingDetailPage from './pages/listings/ListingDetailPage.jsx'
import BookingFormPage from './pages/bookings/BookingFormPage.jsx'
import MyBookingsPage from './pages/bookings/MyBookingsPage.jsx'
import BookingDetailPage from './pages/bookings/BookingDetailPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FavouritesProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<Layout><HomePage /></Layout>} />
          <Route path="/attractions" element={<Layout><AttractionsPage /></Layout>} />
          <Route path="/attractions/:id" element={<Layout><AttractionDetailPage /></Layout>} />
          <Route path="/listings" element={<Layout><ListingsPage /></Layout>} />
          <Route path="/listings/:id" element={<Layout><ListingDetailPage /></Layout>} />
          <Route path="/book/:listingId" element={<Layout><BookingFormPage /></Layout>} />
          <Route path="/bookings" element={<Layout><MyBookingsPage /></Layout>} />
          <Route path="/bookings/:id" element={<Layout><BookingDetailPage /></Layout>} />
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/favourites" element={<Layout><FavouritesPage /></Layout>} />
        </Routes>
        </FavouritesProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

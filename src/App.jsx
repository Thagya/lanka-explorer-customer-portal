import { Component } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.jsx'

class ErrorBoundary extends Component {
  state = { error: null, info: null }
  static getDerivedStateFromError(error) { return { error } }
  componentDidCatch(error, info) { this.setState({ info }) }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ color: '#1F4E4E' }}>Something went wrong</h2>
          <p style={{ color: '#666', margin: '0.5rem 0' }}>{this.state.error.message}</p>
          <pre style={{ background: '#f5f5f5', padding: '1rem', fontSize: '11px', overflowX: 'auto', borderRadius: '8px', marginBottom: '1rem' }}>
            {this.state.info?.componentStack}
          </pre>
          <button onClick={() => { this.setState({ error: null }); window.location.href = '/' }}
            style={{ background: '#1F4E4E', color: '#fff', border: 'none', padding: '0.5rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}>
            Go Home
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
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
    <ErrorBoundary>
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
    </ErrorBoundary>
  )
}

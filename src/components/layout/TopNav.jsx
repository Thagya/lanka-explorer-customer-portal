import { Link, useNavigate } from 'react-router-dom'
import { User, LogOut, LogIn, Heart } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext.jsx'

export default function TopNav() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <header className="hidden md:flex fixed top-0 left-0 right-0 z-40 h-14 bg-teal-500 text-white items-center px-6 shadow-md">
      <Link to="/" className="font-bold text-lg tracking-tight mr-8">Lanka Explorer</Link>
      <nav className="flex items-center gap-6 text-sm flex-1">
        <Link to="/attractions" className="hover:text-gold transition-colors">Explore</Link>
        <Link to="/listings" className="hover:text-gold transition-colors">Stay & Tours</Link>
        {user && <Link to="/bookings" className="hover:text-gold transition-colors">My Bookings</Link>}
        {user && (
          <Link to="/favourites" className="flex items-center gap-1 hover:text-gold transition-colors">
            <Heart size={14} /> My Favourites
          </Link>
        )}
      </nav>
      <div className="flex items-center gap-3">
        {user ? (
          <>
            <Link to="/profile" className="flex items-center gap-2 text-sm hover:text-gold transition-colors">
              <User size={16} /> {user.name.split(' ')[0]}
            </Link>
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-white/70 hover:text-white transition-colors">
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="flex items-center gap-2 text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-lg transition-colors">
            <LogIn size={16} /> Sign In
          </Link>
        )}
      </div>
    </header>
  )
}

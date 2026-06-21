import { useNavigate, Link } from 'react-router-dom'
import { User, Mail, LogOut, CalendarDays, Heart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext.jsx'
import Button from '../components/ui/Button.jsx'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return (
    <div className="text-center py-24">
      <p className="text-gray-600 mb-4">Please sign in to view your profile.</p>
      <Link to="/login"><Button>Sign In</Button></Link>
    </div>
  )

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center text-white text-2xl font-bold">
            {user.name[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-500 capitalize">{user.role}</p>
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3 text-gray-700">
            <Mail size={16} className="text-teal-500" /> {user.email}
          </div>
          <div className="flex items-center gap-3 text-gray-700">
            <User size={16} className="text-teal-500" /> Member since {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Link to="/bookings">
          <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
            <CalendarDays size={20} className="text-teal-500" />
            <span className="font-medium text-gray-800">My Bookings</span>
          </div>
        </Link>
        <Link to="/favourites">
          <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
            <Heart size={20} className="text-red-400" />
            <span className="font-medium text-gray-800">My Favourites</span>
          </div>
        </Link>
        <Button variant="secondary" onClick={handleLogout} className="w-full border-red-300 text-red-600 hover:bg-red-50">
          <LogOut size={16} /> Sign Out
        </Button>
      </div>
    </div>
  )
}

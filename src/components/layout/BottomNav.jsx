import { NavLink } from 'react-router-dom'
import { Home, MapPin, Building2, Heart, CalendarDays, User } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext.jsx'

const guestLinks = [
  { to: '/',            label: 'Home',    Icon: Home,        exact: true },
  { to: '/attractions', label: 'Explore', Icon: MapPin },
  { to: '/listings',    label: 'Stay',    Icon: Building2 },
  { to: '/profile',     label: 'Profile', Icon: User },
]

const authLinks = [
  { to: '/',            label: 'Home',      Icon: Home,         exact: true },
  { to: '/attractions', label: 'Explore',   Icon: MapPin },
  { to: '/bookings',    label: 'Bookings',  Icon: CalendarDays },
  { to: '/favourites',  label: 'Favourites', Icon: Heart },
  { to: '/profile',     label: 'Profile',   Icon: User },
]

export default function BottomNav() {
  const { user } = useAuth()
  const links = user ? authLinks : guestLinks

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 flex">
      {links.map(({ to, label, Icon, exact }) => (
        <NavLink key={to} to={to} end={exact}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center py-2 gap-0.5 text-xs transition-colors ${isActive ? 'text-teal-500' : 'text-gray-500'}`
          }
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

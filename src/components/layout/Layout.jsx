import TopNav from './TopNav.jsx'
import BottomNav from './BottomNav.jsx'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen">
      <TopNav />
      <main className="md:pt-14 pb-16 md:pb-0">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

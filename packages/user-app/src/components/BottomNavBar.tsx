import { useNavigate, useLocation } from 'react-router-dom'

const TABS = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/favorites', label: 'Favorites', icon: '❤️' },
  { path: '/preferences', label: 'Profile', icon: '👤' },
]

export default function BottomNavBar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-surface-container-lowest border-t border-outline-variant/50 flex justify-around items-center h-16 pb-safe">
      {TABS.map((tab) => {
        const isActive = location.pathname === tab.path
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-transform min-w-[64px] py-1 ${
              isActive ? 'text-primary' : 'text-secondary'
            }`}
          >
            <span className="text-2xl">{tab.icon}</span>
            <span className={`text-[11px] leading-none ${isActive ? 'font-bold' : 'font-semibold'}`}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

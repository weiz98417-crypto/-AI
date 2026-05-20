import { useNavigate, useLocation } from 'react-router-dom'

const TABS = [
  { path: '/', label: 'Home', icon: 'home' },
  { path: '/favorites', label: 'Favorites', icon: 'favorite' },
  { path: '/preferences', label: 'Profile', icon: 'person' },
]

export default function BottomNavBar() {
  const navigate = useNavigate()
  const location = useLocation()

  const getActiveStyle = (path: string) => {
    const isActive = location.pathname === path || (path === '/' && location.pathname === '/')
    return isActive
      ? 'text-primary font-bold'
      : 'text-secondary'
  }

  return (
    <nav className="fixed bottom-0 w-full z-50 bg-surface-container-lowest border-t border-outline-variant/50 flex justify-around items-center h-16 pb-safe">
      {TABS.map((tab) => {
        const isActive = location.pathname === tab.path || (tab.path === '/' && location.pathname === '/')
        return (
          <button
            key={tab.path}
            onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center justify-center ${getActiveStyle(tab.path)} active:bg-surface-container-low transition-transform duration-150 active:scale-95 min-w-[64px]`}
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: `'FILL' ${isActive ? 1 : 0}, 'wght' 400` }}
            >
              {tab.icon}
            </span>
            <span className="text-xs font-semibold" style={{ fontSize: '12px', lineHeight: '16px' }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

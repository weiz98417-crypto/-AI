import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Bookmark, Settings } from './Icons'

const TABS = [
  { path: '/', label: '首页', Icon: Home },
  { path: '/favorites', label: '收藏', Icon: Bookmark },
  { path: '/preferences', label: '偏好', Icon: Settings },
]

export default function BottomNavBar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <nav className="fixed bottom-0 w-full z-50 glass-nav flex justify-around items-center h-16 pb-safe">
      {TABS.map((tab) => {
        const isActive = location.pathname === tab.path
        return (
          <button key={tab.path} onClick={() => navigate(tab.path)}
            className={`flex flex-col items-center justify-center gap-0.5 active:scale-95 transition-all min-w-[64px] py-1 ${isActive ? 'text-primary' : 'text-outline-variant'}`}>
            <tab.Icon size={22} strokeWidth={isActive ? 2.2 : 1.6} />
            <span className={`text-[11px] leading-none ${isActive ? 'font-bold' : 'font-semibold'}`}>{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}

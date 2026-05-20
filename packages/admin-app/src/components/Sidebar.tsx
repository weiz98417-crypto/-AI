import { useNavigate, useLocation } from 'react-router-dom'
import { useAdmin } from '../store/AdminContext'

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: '📊' },
  { path: '/analytics', label: '用户偏好分析', icon: '📈' },
  { path: '/outfits', label: '穿搭管理', icon: '👗' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { dispatch } = useAdmin()

  return (
    <aside className="w-[260px] bg-surface-container-lowest min-h-screen border-r border-outline-variant p-6 flex flex-col shrink-0">
      <div className="mb-10">
        <h1 className="text-xl font-extrabold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
          逛逛AI
        </h1>
        <p className="text-xs text-on-surface-variant mt-1">后台管理</p>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                isActive
                  ? 'bg-primary-container text-on-primary-container font-semibold'
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </button>
          )
        })}
      </nav>

      <button
        onClick={() => dispatch({ type: 'LOGOUT' })}
        className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-error transition-colors"
      >
        <span className="text-xl">🚪</span>
        <span className="text-sm">退出登录</span>
      </button>
    </aside>
  )
}

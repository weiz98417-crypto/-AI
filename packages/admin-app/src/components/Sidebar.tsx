import { useNavigate, useLocation } from 'react-router-dom'
import { useAdmin } from '../store/AdminContext'

const NAV = [
  { path: '/', label: '数据看板', icon: '📊' },
  { path: '/analytics', label: '用户洞察', icon: '📈' },
  { path: '/outfits', label: '内容管理', icon: '👗' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { dispatch } = useAdmin()

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface border-r border-outline-variant/20 flex flex-col py-6 z-50">
      <div className="px-6 mb-8">
        <h1 className="text-[28px] font-bold text-primary leading-tight">GuangGuangAI</h1>
        <p className="text-xs text-secondary uppercase tracking-widest mt-1 font-semibold">Admin Console</p>
      </div>

      <nav className="flex-1 space-y-0.5">
        {NAV.map((item) => {
          const active = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 py-3 px-6 text-left text-sm transition-all ${
                active
                  ? 'bg-surface-container text-on-surface rounded-r-full border-l-4 border-primary font-semibold'
                  : 'text-secondary hover:text-primary hover:bg-surface-container-low'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="mt-auto px-6 space-y-3">
        <button className="w-full bg-primary-container text-on-primary-container py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
          <span className="text-lg">✨</span>
          新建推荐
        </button>
        <div className="pt-4 border-t border-outline-variant/20">
          <button
            onClick={() => dispatch({ type: 'LOGOUT' })}
            className="flex items-center gap-3 text-secondary hover:text-primary py-2 transition-colors text-sm w-full text-left"
          >
            <span className="text-lg">🚪</span>
            退出登录
          </button>
        </div>
      </div>
    </aside>
  )
}

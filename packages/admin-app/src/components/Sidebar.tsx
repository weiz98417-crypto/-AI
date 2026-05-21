import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAdmin } from '../store/AdminContext'
import type { ManagedOutfit } from '../shared/types'
import AiGenerateModal from './AiGenerateModal'

const NAV = [
  { path: '/', label: '数据看板' },
  { path: '/analytics', label: '用户洞察' },
  { path: '/outfits', label: '内容管理' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state, dispatch } = useAdmin()
  const [showAiModal, setShowAiModal] = useState(false)

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] bg-surface border-r border-outline-variant/20 flex flex-col py-6 z-50">
      <div className="px-6 mb-8">
        <h1 className="text-[28px] font-bold leading-tight gradient-text">GuangGuangAI</h1>
        <p className="text-xs text-secondary uppercase tracking-widest mt-1 font-semibold">Admin Console</p>
      </div>

      <nav className="flex-1 space-y-0.5">
        {NAV.map((item) => {
          const active = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 py-3 px-6 text-left text-sm transition-all duration-300 ${
                active
                  ? 'bg-surface-container text-on-surface rounded-r-full border-l-4 border-primary font-semibold shadow-sm'
                  : 'text-secondary hover:text-primary hover:bg-surface-container-low hover:translate-x-1'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${active ? 'bg-primary scale-125 shadow-sm shadow-primary/30' : 'bg-outline-variant group-hover:scale-125 group-hover:bg-primary/40'}`} />
              <span>{item.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="mt-auto px-6 space-y-3">
        <button
          onClick={() => setShowAiModal(true)}
          className="w-full bg-primary-container text-on-primary-container py-3 px-4 rounded-xl font-semibold text-sm hover:opacity-90 transition-all text-center btn-glow hover:shadow-md hover:scale-[1.02]"
        >
          + 新建推荐
        </button>
        <div className="pt-4 border-t border-outline-variant/20">
          <button
            onClick={() => dispatch({ type: 'LOGOUT' })}
            className="flex items-center gap-3 text-secondary hover:text-error py-2 transition-colors text-sm w-full text-left"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-outline-variant" />
            退出登录
          </button>
        </div>
      </div>

      {showAiModal && (
        <AiGenerateModal
          onClose={() => setShowAiModal(false)}
          onAdd={(outfit: ManagedOutfit) => {
            dispatch({ type: 'ADD_OUTFIT', outfit })
          }}
        />
      )}
    </aside>
  )
}

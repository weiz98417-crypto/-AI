import { useState, useRef, type PointerEvent as ReactPointerEvent } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAdmin } from './store/AdminContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AnalyticsPage from './pages/AnalyticsPage'
import OutfitsPage from './pages/OutfitsPage'
import UsersPage from './pages/UsersPage'
import OrdersPage from './pages/OrdersPage'
import ActivitiesPage from './pages/ActivitiesPage'
import SettingsPage from './pages/SettingsPage'
import Sidebar from './components/Sidebar'
import AdminTopBar from './components/AdminTopBar'
import AdminAiAssistant from './components/AdminAiAssistant'

function AdminLayout() {
  const [showAssistant, setShowAssistant] = useState(false)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const dragging = useRef(false)
  const startPos = useRef({ x: 0, y: 0, elX: 0, elY: 0 })

  const onPointerDown = (e: ReactPointerEvent) => {
    dragging.current = true
    startPos.current = { x: e.clientX, y: e.clientY, elX: pos.x, elY: pos.y }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: ReactPointerEvent) => {
    if (!dragging.current) return
    setPos({
      x: startPos.current.elX + e.clientX - startPos.current.x,
      y: startPos.current.elY + e.clientY - startPos.current.y,
    })
  }
  const onPointerUp = () => { dragging.current = false }

  return (
    <div className="min-h-screen bg-[#F9F3F5]">
      <Sidebar />
      <main className="ml-[260px] min-h-screen flex flex-col">
        <AdminTopBar />
        <div className="flex-1 pt-24 pb-12 px-8 max-w-[1440px] w-full">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/outfits" element={<OutfitsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>

      {/* Draggable Floating AI Assistant Button */}
      {!showAssistant && (
        <button
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onClick={() => { if (!dragging.current) setShowAssistant(true) }}
          className="fixed z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-container text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform cursor-grab active:cursor-grabbing"
          style={{ bottom: `calc(2rem - ${pos.y}px)`, right: `calc(2rem - ${pos.x}px)`, boxShadow: '0 4px 24px rgba(135, 76, 99, 0.35)', touchAction: 'none' }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5z"/></svg>
        </button>
      )}

      {showAssistant && (
        <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowAssistant(false)}>
          <div className="bg-surface w-full sm:max-w-lg sm:rounded-3xl shadow-2xl border border-outline-variant/20 overflow-hidden flex flex-col"
            style={{ height: '100dvh', maxHeight: '700px' }} onClick={e => e.stopPropagation()}>
            <AdminAiAssistant onClose={() => setShowAssistant(false)} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const { state } = useAdmin()
  if (!state.isLoggedIn) return <LoginPage />
  return <AdminLayout />
}

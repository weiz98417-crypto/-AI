import { Routes, Route, Navigate } from 'react-router-dom'
import { useAdmin } from './store/AdminContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AnalyticsPage from './pages/AnalyticsPage'
import OutfitsPage from './pages/OutfitsPage'
import Sidebar from './components/Sidebar'
import AdminTopBar from './components/AdminTopBar'

function AdminLayout() {
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
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default function App() {
  const { state } = useAdmin()
  if (!state.isLoggedIn) return <LoginPage />
  return <AdminLayout />
}

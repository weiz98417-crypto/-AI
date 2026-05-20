import { Routes, Route, Navigate } from 'react-router-dom'
import { useAdmin } from './store/AdminContext'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AnalyticsPage from './pages/AnalyticsPage'
import OutfitsPage from './pages/OutfitsPage'
import Sidebar from './components/Sidebar'

function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 bg-surface-container-low min-h-screen">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/outfits" element={<OutfitsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  const { state } = useAdmin()

  if (!state.isLoggedIn) {
    return <LoginPage />
  }

  return <AdminLayout />
}

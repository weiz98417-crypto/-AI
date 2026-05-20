import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import HomePage from './pages/HomePage'
import RecommendPage from './pages/RecommendPage'
import PreferencesPage from './pages/PreferencesPage'
import FavoritesPage from './pages/FavoritesPage'
import SharePage from './pages/SharePage'

export default function App() {
  return (
    <Routes>
      {/* Pages with BottomNavBar + TopAppBar wrapper */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Route>
      {/* Full-screen pages without BottomNavBar */}
      <Route path="/recommend/:occasion" element={<RecommendPage />} />
      <Route path="/preferences" element={<PreferencesPage />} />
      <Route path="/share/:outfitId" element={<SharePage />} />
    </Routes>
  )
}

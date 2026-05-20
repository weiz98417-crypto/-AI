import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import RecommendPage from './pages/RecommendPage'
import PreferencesPage from './pages/PreferencesPage'
import FavoritesPage from './pages/FavoritesPage'
import SharePage from './pages/SharePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/recommend/:occasion" element={<RecommendPage />} />
      <Route path="/preferences" element={<PreferencesPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/share/:outfitId" element={<SharePage />} />
    </Routes>
  )
}

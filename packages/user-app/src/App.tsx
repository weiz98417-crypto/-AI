import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import AppLayout from './components/AppLayout'
import HomePage from './pages/HomePage'
import RecommendPage from './pages/RecommendPage'
import PreferencesPage from './pages/PreferencesPage'
import FavoritesPage from './pages/FavoritesPage'
import SharePage from './pages/SharePage'
import StyleAssistant from './components/StyleAssistant'

export default function App() {
  const [showAssistant, setShowAssistant] = useState(false)

  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Route>
        <Route path="/recommend/:occasion" element={<RecommendPage />} />
        <Route path="/preferences" element={<PreferencesPage />} />
        <Route path="/share/:outfitId" element={<SharePage />} />
      </Routes>

      {/* Global Floating Assistant — visible on all pages */}
      {!showAssistant && (
        <button
          onClick={() => setShowAssistant(true)}
          className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-2xl bg-gradient-to-br from-tertiary to-tertiary-container text-white shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all animate-float text-2xl"
          style={{ boxShadow: '0 4px 20px rgba(66, 96, 133, 0.35)' }}
        >✨</button>
      )}

      {showAssistant && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowAssistant(false)}>
          <div className="absolute inset-0 sm:relative sm:max-w-md sm:rounded-3xl sm:h-auto bg-surface shadow-2xl border border-outline-variant/20 overflow-hidden flex flex-col"
            onClick={e => e.stopPropagation()}>
            <StyleAssistant onClose={() => setShowAssistant(false)} />
          </div>
        </div>
      )}
    </>
  )
}

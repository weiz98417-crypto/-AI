import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import TopAppBar from '../components/TopAppBar'
import BottomNavBar from '../components/BottomNavBar'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const [tab, setTab] = useState<'favorites' | 'history'>('favorites')

  const favOutfits = state.outfits.filter((o) => state.favorites.includes(o.id))
  const historyOutfits = state.browsingHistory
    .map((e) => state.outfits.find((o) => o.id === e.outfitId))
    .filter(Boolean)

  const displayedOutfits = tab === 'favorites' ? favOutfits : historyOutfits

  return (
    <div className="min-h-screen bg-background text-on-background pb-24">
      <TopAppBar title="GuangGuangAI" />

      <main className="pt-14 px-3">
        {/* Tab Toggle */}
        <div className="flex bg-surface-container-low rounded-full p-1 mb-6">
          <button
            onClick={() => setTab('favorites')}
            className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              tab === 'favorites'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-secondary'
            }`}
            style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}
          >
            Favorites
          </button>
          <button
            onClick={() => setTab('history')}
            className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
              tab === 'history'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-secondary'
            }`}
            style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}
          >
            History
          </button>
        </div>

        {/* Stats */}
        <div className="mb-4 flex justify-between items-end">
          <div>
            <p className="text-xs text-secondary" style={{ fontSize: '12px', lineHeight: '16px' }}>
              {tab === 'favorites' ? 'Saved Items' : 'Recently Viewed'}
            </p>
            <h2 className="text-2xl font-bold text-on-surface" style={{ fontSize: '24px', lineHeight: '32px', fontWeight: 700 }}>
              {displayedOutfits.length} {tab === 'favorites' ? 'Curated Outfits' : 'Items'}
            </h2>
          </div>
        </div>

        {/* Cards */}
        {displayedOutfits.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-outline mb-4">
              {tab === 'favorites' ? 'favorite_border' : 'history'}
            </span>
            <p className="text-sm text-on-surface-variant mb-4">
              {tab === 'favorites' ? '还没有收藏任何穿搭' : '暂无浏览记录'}
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 bg-primary text-on-primary rounded-full text-xs font-semibold active:scale-95"
              style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}
            >
              去逛逛
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {displayedOutfits.map((outfit) => {
              if (!outfit) return null
              const historyEntry = state.browsingHistory.find((e) => e.outfitId === outfit.id)
              return (
                <div
                  key={outfit.id}
                  className="bg-surface-container-lowest rounded-xl p-4 flex gap-4 border border-outline-variant/50 shadow-sm cursor-pointer active:opacity-80"
                  onClick={() => navigate(`/recommend/${outfit.occasion}`)}
                >
                  <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={outfit.coverImage} alt={outfit.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider" style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}>
                          {outfit.brandSummary.split('+')[0].trim()}
                        </span>
                        {outfit.priceRange === 'luxury' && (
                          <span className="bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-full text-[10px]">PREMIUM</span>
                        )}
                      </div>
                      <h3 className="text-sm text-on-surface mt-1" style={{ fontSize: '14px', lineHeight: '20px' }}>
                        {outfit.name}
                      </h3>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-on-surface" style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}>
                        ¥{outfit.totalPrice.toLocaleString()}
                      </span>
                      {tab === 'history' && historyEntry && (
                        <span className="text-xs text-tertiary" style={{ fontSize: '12px', lineHeight: '16px' }}>
                          {new Date(historyEntry.viewedAt).toLocaleDateString('zh-CN')}
                        </span>
                      )}
                      {tab === 'favorites' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            dispatch({ type: 'TOGGLE_FAVORITE', outfitId: outfit.id })
                          }}
                          className="material-symbols-outlined text-primary text-lg"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          favorite
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <BottomNavBar />
    </div>
  )
}

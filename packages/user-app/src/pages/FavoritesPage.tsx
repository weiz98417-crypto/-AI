import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const [tab, setTab] = useState<'favorites' | 'history'>('favorites')

  const favOutfits = state.outfits.filter((o) => state.favorites.includes(o.id))
  const historyOutfits = state.browsingHistory
    .map((e) => state.outfits.find((o) => o.id === e.outfitId))
    .filter(Boolean) as NonNullable<typeof state.outfits[number]>[]

  const items = tab === 'favorites' ? favOutfits : historyOutfits

  return (
    <>
      {/* Tab toggle */}
      <div className="flex bg-surface-container-low rounded-full p-1 mx-3 mb-4">
        <button
          onClick={() => setTab('favorites')}
          className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all ${
            tab === 'favorites' ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-secondary'
          }`}
        >Favorites</button>
        <button
          onClick={() => setTab('history')}
          className={`flex-1 py-2 rounded-full text-xs font-semibold transition-all ${
            tab === 'history' ? 'bg-primary-container text-on-primary-container shadow-sm' : 'text-secondary'
          }`}
        >History</button>
      </div>

      {/* Stats */}
      <div className="px-3 mb-4">
        <p className="text-xs text-secondary">{tab === 'favorites' ? 'Saved Items' : 'Recently Viewed'}</p>
        <p className="text-lg font-bold text-on-surface">{items.length} {tab === 'favorites' ? 'curated outfits' : 'items viewed'}</p>
      </div>

      {/* Content */}
      {items.length === 0 ? (
        <div className="text-center py-20 px-3">
          <span className="text-5xl">
            {tab === 'favorites' ? '🤍' : '🕐'}
          </span>
          <p className="text-sm text-on-surface-variant mb-4">
            {tab === 'favorites' ? '还没有收藏任何穿搭' : '暂无浏览记录'}
          </p>
          <button onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-primary text-on-primary rounded-full text-xs font-semibold active:scale-95">
            去逛逛
          </button>
        </div>
      ) : (
        <div className="px-3 flex flex-col gap-3">
          {items.map((outfit) => {
            const entry = state.browsingHistory.find((e) => e.outfitId === outfit.id)
            return (
              <div key={outfit.id}
                className="bg-surface-container-lowest rounded-xl p-4 flex gap-4 border border-outline-variant/50 shadow-sm active:opacity-80 cursor-pointer"
                onClick={() => navigate(`/recommend/${outfit.occasion}`)}
              >
                <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={outfit.coverImage} alt={outfit.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                      {outfit.brandSummary.split('+')[0].trim()}
                    </span>
                    <h3 className="text-sm text-on-surface mt-1 truncate">{outfit.name}</h3>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-on-surface">¥{outfit.totalPrice.toLocaleString()}</span>
                    <div className="flex items-center gap-2">
                      {tab === 'history' && entry && (
                        <span className="text-xs text-tertiary">{new Date(entry.viewedAt).toLocaleDateString('zh-CN')}</span>
                      )}
                      {tab === 'favorites' && (
                        <button onClick={(e) => {
                          e.stopPropagation()
                          dispatch({ type: 'TOGGLE_FAVORITE', outfitId: outfit.id })
                        }} className="text-primary text-lg">❤️</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

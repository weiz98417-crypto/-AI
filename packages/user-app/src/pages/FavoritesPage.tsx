import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'

export default function FavoritesPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()

  const favOutfits = state.outfits.filter((o) => state.favorites.includes(o.id))
  const historyOutfits = state.browsingHistory
    .map((e) => state.outfits.find((o) => o.id === e.outfitId))
    .filter(Boolean)

  return (
    <div className="max-w-md mx-auto px-4 py-8 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="material-symbols-outlined text-on-surface">
          arrow_back
        </button>
        <h1 className="text-xl font-bold">收藏与历史</h1>
      </div>

      {/* Favorites */}
      <section className="mb-8">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">favorite</span>
          我的收藏
        </h2>
        {favOutfits.length === 0 ? (
          <div className="text-center py-12 bg-surface-container rounded-2xl">
            <span className="material-symbols-outlined text-6xl text-outline mb-4">favorite_border</span>
            <p className="text-on-surface-variant mb-4">还没有收藏任何穿搭</p>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-2.5 bg-primary text-on-primary rounded-full font-medium active:scale-95"
            >
              去逛逛
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {favOutfits.map((outfit) => (
              <div
                key={outfit.id}
                className="flex gap-3 bg-surface-container rounded-xl p-3 items-center"
                onClick={() => navigate(`/recommend/${outfit.occasion}`)}
              >
                <div className="w-16 h-20 rounded-lg bg-secondary-container flex items-center justify-center shrink-0 overflow-hidden">
                  <img src={outfit.coverImage} alt={outfit.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{outfit.name}</p>
                  <p className="text-xs text-on-surface-variant">¥{outfit.totalPrice}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    dispatch({ type: 'TOGGLE_FAVORITE', outfitId: outfit.id })
                  }}
                  className="material-symbols-outlined text-primary"
                  style={{ fontVariationSettings: "'FILL' 1, 'wght' 400" }}
                >
                  favorite
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Browsing History */}
      <section>
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant">history</span>
          浏览历史
        </h2>
        {historyOutfits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-on-surface-variant">暂无浏览记录</p>
          </div>
        ) : (
          <div className="relative pl-6 border-l-2 border-outline-variant space-y-4">
            {historyOutfits.map((outfit, idx) => {
              if (!outfit) return null
              const entry = state.browsingHistory[idx]
              return (
                <div
                  key={outfit.id}
                  className="relative cursor-pointer"
                  onClick={() => navigate(`/recommend/${outfit.occasion}`)}
                >
                  <div className="absolute -left-[25px] top-2 w-3 h-3 rounded-full bg-primary" />
                  <p className="text-xs text-on-surface-variant mb-1">
                    {entry ? new Date(entry.viewedAt).toLocaleString('zh-CN') : ''}
                  </p>
                  <div className="bg-surface-container rounded-xl p-3">
                    <p className="font-semibold text-sm">{outfit.name}</p>
                    <p className="text-xs text-on-surface-variant">¥{outfit.totalPrice}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}

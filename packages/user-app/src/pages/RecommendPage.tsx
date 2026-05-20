import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PRICE_RANGE_MAP } from '@ggai/shared/types'
import type { Outfit } from '@ggai/shared/types'
import { useApp } from '../store/AppContext'

export default function RecommendPage() {
  const { occasion } = useParams<{ occasion: string }>()
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const [priceFilter, setPriceFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const currentOccasion = state.occasions.find((o) => o.id === occasion)

  const filteredOutfits = useMemo(() => {
    let list = state.outfits.filter((o) => o.occasion === occasion)
    if (priceFilter !== 'all') {
      const range = PRICE_RANGE_MAP[priceFilter as keyof typeof PRICE_RANGE_MAP]?.range || [0, Infinity]
      list = list.filter((o) => o.totalPrice >= range[0] && o.totalPrice <= range[1])
    }
    return list
  }, [state.outfits, occasion, priceFilter])

  const handleOutfitClick = (outfit: Outfit) => {
    setExpandedId(expandedId === outfit.id ? null : outfit.id)
    dispatch({ type: 'ADD_HISTORY', entry: { outfitId: outfit.id, viewedAt: Date.now() } })
  }

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-background flex items-center justify-between px-3 h-12">
        <button onClick={() => navigate('/')} className="active:opacity-70">
          <span className="material-symbols-outlined text-primary">arrow_back_ios</span>
        </button>
        <h1 className="text-lg font-bold text-on-surface">{currentOccasion?.name || '穿搭推荐'}</h1>
        <div className="w-6" />
      </header>

      <main className="pt-14 px-3">
        {/* Occasion filter pills + Price filter */}
        <div className="sticky top-12 z-40 bg-background py-2 -mx-3 px-3">
          <div className="flex items-center justify-between">
            <div className="flex overflow-x-auto hide-scrollbar gap-2 flex-1 pr-4">
              {state.occasions.map((o) => (
                <button
                  key={o.id}
                  onClick={() => navigate(`/recommend/${o.id}`)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-[11px] font-semibold transition-colors ${
                    o.id === occasion ? 'bg-primary text-on-primary shadow-sm' : 'bg-surface-container-low text-secondary'
                  }`}
                >
                  {o.name}
                </button>
              ))}
            </div>
            <div className="flex-shrink-0 relative">
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="appearance-none bg-surface-container-lowest border border-outline-variant px-3 py-1.5 rounded-lg text-[11px] text-on-surface-variant pr-7"
              >
                <option value="all">Price</option>
                <option value="budget">¥200↓</option>
                <option value="mid">¥200-500</option>
                <option value="premium">¥500-1000</option>
                <option value="luxury">¥1000+</option>
              </select>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>

        {/* Outfit Cards */}
        <div className="mt-4 flex flex-col gap-6">
          {filteredOutfits.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-outline mb-4">checkroom</span>
              <p className="text-on-surface-variant">该场合暂无推荐方案</p>
            </div>
          ) : (
            filteredOutfits.map((outfit) => {
              const isFav = state.favorites.includes(outfit.id)
              const isExpanded = expandedId === outfit.id
              return (
                <div key={outfit.id} className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant shadow-sm">
                  {/* Main Image */}
                  <div className="relative aspect-[3/4] bg-surface-variant" onClick={() => handleOutfitClick(outfit)}>
                    <img src={outfit.coverImage} alt={outfit.name} className="w-full h-full object-cover" />
                    <button
                      onClick={(e) => { e.stopPropagation(); dispatch({ type: 'TOGGLE_FAVORITE', outfitId: outfit.id }) }}
                      className={`absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-sm active:scale-95 transition-transform ${isFav ? 'text-primary' : 'text-secondary'}`}
                    >
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: `'FILL' ${isFav ? 1 : 0}` }}>
                        favorite
                      </span>
                    </button>
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                      {PRICE_RANGE_MAP[outfit.priceRange]?.label}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-on-surface">{outfit.name}</h3>
                        <p className="text-[13px] text-secondary">{outfit.brandSummary}</p>
                      </div>
                      <p className="text-lg font-bold text-primary">¥{outfit.totalPrice}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/share/${outfit.id}`)}
                        className="flex-1 py-3 bg-primary text-on-primary rounded-lg text-xs font-semibold active:opacity-80"
                      >
                        Share
                      </button>
                      <button
                        onClick={() => handleOutfitClick(outfit)}
                        className="flex-1 py-3 bg-surface-container text-on-surface rounded-lg text-xs font-semibold active:opacity-80"
                      >
                        {isExpanded ? 'Hide' : 'Details'}
                      </button>
                    </div>

                    {/* Expanded items */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-outline-variant">
                        <h4 className="font-semibold text-sm mb-3">搭配单品</h4>
                        <div className="space-y-2">
                          {outfit.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate">{item.name}</p>
                                <p className="text-xs text-on-surface-variant">{item.brand} · ¥{item.price}</p>
                              </div>
                              <span className="text-xs text-on-surface-variant capitalize">{item.category}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}

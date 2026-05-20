import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PRICE_RANGE_MAP } from '@ggai/shared/types'
import { useApp } from '../store/AppContext'
import TopAppBar from '../components/TopAppBar'
import BottomNavBar from '../components/BottomNavBar'

const PRICE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'budget', label: '¥200↓' },
  { value: 'mid', label: '¥200-500' },
  { value: 'premium', label: '¥500-1000' },
  { value: 'luxury', label: '¥1000+' },
]

export default function RecommendPage() {
  const { occasion } = useParams<{ occasion: string }>()
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const [priceFilter, setPriceFilter] = useState('all')

  const currentOccasion = state.occasions.find((o) => o.id === occasion)

  const filteredOutfits = useMemo(() => {
    let list = state.outfits.filter((o) => o.occasion === occasion)
    if (priceFilter !== 'all') {
      const range = PRICE_RANGE_MAP[priceFilter as keyof typeof PRICE_RANGE_MAP]?.range || [0, Infinity]
      list = list.filter((o) => o.totalPrice >= range[0] && o.totalPrice <= range[1])
    }
    return list
  }, [state.outfits, occasion, priceFilter])

  const handleFavorite = (id: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', outfitId: id })
    dispatch({ type: 'ADD_HISTORY', entry: { outfitId: id, viewedAt: Date.now() } })
  }

  return (
    <div className="min-h-screen bg-background text-on-surface pb-20">
      <TopAppBar
        title={currentOccasion?.name || '穿搭推荐'}
        showBack
        rightAction={
          <button onClick={() => navigate(`/share/${filteredOutfits[0]?.id}`)} className="active:opacity-70">
            <span className="material-symbols-outlined text-primary">share</span>
          </button>
        }
      />

      <main className="pt-12 px-3">
        {/* Occasion Filter Pills + Price Dropdown */}
        <div className="sticky top-12 z-40 bg-background py-2 -mx-3 px-3">
          <div className="flex items-center justify-between">
            <div className="flex overflow-x-auto hide-scrollbar gap-2 flex-grow pr-4">
              {state.occasions.map((o) => (
                <button
                  key={o.id}
                  onClick={() => navigate(`/recommend/${o.id}`)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                    o.id === occasion
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-container-low text-secondary active:opacity-70'
                  }`}
                  style={{ fontSize: '11px', lineHeight: '14px', fontWeight: 600 }}
                >
                  {o.name}
                </button>
              ))}
            </div>
            <div className="flex-shrink-0 relative group">
              <select
                value={priceFilter}
                onChange={(e) => setPriceFilter(e.target.value)}
                className="appearance-none bg-surface-container-lowest border border-outline-variant px-3 py-1.5 rounded-lg text-xs text-on-surface-variant pr-7 focus:outline-none"
                style={{ fontSize: '11px', lineHeight: '14px' }}
              >
                <option value="all">Price</option>
                {PRICE_OPTIONS.filter(o => o.value !== 'all').map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                expand_more
              </span>
            </div>
          </div>
        </div>

        {/* Outfit Cards */}
        <div className="mt-4 flex flex-col gap-6">
          {filteredOutfits.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-6xl text-outline mb-4">sentiment_neutral</span>
              <p className="text-sm text-on-surface-variant">该场合暂无推荐方案</p>
            </div>
          ) : (
            filteredOutfits.map((outfit) => {
              const isFav = state.favorites.includes(outfit.id)
              return (
                <div key={outfit.id} className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant shadow-sm flex flex-col">
                  <div className="relative aspect-[3/4] w-full bg-surface-variant">
                    <img src={outfit.coverImage} alt={outfit.name} className="w-full h-full object-cover" />
                    <button
                      onClick={() => handleFavorite(outfit.id)}
                      className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                      style={{ color: isFav ? '#874c63' : '#605e5e' }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: `'FILL' ${isFav ? 1 : 0}, 'wght' 400` }}
                      >
                        favorite
                      </span>
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-bold text-on-surface" style={{ fontSize: '18px', lineHeight: '24px', fontWeight: 700 }}>
                          {outfit.name}
                        </h3>
                        <p className="text-xs text-secondary" style={{ fontSize: '13px', lineHeight: '18px' }}>
                          {outfit.brandSummary}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-primary" style={{ fontSize: '18px', lineHeight: '24px', fontWeight: 700 }}>
                        ¥{outfit.totalPrice}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        handleFavorite(outfit.id)
                        navigate(`/share/${outfit.id}`)
                      }}
                      className="w-full bg-primary text-on-primary py-3 rounded-lg text-xs font-semibold active:opacity-80 transition-opacity"
                      style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </main>

      <BottomNavBar />
    </div>
  )
}

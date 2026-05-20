import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PRICE_RANGE_MAP } from '@ggai/shared/types'
import type { Outfit } from '@ggai/shared/types'
import { useApp } from '../store/AppContext'
import OccasionCard from '../components/OccasionCard'
import OutfitCard from '../components/OutfitCard'

export default function RecommendPage() {
  const { occasion } = useParams<{ occasion: string }>()
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const [priceFilter, setPriceFilter] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const currentIdx = state.occasions.findIndex((o) => o.id === occasion)

  const filteredOutfits = useMemo(() => {
    let list = state.outfits.filter((o) => o.occasion === occasion)
    if (priceFilter !== 'all') {
      const [min, max] = PRICE_RANGE_MAP[priceFilter as keyof typeof PRICE_RANGE_MAP]?.range || [0, Infinity]
      list = list.filter((o) => o.totalPrice >= min && o.totalPrice <= max)
    }
    return list
  }, [state.outfits, occasion, priceFilter])

  const handleOccasionSwitch = (id: string) => {
    navigate(`/recommend/${id}`)
  }

  const handleOutfitClick = (outfit: Outfit) => {
    setExpandedId(expandedId === outfit.id ? null : outfit.id)
    dispatch({ type: 'ADD_HISTORY', entry: { outfitId: outfit.id, viewedAt: Date.now() } })
  }

  const priceOptions = [
    { value: 'all', label: '全部' },
    { value: 'budget', label: '¥200以下' },
    { value: 'mid', label: '¥200-500' },
    { value: 'premium', label: '¥500-1000' },
    { value: 'luxury', label: '¥1000+' },
  ]

  return (
    <div className="max-w-md mx-auto px-4 py-8 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/')} className="material-symbols-outlined text-on-surface">
          arrow_back
        </button>
        <h1 className="text-xl font-bold">穿搭推荐</h1>
      </div>

      {/* Occasion horizontal scroll */}
      <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2 mb-6 snap-x snap-mandatory">
        {state.occasions.map((o) => (
          <div key={o.id} className="snap-start min-w-[120px]">
            <OccasionCard occasion={o} onClick={() => handleOccasionSwitch(o.id)} active={o.id === occasion} />
          </div>
        ))}
      </div>

      {/* Price filter */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6">
        {priceOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setPriceFilter(opt.value)}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
              priceFilter === opt.value
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Outfit list */}
      {filteredOutfits.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">sentiment_neutral</span>
          <p className="text-on-surface-variant">该场合暂无推荐方案</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filteredOutfits.map((outfit) => (
            <OutfitCard
              key={outfit.id}
              outfit={outfit}
              isFavorited={state.favorites.includes(outfit.id)}
              isExpanded={expandedId === outfit.id}
              onClick={() => handleOutfitClick(outfit)}
              onFavorite={() => dispatch({ type: 'TOGGLE_FAVORITE', outfitId: outfit.id })}
              onShare={() => navigate(`/share/${outfit.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

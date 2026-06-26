import { useState } from 'react'
import type { Outfit } from '@ggai/shared/types'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { IconHeart, IconDress } from './Icons'

interface Props {
  outfit: Outfit
  story?: string
}

export default function OutfitCardInline({ outfit, story }: Props) {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const isFav = state.favorites.includes(outfit.id)
  const [expanded, setExpanded] = useState(false)
  const [imgError, setImgError] = useState(false)

  const toggleFav = () => dispatch({ type: 'TOGGLE_FAVORITE', outfitId: outfit.id })

  return (
    <div className="bg-surface rounded-2xl border border-outline-variant/20 overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all">
      <div className="flex gap-4 p-4">
        {/* Cover */}
        <div className="w-20 h-28 rounded-xl bg-surface-container overflow-hidden shrink-0 border border-outline-variant/20">
          {!imgError ? (
            <img
              src={outfit.coverImage}
              alt={outfit.name}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-container/30 to-surface-container flex items-center justify-center text-primary/40"><IconDress size={28} /></div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h4 className="text-sm font-bold text-on-surface truncate">{outfit.name}</h4>
            <button onClick={toggleFav} className={`text-lg shrink-0 ml-2 transition-all active:scale-125 ${isFav ? 'scale-110' : ''}`}>
              <IconHeart size={18} filled={isFav} className={isFav ? 'text-red-400' : 'text-outline-variant'} />
            </button>
          </div>

          <p className="text-[10px] text-outline mt-0.5">{outfit.brandSummary}</p>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-base font-bold text-primary">¥{outfit.totalPrice}</span>
            <span className="text-[10px] bg-surface-container px-1.5 py-0.5 rounded-full text-outline">{outfit.priceRange}</span>
          </div>

          {/* Story */}
          {story && (
            <p className="text-[11px] text-secondary mt-1.5 italic leading-relaxed line-clamp-2">
              "{story}"
            </p>
          )}

          {/* Style tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {outfit.styleTags.map(t => (
              <span key={t} className="text-[10px] bg-primary/5 text-primary px-2 py-0.5 rounded-full font-medium">{t}</span>
            ))}
          </div>

          {/* Expand for details */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[10px] text-primary font-semibold mt-1.5 hover:underline"
          >
            {expanded ? '收起详情' : '查看单品详情'}
          </button>

          {expanded && (
            <div className="mt-2 space-y-1 bg-surface-container-low rounded-xl p-3">
              {outfit.items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs">
                  <span className="text-on-surface font-medium">{item.brand} {item.name}</span>
                  <span className="text-primary font-semibold">¥{item.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex border-t border-outline-variant/10">
        <button
          onClick={() => navigate(`/recommend/${outfit.occasion}`)}
          className="flex-1 py-2.5 text-xs font-semibold text-secondary hover:text-primary hover:bg-primary/5 transition-colors"
        >查看相似</button>
        <button
          onClick={() => navigate(`/share/${outfit.id}`)}
          className="flex-1 py-2.5 text-xs font-semibold text-secondary hover:text-primary hover:bg-primary/5 transition-colors border-l border-outline-variant/10"
        >分享穿搭</button>
      </div>
    </div>
  )
}

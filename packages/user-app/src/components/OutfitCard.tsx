import type { Outfit } from '@ggai/shared/types'
import { PRICE_RANGE_MAP } from '@ggai/shared/types'

interface Props {
  outfit: Outfit
  isFavorited: boolean
  isExpanded: boolean
  onClick: () => void
  onFavorite: () => void
  onShare: () => void
}

export default function OutfitCard({ outfit, isFavorited, isExpanded, onClick, onFavorite, onShare }: Props) {
  return (
    <div className="bg-surface-container rounded-2xl overflow-hidden shadow-sm">
      {/* Cover image area */}
      <div className="aspect-[3/4] bg-secondary-container flex items-center justify-center relative overflow-hidden" onClick={onClick}>
        <img src={outfit.coverImage} alt={outfit.name} className="w-full h-full object-cover" />
        <span className="absolute top-3 right-3 bg-surface/80 backdrop-blur-sm text-xs px-2 py-1 rounded-full">
          {PRICE_RANGE_MAP[outfit.priceRange]?.label}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-base">{outfit.name}</h3>
            <p className="text-sm text-on-surface-variant">{outfit.brandSummary}</p>
            <p className="text-primary font-bold mt-1">¥{outfit.totalPrice}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => { e.stopPropagation(); onFavorite() }}
              className={`material-symbols-outlined text-2xl ${
                isFavorited ? 'text-primary' : 'text-outline'
              }`}
              style={{ fontVariationSettings: `'FILL' ${isFavorited ? 1 : 0}, 'wght' 400` }}
            >
              favorite
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onShare() }}
              className="material-symbols-outlined text-2xl text-outline"
            >
              share
            </button>
          </div>
        </div>
      </div>

      {/* Expanded details */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-outline-variant pt-3">
          <h4 className="font-semibold text-sm mb-2">搭配单品</h4>
          <div className="space-y-2">
            {outfit.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-on-surface-variant">{item.brand} - ¥{item.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t border-outline-variant">
            <div className="flex flex-wrap gap-1">
              {outfit.styleTags.map((tag) => (
                <span key={tag} className="text-xs bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

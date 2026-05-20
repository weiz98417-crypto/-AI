import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import OccasionCard from '../components/OccasionCard'

export default function HomePage() {
  const navigate = useNavigate()
  const { state } = useApp()

  if (state.loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">逛逛AI</h1>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface-container rounded-xl h-36 animate-pulse" />
          ))}
        </div>
        <div className="h-6 w-32 bg-surface-container rounded animate-pulse mb-4" />
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div key={i} className="min-w-[160px] h-48 bg-surface-container rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (state.occasions.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">逛逛AI</h1>
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">checkroom</span>
          <p className="text-on-surface-variant">暂无推荐</p>
        </div>
      </div>
    )
  }

  const recommendedOutfits = state.outfits.slice(0, 5)

  return (
    <div className="max-w-md mx-auto px-4 py-8 pb-24">
      <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
        逛逛AI
      </h1>
      <p className="text-on-surface-variant text-sm mb-6">AI帮你搭，每天不重样</p>

      <h2 className="text-lg font-semibold mb-3">选择场合</h2>
      <div className="grid grid-cols-2 gap-3 mb-8">
        {state.occasions.map((o) => (
          <OccasionCard key={o.id} occasion={o} onClick={() => navigate(`/recommend/${o.id}`)} />
        ))}
      </div>

      <h2 className="text-lg font-semibold mb-3">今日推荐</h2>
      <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
        {recommendedOutfits.map((outfit) => (
          <div
            key={outfit.id}
            className="min-w-[160px] bg-surface-container rounded-xl overflow-hidden shadow-sm cursor-pointer active:scale-95 transition-transform"
            onClick={() => navigate(`/recommend/${outfit.occasion}`)}
          >
            <div className="aspect-[3/4] bg-secondary-container flex items-center justify-center overflow-hidden">
              <img src={outfit.coverImage} alt={outfit.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <p className="font-semibold text-sm truncate">{outfit.name}</p>
              <p className="text-xs text-on-surface-variant">¥{outfit.totalPrice}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

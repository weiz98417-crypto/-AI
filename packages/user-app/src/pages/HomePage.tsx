import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { outfitImages } from '../assets/images'
import TopAppBar from '../components/TopAppBar'
import SearchBar from '../components/SearchBar'
import BottomNavBar from '../components/BottomNavBar'

export default function HomePage() {
  const navigate = useNavigate()
  const { state } = useApp()

  if (state.loading) {
    return (
      <div className="min-h-screen bg-background">
        <TopAppBar title="GuangGuangAI" showBack={false} />
        <main className="pt-16 px-3 pb-24">
          <div className="mb-6"><SearchBar /></div>
          <div className="flex gap-3 overflow-x-auto hide-scrollbar px-0 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-shrink-0 w-40 h-56 rounded-xl bg-surface-container animate-pulse" />
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 flex animate-pulse">
                <div className="w-1/3 aspect-[3/4] bg-surface-container" />
                <div className="w-2/3 p-4 flex flex-col justify-between">
                  <div><div className="h-3 w-24 bg-surface-container rounded mb-2" /><div className="h-4 w-40 bg-surface-container rounded" /></div>
                  <div className="h-10 bg-surface-container rounded-lg" />
                </div>
              </div>
            ))}
          </div>
        </main>
        <BottomNavBar />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      <TopAppBar title="GuangGuangAI" showBack={false} />

      <main className="pt-14 pb-24">
        {/* Search Bar */}
        <section className="px-3 mb-6">
          <SearchBar />
        </section>

        {/* Occasion Quick Pick */}
        <section className="mb-6">
          <div className="px-3 flex justify-between items-end mb-2">
            <h2 className="text-xl font-bold text-on-surface" style={{ fontSize: '20px', lineHeight: '28px', letterSpacing: '-0.01em' }}>
              Occasion Quick Pick
            </h2>
            <span className="text-xs font-semibold text-primary" style={{ fontSize: '12px', lineHeight: '16px' }}>
              View All
            </span>
          </div>
          <div className="flex overflow-x-auto hide-scrollbar gap-3 px-3">
            {state.occasions.map((o) => (
              <div key={o.id} className="flex-shrink-0 w-40">
                <button
                  onClick={() => navigate(`/recommend/${o.id}`)}
                  className="relative h-56 rounded-xl overflow-hidden mb-2 w-full active:scale-[0.98] transition-transform"
                >
                  <img src={outfitImages[`${o.id}-card`]} alt={o.name} className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-xs font-semibold text-white" style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}>
                      {o.name}
                    </p>
                  </div>
                </button>
                <p className="text-xs text-on-surface-variant px-0.5" style={{ fontSize: '13px', lineHeight: '18px' }}>
                  {o.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Today's Picks */}
        <section className="px-3">
          <h2 className="text-xl font-bold text-on-surface mb-4" style={{ fontSize: '20px', lineHeight: '28px', letterSpacing: '-0.01em' }}>
            Today's Picks
          </h2>
          <div className="space-y-4">
            {state.outfits.slice(0, 4).map((outfit) => (
              <div
                key={outfit.id}
                className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm flex"
              >
                <div className="w-1/3 aspect-[3/4]">
                  <img
                    src={outfit.coverImage}
                    alt={outfit.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-2/3 p-4 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-xs font-semibold text-on-surface" style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}>
                        {outfit.name}
                      </h3>
                      <span
                        className="material-symbols-outlined text-primary text-lg"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        favorite
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mb-2" style={{ fontSize: '13px', lineHeight: '18px' }}>
                      {outfit.brandSummary}
                    </p>
                    <div className="flex gap-2">
                      {outfit.styleTags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded">
                          {tag.toUpperCase()}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/recommend/${outfit.occasion}`)}
                    className="w-full py-2 bg-primary text-white text-xs font-semibold rounded-lg active:opacity-70 transition-opacity"
                    style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <BottomNavBar />
    </div>
  )
}

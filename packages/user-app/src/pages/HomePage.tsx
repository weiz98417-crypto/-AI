import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { outfitImages } from '../assets/images'
import SearchBar from '../components/SearchBar'

export default function HomePage() {
  const navigate = useNavigate()
  const { state } = useApp()

  return (
    <>
      {/* Search */}
      <section className="px-3 mb-5">
        <SearchBar />
      </section>

      {/* Occasion Quick Pick */}
      <section className="mb-5">
        <div className="px-3 flex justify-between items-end mb-2">
          <h2 className="text-xl font-bold text-on-surface">Occasion Quick Pick</h2>
          <span className="text-xs font-semibold text-primary">View All</span>
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
                  <p className="text-xs font-semibold text-white">{o.name}</p>
                </div>
              </button>
              <p className="text-[13px] text-on-surface-variant leading-[18px] px-0.5">{o.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Today's Picks */}
      <section className="px-3">
        <h2 className="text-xl font-bold text-on-surface mb-4">Today's Picks</h2>
        <div className="space-y-4">
          {state.outfits.slice(0, 5).map((outfit) => (
            <div key={outfit.id}
              className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 overflow-hidden shadow-sm flex active:opacity-80 cursor-pointer"
              onClick={() => navigate(`/recommend/${outfit.occasion}`)}
            >
              <div className="w-[33%] aspect-[3/4]">
                <img src={outfit.coverImage} alt={outfit.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-xs font-semibold text-on-surface">{outfit.name}</h3>
                  </div>
                  <p className="text-[13px] text-on-surface-variant mb-2">{outfit.brandSummary}</p>
                  <div className="flex gap-2">
                    {outfit.styleTags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="text-sm font-bold text-primary mt-2">¥{outfit.totalPrice}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}

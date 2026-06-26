import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { outfitImages } from '../assets/images'
import SearchBar from '../components/SearchBar'
import AiChat from '../components/AiChat'

export default function HomePage() {
  const navigate = useNavigate()
  const { state } = useApp()
  const [showAiChat, setShowAiChat] = useState(false)

  return (
    <>
      {/* Search */}
      <section className="px-3 mb-5">
        <SearchBar />
      </section>

      {/* Occasion Quick Pick */}
      <section className="mb-5">
        <div className="px-3 flex justify-between items-end mb-2">
          <h2 className="text-[20px] font-bold text-on-surface">Occasion Quick Pick</h2>
          <span className="text-xs font-semibold text-primary hover:underline cursor-pointer">View All</span>
        </div>
        <div className="flex overflow-x-auto hide-scrollbar gap-3 px-3">
          {state.occasions.map((o, idx) => (
            <div key={o.id} className="flex-shrink-0 w-40" style={{ animation: `fadeInUp 0.4s ease-out ${idx * 0.1}s both` }}>
              <button
                onClick={() => navigate(`/recommend/${o.id}`)}
                className="relative h-56 rounded-xl overflow-hidden mb-2 w-full active:scale-[0.98] transition-all duration-300 shadow-sm hover:shadow-lg group img-zoom"
              >
                <img src={outfitImages[`${o.id}-card`]} alt={o.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-all group-hover:from-black/70">
                  <p className="text-xs font-semibold text-white">{o.name}</p>
                </div>
              </button>
              <p className="text-[13px] text-on-surface-variant leading-[18px] px-0.5">{o.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI Curated Picks — now a real chat prompt */}
      <section className="px-3 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-[20px] font-bold text-on-surface">AI Curated For You</h2>
          <span className="text-sm animate-sparkle inline-block">✨</span>
        </div>
        <button
          onClick={() => setShowAiChat(true)}
          className="w-full bg-gradient-to-r from-primary/5 via-primary-container/20 to-primary/5 border border-primary/20 rounded-2xl p-6 text-center hover:border-primary/40 hover:shadow-md hover:shadow-primary/10 transition-all group animate-fade-in-up"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-3 text-2xl group-hover:scale-110 transition-transform">
            🤖
          </div>
          <h3 className="text-base font-bold text-on-surface mb-1">让AI帮你搭配今天的穿搭</h3>
          <p className="text-xs text-secondary">告诉我你的场合和偏好，我来为你量身推荐</p>
          <div className="flex justify-center gap-2 mt-3">
            {['上班通勤', '周末约会', '客户会议', '闺蜜聚会'].map(t => (
              <span key={t} className="px-3 py-1 text-[10px] bg-surface-container border border-outline-variant/20 rounded-full text-secondary group-hover:border-primary/30 transition-colors">{t}</span>
            ))}
          </div>
        </button>
      </section>

      {/* Floating AI Button */}
      {!showAiChat && (
        <button
          onClick={() => setShowAiChat(true)}
          className="fixed bottom-20 right-4 z-40 w-14 h-14 rounded-2xl bg-primary text-white shadow-lg shadow-primary/30 flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all animate-float"
          style={{ boxShadow: '0 4px 20px rgba(135, 76, 99, 0.3)' }}
        >
          ✨
        </button>
      )}

      {/* AI Chat Modal */}
      {showAiChat && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setShowAiChat(false)}>
          <div
            className="bg-surface w-full sm:max-w-md sm:rounded-3xl shadow-2xl border border-outline-variant/20 overflow-hidden"
            style={{ height: '85vh', maxHeight: '700px' }}
            onClick={e => e.stopPropagation()}
          >
            <AiChat onClose={() => setShowAiChat(false)} />
          </div>
        </div>
      )}
    </>
  )
}

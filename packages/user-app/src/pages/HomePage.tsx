import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { outfitImages } from '../assets/images'
import { aiRecommend, getAiThinkingPhrases } from '../store/aiEngine'
import { getAiOutfitRecommendation } from '../store/deepseek'
import SearchBar from '../components/SearchBar'

export default function HomePage() {
  const navigate = useNavigate()
  const { state } = useApp()
  const [aiThinking, setAiThinking] = useState(true)
  const [thinkStep, setThinkStep] = useState(0)
  const [aiPicks, setAiPicks] = useState<ReturnType<typeof aiRecommend>>([])
  const [aiAdvice, setAiAdvice] = useState('')

  const phrases = getAiThinkingPhrases()

  useEffect(() => {
    if (!state.loading) {
      // Simulate AI thinking steps
      const timer = setInterval(() => {
        setThinkStep((s) => {
          if (s >= phrases.length) {
            clearInterval(timer)
            // Generate AI picks
            const picks = aiRecommend(state.outfits, 'work-commute', state.preferences, 3)
            setAiPicks(picks)
            setAiThinking(false)
            // Call DeepSeek for real AI advice
            getAiOutfitRecommendation('work-commute', state.preferences, state.outfits.filter(o => o.occasion === 'work-commute'))
              .then(setAiAdvice)
              .catch(() => setAiAdvice(''))
            return s
          }
          return s + 1
        })
      }, 600)
      return () => clearInterval(timer)
    }
  }, [state.loading, state.outfits, state.preferences])

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

      {/* AI Curated Picks */}
      <section className="px-3">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-[20px] font-bold text-on-surface">AI Curated For You</h2>
          <span className="text-sm">🤖</span>
        </div>

        {aiThinking ? (
          <div className="bg-surface-container-lowest rounded-2xl border border-primary/20 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center animate-pulse text-lg">🤖</div>
              <div>
                <p className="text-sm font-semibold text-primary">AI Engine Running</p>
                <p className="text-xs text-on-surface-variant">{phrases[thinkStep] || 'Generating...'}</p>
              </div>
            </div>
            <div className="space-y-2">
              {phrases.slice(0, thinkStep + 1).map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-on-surface-variant">
                  <span className="text-primary">✓</span>
                  <span className={i === thinkStep ? 'animate-pulse font-semibold text-on-surface' : ''}>{p}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {aiPicks.map(({ outfit, score }) => {
              const barColor = score >= 90 ? 'bg-green-500' : score >= 80 ? 'bg-primary' : 'bg-yellow-500'
              return (
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
                        <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">AI</span>
                      </div>
                      <p className="text-[13px] text-on-surface-variant mb-2">{outfit.brandSummary}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-1.5 bg-surface-container rounded-full overflow-hidden">
                          <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${score}%` }} />
                        </div>
                        <span className="text-[11px] font-bold text-on-surface-variant">{score}%</span>
                      </div>
                      <p className="text-sm font-bold text-primary">¥{outfit.totalPrice}</p>
                    </div>
                  </div>
                </div>
              )
            })}
            {aiAdvice && (
              <div className="mt-4 bg-primary-fixed/30 border border-primary/20 rounded-xl p-4">
                <p className="text-xs font-semibold text-primary mb-1">🤖 DeepSeek AI 推荐语</p>
                <p className="text-sm text-on-surface leading-relaxed whitespace-pre-line">{aiAdvice}</p>
              </div>
            )}
          </div>
        )}
      </section>
    </>
  )
}

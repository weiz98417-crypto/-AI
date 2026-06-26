import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import { Search } from './Icons'

export default function SearchBar() {
  const { state } = useApp()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const q = query.toLowerCase().trim()
  const matched = q ? state.outfits.filter(o =>
    o.name.toLowerCase().includes(q) ||
    o.styleTags.some(t => t.toLowerCase().includes(q)) ||
    o.brandSummary.toLowerCase().includes(q) ||
    o.items.some(i => i.brand.toLowerCase().includes(q) || i.name.toLowerCase().includes(q))
  ).slice(0, 8) : []

  const occasionLabels: Record<string, string> = {
    'work-commute': '上班通勤',
    'client-meeting': '客户会议',
    'weekend-date': '周末约会',
    'girls-gathering': '闺蜜聚会',
  }

  return (
    <div className="relative flex items-center" ref={ref}>
      <span className="absolute left-4 text-on-surface-variant"><Search size={16} /></span>
      <input
        className="w-full h-12 pl-12 pr-4 bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-sm text-on-surface-variant"
        placeholder="Find your style for today..."
        type="text"
        value={query}
        onChange={e => { setQuery(e.target.value); setOpen(true) }}
        onFocus={() => query && setOpen(true)}
      />

      {open && query && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-surface rounded-2xl border border-outline-variant/20 shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
          {matched.length === 0 ? (
            <div className="p-4 text-center text-sm text-secondary">未找到匹配的穿搭</div>
          ) : (
            matched.map(o => (
              <button
                key={o.id}
                onClick={() => { navigate(`/recommend/${o.occasion}`); setOpen(false); setQuery('') }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-container-low transition-colors text-left"
              >
                <div className="w-12 h-16 rounded-lg bg-surface-container overflow-hidden shrink-0 border border-outline-variant/20">
                  <img src={o.coverImage} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-on-surface truncate">{o.name}</p>
                  <p className="text-[10px] text-secondary truncate">{o.brandSummary}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-primary">¥{o.totalPrice}</p>
                  <p className="text-[10px] text-outline">{occasionLabels[o.occasion] || o.occasion}</p>
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

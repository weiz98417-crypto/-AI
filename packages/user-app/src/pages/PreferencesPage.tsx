import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import type { UserPreferences } from '@ggai/shared/types'

const COLOR_SWATCHES = [
  { name: '腮红粉', hex: '#E8A0B9' }, { name: '炭灰色', hex: '#2D2D2D' },
  { name: '沙色', hex: '#F5F0F0' }, { name: '紫红', hex: '#874C63' },
  { name: '纯白', hex: '#FFFFFF' }, { name: '灰绿', hex: '#605E5E' },
  { name: '灰褐', hex: '#D5C2C6' }, { name: '钢铁', hex: '#484647' },
  { name: '牡蛎', hex: '#E6E1E1' }, { name: '云雾', hex: '#B3B4B4' },
  { name: '波尔多', hex: '#6C354B' }, { name: '午夜', hex: '#1B1C1C' },
]

type PriceTier = UserPreferences['priceTier']
const BUDGET_TIERS: { value: PriceTier; label: string; desc: string }[] = [
  { value: 'premium', label: '高端奢侈', desc: '高端奢侈品牌和精品定制' },
  { value: 'mid', label: '中档轻奢', desc: '现代品牌和设计师副线' },
  { value: 'budget', label: '平价实惠', desc: '优质基础款和高街品牌' },
  { value: 'all', label: '不限预算', desc: '根据我的品味推荐所有价位' },
]

const STYLE_TAGS = ['简约通勤', '优雅知性', '潮流街头', '温柔甜美']

export default function PreferencesPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const [prefs, setPrefs] = useState({ ...state.preferences })
  const [saved, setSaved] = useState(false)

  const toggleColor = (name: string) =>
    setPrefs((p) => ({ ...p, colors: p.colors.includes(name) ? p.colors.filter(c => c !== name) : [...p.colors, name] }))

  const toggleStyle = (tag: string) =>
    setPrefs((p) => ({ ...p, styleTags: p.styleTags.includes(tag) ? p.styleTags.filter(t => t !== tag) : [...p.styleTags, tag] }))

  const handleSave = () => {
    dispatch({ type: 'UPDATE_PREFERENCES', preferences: prefs })
    setSaved(true)
    setTimeout(() => { setSaved(false); navigate('/') }, 1200)
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="fixed top-0 w-full z-50 bg-background flex items-center justify-between px-3 h-12">
        <button onClick={() => navigate(-1)} className="active:opacity-70 text-primary text-xl">←</button>
        <h1 className="text-lg font-bold text-on-surface">风格偏好</h1>
        <div className="w-6" />
      </header>

      <main className="pt-14 px-3">
        {/* Hero */}
        <div className="rounded-xl overflow-hidden relative h-32 mb-4 bg-gradient-to-br from-primary-container/80 to-primary-fixed/60">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end p-4">
            <div>
              <p className="text-xs text-white/80 font-semibold">定制你的专属风格</p>
              <h2 className="text-lg font-bold text-white">你的时尚DNA</h2>
            </div>
          </div>
        </div>

        {/* 颜色偏好 */}
        <section className="mb-5">
          <h3 className="text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">颜色偏好</h3>
          <div className="grid grid-cols-4 gap-4">
            {COLOR_SWATCHES.map((c) => {
              const selected = prefs.colors.includes(c.name)
              const isLight = ['#FFFFFF', '#F5F0F0', '#E6E1E1'].includes(c.hex)
              return (
                <button key={c.name} onClick={() => toggleColor(c.name)} className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                    selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                  } ${isLight ? 'border border-outline-variant' : ''}`} style={{ backgroundColor: c.hex }}>
                    {selected && <span className="text-sm font-bold" style={{ color: isLight ? '#874c63' : '#fff' }}>✓</span>}
                  </div>
                  <span className="text-xs text-on-surface-variant">{c.name}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* 预算档位 */}
        <section className="mb-5">
          <h3 className="text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">预算档位</h3>
          <div className="space-y-2">
            {BUDGET_TIERS.map((tier) => {
              const selected = prefs.priceTier === tier.value
              return (
                <button key={tier.value} onClick={() => setPrefs((p) => ({ ...p, priceTier: tier.value }))}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-left active:scale-[0.98] transition-transform ${
                    selected ? 'border-primary bg-primary-container/5' : 'border-outline-variant bg-surface-container-lowest'
                  }`}>
                  <div>
                    <div className="text-sm font-bold text-on-surface">{tier.label}</div>
                    <div className="text-xs text-on-surface-variant">{tier.desc}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ml-3 ${selected ? 'border-primary' : 'border-outline-variant'}`}>
                    {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* 风格标签 */}
        <section>
          <h3 className="text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">风格标签</h3>
          <div className="flex flex-wrap gap-2">
            {STYLE_TAGS.map((tag) => {
              const selected = prefs.styleTags.includes(tag)
              return (
                <button key={tag} onClick={() => toggleStyle(tag)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold active:scale-95 transition-transform ${
                    selected ? 'bg-primary-container/30 text-primary border border-primary' : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant'
                  }`}>{tag}</button>
              )
            })}
          </div>
        </section>

        {saved && (
          <div className="mt-6 bg-primary-container/20 border border-primary/30 rounded-xl p-4 text-center">
            <p className="text-primary font-semibold text-sm">✨ 已保存！AI 将根据你的偏好为你精准推荐穿搭</p>
          </div>
        )}
      </main>

      <footer className="fixed bottom-0 w-full p-3 bg-background/80 backdrop-blur-md">
        <button onClick={handleSave}
          className="w-full h-12 bg-primary text-on-primary rounded-xl text-sm font-bold shadow-lg active:scale-[0.98] transition-transform">
          {saved ? '✓ 已保存' : '保存偏好'}
        </button>
      </footer>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import type { UserPreferences } from '@ggai/shared/types'

const COLOR_SWATCHES = [
  { name: 'Blush', hex: '#E8A0B9' }, { name: 'Charcoal', hex: '#2D2D2D' },
  { name: 'Sand', hex: '#F5F0F0' }, { name: 'Mauve', hex: '#874C63' },
  { name: 'Pristine', hex: '#FFFFFF' }, { name: 'Sage', hex: '#605E5E' },
  { name: 'Taupe', hex: '#D5C2C6' }, { name: 'Steel', hex: '#484647' },
  { name: 'Oyster', hex: '#E6E1E1' }, { name: 'Cloud', hex: '#B3B4B4' },
  { name: 'Bordeaux', hex: '#6C354B' }, { name: 'Midnight', hex: '#1B1C1C' },
]

type PriceTier = UserPreferences['priceTier']
const BUDGET_TIERS: { value: PriceTier; label: string; desc: string }[] = [
  { value: 'premium', label: 'Premium', desc: 'High-end luxury and boutique labels' },
  { value: 'mid', label: 'Mid-range', desc: 'Contemporary brands and designer diffusion' },
  { value: 'budget', label: 'Affordable', desc: 'Quality essentials and high-street favorites' },
  { value: 'all', label: 'No Limit', desc: 'Show me everything tailored to my taste' },
]

const STYLE_TAGS = ['Minimalist Office', 'Elegant Chic', 'Trendy Street', 'Soft Feminine']

export default function PreferencesPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const [prefs, setPrefs] = useState({ ...state.preferences })
  const [saved, setSaved] = useState(false)

  const toggleColor = (name: string) =>
    setPrefs((p) => ({ ...p, colors: p.colors.includes(name) ? p.colors.filter((c) => c !== name) : [...p.colors, name] }))

  const toggleStyle = (tag: string) =>
    setPrefs((p) => ({ ...p, styleTags: p.styleTags.includes(tag) ? p.styleTags.filter((t) => t !== tag) : [...p.styleTags, tag] }))

  const handleSave = () => {
    dispatch({ type: 'UPDATE_PREFERENCES', preferences: prefs })
    setSaved(true)
    setTimeout(() => { setSaved(false); navigate('/') }, 1000)
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="fixed top-0 w-full z-50 bg-background flex items-center justify-between px-3 h-12">
        <button onClick={() => navigate(-1)} className="active:opacity-70">
          <span className="material-symbols-outlined text-primary">arrow_back_ios</span>
        </button>
        <h1 className="text-lg font-bold text-on-surface">Style Preferences</h1>
        <div className="w-6" />
      </header>

      <main className="pt-14 px-3">
        {/* Hero */}
        <div className="rounded-xl overflow-hidden relative h-32 mb-4 bg-gradient-to-br from-primary-container/80 to-primary-fixed/60">
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent flex items-end p-4">
            <div>
              <p className="text-xs text-white/80 font-semibold">Refine Your Look</p>
              <h2 className="text-lg font-bold text-white">Your Personal Aesthetic</h2>
            </div>
          </div>
        </div>

        {/* Colors */}
        <section className="mb-5">
          <h3 className="text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">Color Palette</h3>
          <div className="grid grid-cols-4 gap-4">
            {COLOR_SWATCHES.map((c) => {
              const selected = prefs.colors.includes(c.name)
              const isLight = ['#FFFFFF', '#F5F0F0', '#E6E1E1'].includes(c.hex)
              return (
                <button key={c.name} onClick={() => toggleColor(c.name)} className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''
                  } ${isLight ? 'border border-outline-variant' : ''}`} style={{ backgroundColor: c.hex }}>
                    {selected && <span className="material-symbols-outlined text-[18px]" style={{ color: isLight ? '#874c63' : '#fff', fontVariationSettings: "'FILL' 1" }}>check</span>}
                  </div>
                  <span className="text-xs text-on-surface-variant">{c.name}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Budget */}
        <section className="mb-5">
          <h3 className="text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">Investment Tier</h3>
          <div className="space-y-2">
            {BUDGET_TIERS.map((tier) => {
              const selected = prefs.priceTier === tier.value
              return (
                <button key={tier.value} onClick={() => setPrefs((p) => ({ ...p, priceTier: tier.value }))}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-left ${
                    selected ? 'border-primary bg-surface-container-lowest' : 'border-outline-variant bg-surface-container-lowest'
                  }`}>
                  <div>
                    <div className="text-sm font-bold text-on-surface">{tier.label}</div>
                    <div className="text-xs text-on-surface-variant">{tier.desc}</div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? 'border-primary' : 'border-outline-variant'}`}>
                    {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        {/* Style tags */}
        <section>
          <h3 className="text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider">Style Identity</h3>
          <div className="flex flex-wrap gap-2">
            {STYLE_TAGS.map((tag) => {
              const selected = prefs.styleTags.includes(tag)
              return (
                <button key={tag} onClick={() => toggleStyle(tag)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold ${
                    selected ? 'bg-primary-container/10 border border-primary text-primary' : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant'
                  }`}>{tag}</button>
              )
            })}
          </div>
        </section>
      </main>

      {/* Save button */}
      <footer className="fixed bottom-0 w-full p-3 bg-background/80 backdrop-blur-md">
        <button onClick={handleSave}
          className="w-full h-12 bg-primary text-on-primary rounded-xl text-sm font-bold shadow-lg active:scale-[0.98] transition-transform">
          {saved ? '✓ Saved!' : 'Save Preferences'}
        </button>
      </footer>
    </div>
  )
}

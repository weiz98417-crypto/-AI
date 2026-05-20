import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import type { UserPreferences } from '@ggai/shared/types'
import TopAppBar from '../components/TopAppBar'

const COLOR_SWATCHES = [
  { name: 'Blush', hex: '#E8A0B9' }, { name: 'Charcoal', hex: '#2D2D2D' },
  { name: 'Sand', hex: '#F5F0F0' }, { name: 'Mauve', hex: '#874C63' },
  { name: 'Pristine', hex: '#FFFFFF' }, { name: 'Sage', hex: '#605E5E' },
  { name: 'Taupe', hex: '#D5C2C6' }, { name: 'Steel', hex: '#484647' },
  { name: 'Oyster', hex: '#E6E1E1' }, { name: 'Cloud', hex: '#B3B4B4' },
  { name: 'Bordeaux', hex: '#6C354B' }, { name: 'Midnight', hex: '#1B1C1C' },
]

const BUDGET_TIERS: { value: UserPreferences['priceTier']; label: string; desc: string }[] = [
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
  const [toast, setToast] = useState('')

  const toggleColor = (name: string) => {
    setPrefs((p) => ({
      ...p,
      colors: p.colors.includes(name) ? p.colors.filter((c) => c !== name) : [...p.colors, name],
    }))
  }

  const toggleStyle = (tag: string) => {
    setPrefs((p) => ({
      ...p,
      styleTags: p.styleTags.includes(tag) ? p.styleTags.filter((t) => t !== tag) : [...p.styleTags, tag],
    }))
  }

  const handleSave = () => {
    dispatch({ type: 'UPDATE_PREFERENCES', preferences: prefs })
    setToast('已保存')
    setTimeout(() => setToast(''), 2000)
  }

  return (
    <div className="min-h-screen bg-background text-on-background pb-32">
      <TopAppBar title="Style Preferences" />

      <main className="pt-16 px-3">
        {/* Hero image */}
        <section className="mb-6">
          <div className="rounded-xl overflow-hidden relative h-40 mb-4 bg-gradient-to-br from-primary-container/80 to-primary-fixed/60">
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex flex-col justify-end p-4">
              <p className="text-xs font-semibold text-white/90" style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}>
                Refine Your Look
              </p>
              <h2 className="text-lg font-bold text-white" style={{ fontSize: '18px', lineHeight: '24px', fontWeight: 700 }}>
                Your Personal Aesthetic
              </h2>
            </div>
          </div>
          <p className="text-sm text-on-surface-variant" style={{ fontSize: '14px', lineHeight: '20px' }}>
            Configure your fashion DNA to help us curate pieces that resonate with your unique urban lifestyle.
          </p>
        </section>

        {/* Color Palette */}
        <section className="mb-6">
          <h3 className="text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider" style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}>
            Color Palette
          </h3>
          <div className="grid grid-cols-4 gap-4">
            {COLOR_SWATCHES.map((c) => {
              const selected = prefs.colors.includes(c.name)
              return (
                <button key={c.name} onClick={() => toggleColor(c.name)} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      selected ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'hover:opacity-80'
                    } ${c.hex === '#FFFFFF' || c.hex === '#F5F0F0' ? 'border border-outline-variant' : ''}`}
                    style={{ backgroundColor: c.hex }}
                  >
                    {selected && (
                      <span className="material-symbols-outlined text-[18px]" style={{ color: c.hex === '#FFFFFF' || c.hex === '#F5F0F0' ? '#874c63' : '#ffffff', fontVariationSettings: "'FILL' 1" }}>
                        check
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-on-surface-variant" style={{ fontSize: '12px', lineHeight: '16px' }}>
                    {c.name}
                  </span>
                </button>
              )
            })}
          </div>
        </section>

        {/* Budget Tier */}
        <section className="mb-6">
          <h3 className="text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider" style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}>
            Investment Tier
          </h3>
          <div className="space-y-2">
            {BUDGET_TIERS.map((tier) => {
              const selected = prefs.priceTier === tier.value
              return (
                <label
                  key={tier.value}
                  onClick={() => setPrefs((p) => ({ ...p, priceTier: tier.value }))}
                  className={`flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl border cursor-pointer active:bg-surface-container-low transition-colors ${
                    selected ? 'border-primary' : 'border-outline-variant'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className={`text-sm font-bold ${selected ? 'text-on-surface' : 'text-on-surface'}`} style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 700 }}>
                      {tier.label}
                    </span>
                    <span className="text-xs text-on-surface-variant" style={{ fontSize: '12px', lineHeight: '16px' }}>
                      {tier.desc}
                    </span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected ? 'border-primary' : 'border-outline-variant'}`}>
                    {selected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                  </div>
                </label>
              )
            })}
          </div>
        </section>

        {/* Style Identity */}
        <section className="mb-6">
          <h3 className="text-xs font-semibold text-on-surface-variant mb-2 uppercase tracking-wider" style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}>
            Style Identity
          </h3>
          <div className="flex flex-wrap gap-2">
            {STYLE_TAGS.map((tag) => {
              const selected = prefs.styleTags.includes(tag)
              return (
                <button
                  key={tag}
                  onClick={() => toggleStyle(tag)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                    selected
                      ? 'bg-primary-container/10 border border-primary text-primary'
                      : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant'
                  }`}
                  style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}
                >
                  {tag}
                </button>
              )
            })}
          </div>
        </section>
      </main>

      {/* Sticky Bottom Save Button */}
      <footer className="fixed bottom-0 w-full p-3 bg-background/80 backdrop-blur-md">
        <button
          onClick={handleSave}
          className="w-full h-12 bg-primary text-on-primary rounded-xl text-sm font-bold shadow-lg active:scale-[0.98] transition-transform"
          style={{ fontSize: '14px', lineHeight: '20px', fontWeight: 700 }}
        >
          Save Preferences
        </button>
      </footer>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-full text-sm shadow-lg z-50 animate-bounce">
          {toast}
        </div>
      )}
    </div>
  )
}

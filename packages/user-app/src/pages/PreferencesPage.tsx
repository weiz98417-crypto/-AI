import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import type { UserPreferences } from '@ggai/shared/types'

const COLORS = ['#f8a4c8', '#ffffff', '#1b1c1c', '#e8d5c4', '#a8c8e8', '#8c9c8c', '#d4a4a4', '#c8b8e8']
const COLOR_NAMES = ['粉色', '白色', '黑色', '米色', '蓝色', '绿色', '棕色', '紫色']

type PriceTier = UserPreferences['priceTier']

const PRICE_TIERS: { value: PriceTier; label: string }[] = [
  { value: 'budget', label: '¥200以下' },
  { value: 'mid', label: '¥200-500' },
  { value: 'premium', label: '¥500-1000' },
  { value: 'all', label: '不限' },
]

const STYLE_TAGS = ['简约通勤', '优雅知性', '潮流街头', '温柔甜美', '职业精英', '休闲舒适']

export default function PreferencesPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const [prefs, setPrefs] = useState({ ...state.preferences })
  const [toast, setToast] = useState('')

  const toggleColor = (colorName: string) => {
    setPrefs((prev) => ({
      ...prev,
      colors: prev.colors.includes(colorName)
        ? prev.colors.filter((c) => c !== colorName)
        : [...prev.colors, colorName],
    }))
  }

  const toggleStyle = (tag: string) => {
    setPrefs((prev) => ({
      ...prev,
      styleTags: prev.styleTags.includes(tag)
        ? prev.styleTags.filter((t) => t !== tag)
        : [...prev.styleTags, tag],
    }))
  }

  const handleSave = () => {
    dispatch({ type: 'UPDATE_PREFERENCES', preferences: prefs })
    setToast('已保存')
    setTimeout(() => setToast(''), 2000)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="material-symbols-outlined text-on-surface">
          arrow_back
        </button>
        <h1 className="text-xl font-bold">风格偏好</h1>
      </div>

      {/* Color preferences */}
      <section className="mb-8">
        <h2 className="font-semibold mb-3">颜色偏好</h2>
        <div className="flex flex-wrap gap-3">
          {COLORS.map((color, i) => {
            const name = COLOR_NAMES[i]
            const selected = prefs.colors.includes(name)
            return (
              <button
                key={name}
                onClick={() => toggleColor(name)}
                className={`w-12 h-12 rounded-xl border-2 transition-all ${
                  selected ? 'border-primary scale-110 shadow-md' : 'border-outline-variant'
                }`}
                style={{ backgroundColor: color }}
                title={name}
              />
            )
          })}
        </div>
      </section>

      {/* Budget */}
      <section className="mb-8">
        <h2 className="font-semibold mb-3">预算档位</h2>
        <div className="flex flex-wrap gap-2">
          {PRICE_TIERS.map((tier) => (
            <button
              key={tier.value}
              onClick={() => setPrefs((prev) => ({ ...prev, priceTier: tier.value }))}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-colors ${
                prefs.priceTier === tier.value
                  ? 'bg-primary text-on-primary'
                  : 'bg-surface-container text-on-surface-variant'
              }`}
            >
              {tier.label}
            </button>
          ))}
        </div>
      </section>

      {/* Style tags */}
      <section className="mb-8">
        <h2 className="font-semibold mb-3">风格标签</h2>
        <div className="flex flex-wrap gap-2">
          {STYLE_TAGS.map((tag) => {
            const selected = prefs.styleTags.includes(tag)
            return (
              <button
                key={tag}
                onClick={() => toggleStyle(tag)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  selected
                    ? 'bg-primary-container text-on-primary-container font-medium'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {tag}
              </button>
            )
          })}
        </div>
      </section>

      {/* Save button */}
      <button
        onClick={handleSave}
        className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-semibold text-lg active:scale-95 transition-transform"
      >
        保存偏好
      </button>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-6 py-3 rounded-full text-sm shadow-lg animate-bounce">
          {toast}
        </div>
      )}
    </div>
  )
}

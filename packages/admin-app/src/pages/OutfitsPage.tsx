import { useState } from 'react'
import { useAdmin } from '../store/AdminContext'
import { PRICE_RANGE_MAP } from '@ggai/shared/types'

export default function OutfitsPage() {
  const { state, dispatch } = useAdmin()
  const [toggleError, setToggleError] = useState('')

  const handleToggle = (outfitId: string) => {
    try {
      dispatch({ type: 'TOGGLE_OUTFIT', outfitId })
    } catch {
      setToggleError('操作失败，请重试')
      setTimeout(() => setToggleError(''), 2000)
    }
  }

  if (state.loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-8">穿搭管理</h1>
        <div className="bg-surface rounded-2xl overflow-hidden">
          <div className="h-12 bg-surface-container animate-pulse" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 border-t border-outline-variant animate-pulse bg-surface" />
          ))}
        </div>
      </div>
    )
  }

  const { managedOutfits } = state

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">穿搭管理</h1>

      {managedOutfits.length === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">checkroom</span>
          <p className="text-on-surface-variant">暂未创建穿搭方案</p>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-surface-container text-left">
                  <th className="px-6 py-4 text-sm font-semibold">穿搭名称</th>
                  <th className="px-6 py-4 text-sm font-semibold">场合</th>
                  <th className="px-6 py-4 text-sm font-semibold">总价</th>
                  <th className="px-6 py-4 text-sm font-semibold">价格档位</th>
                  <th className="px-6 py-4 text-sm font-semibold">风格标签</th>
                  <th className="px-6 py-4 text-sm font-semibold">状态</th>
                </tr>
              </thead>
              <tbody>
                {managedOutfits.map((outfit) => (
                  <tr
                    key={outfit.id}
                    className={`border-t border-outline-variant transition-colors ${
                      !outfit.active ? 'opacity-50 bg-surface-container-low' : ''
                    }`}
                  >
                    <td className={`px-6 py-4 text-sm font-medium ${!outfit.active ? 'line-through' : ''}`}>
                      {outfit.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-on-surface-variant">
                      {outfit.occasion}
                    </td>
                    <td className="px-6 py-4 text-sm">¥{outfit.totalPrice}</td>
                    <td className="px-6 py-4 text-sm">
                      {PRICE_RANGE_MAP[outfit.priceRange]?.label || outfit.priceRange}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-wrap gap-1">
                        {outfit.styleTags.map((tag) => (
                          <span key={tag} className="text-xs bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggle(outfit.id)}
                        className={`relative w-11 h-6 rounded-full transition-colors ${
                          outfit.active ? 'bg-primary' : 'bg-surface-container-highest'
                        }`}
                      >
                        <span
                          className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                            outfit.active ? 'translate-x-5.5' : 'translate-x-0.5'
                          }`}
                          style={{ left: 0 }}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Toast */}
      {toggleError && (
        <div className="fixed bottom-8 right-8 bg-error text-on-error px-6 py-3 rounded-full text-sm shadow-lg">
          {toggleError}
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { useAdmin } from '../store/AdminContext'
import { PRICE_RANGE_MAP } from '../shared/types'

const OCCASION_COLORS: Record<string, string> = {
  'work-commute': 'bg-tertiary-fixed/30 text-on-tertiary-fixed-variant',
  'client-meeting': 'bg-secondary-container/40 text-on-secondary-container',
  'weekend-date': 'bg-primary-fixed/40 text-on-primary-fixed-variant',
  'girls-gathering': 'bg-tertiary-container/20 text-on-tertiary-container',
}

const OCCASION_LABELS: Record<string, string> = {
  'work-commute': '上班通勤',
  'client-meeting': '客户会议',
  'weekend-date': '周末约会',
  'girls-gathering': '闺蜜聚会',
}

const CTR_VALUES: Record<string, number> = {
  'work-commute-1': 78, 'work-commute-2': 62, 'work-commute-3': 85, 'work-commute-4': 55,
  'client-meeting-1': 92, 'client-meeting-2': 71, 'client-meeting-3': 66,
  'weekend-date-1': 88, 'weekend-date-2': 73, 'weekend-date-3': 59,
  'girls-gathering-1': 95, 'girls-gathering-2': 81, 'girls-gathering-3': 68,
}

export default function OutfitsPage() {
  const { state, dispatch } = useAdmin()
  const [page, setPage] = useState(1)
  const perPage = 10

  if (state.loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 bg-surface rounded animate-pulse" />
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="bg-surface rounded-2xl h-24 animate-pulse" />)}
        </div>
        <div className="bg-surface rounded-2xl h-64 animate-pulse" />
      </div>
    )
  }

  const outfits = state.managedOutfits
  const total = outfits.length
  const pages = Math.ceil(total / perPage)
  const paged = outfits.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-[28px] font-bold text-on-surface">内容管理</h2>
          <p className="text-sm text-secondary mt-1">管理和策划推荐穿搭内容</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 flex items-center gap-2 bg-surface border border-outline-variant/40 rounded-lg text-secondary hover:border-primary transition-all text-xs font-semibold">
            🔽 筛选
          </button>
          <button className="px-4 py-2 flex items-center gap-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all text-xs font-semibold shadow-sm">
            ＋ 新增穿搭
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '已发布', value: total, icon: '✅', color: 'bg-primary/10 text-primary' },
          { label: '草稿', value: 3, icon: '📝', color: 'bg-secondary/10 text-secondary' },
          { label: '平均点击率', value: '8.5%', icon: '📈', color: 'bg-tertiary-container/30 text-tertiary' },
          { label: '总曝光', value: '42.5k', icon: '👁️', color: 'bg-error-container/30 text-error' },
        ].map((s) => (
          <div key={s.label} className="bg-surface p-5 rounded-2xl border border-outline-variant/20 hover:border-primary/40 transition-all">
            <div className="flex items-center justify-between mb-3">
              <span className={`p-2 ${s.color} rounded-lg text-lg`}>{s.icon}</span>
            </div>
            <p className="text-xs text-secondary font-semibold uppercase tracking-wider">{s.label}</p>
            <p className="text-2xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-surface rounded-2xl border border-outline-variant/20 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/20">
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase tracking-wider">预览</th>
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase tracking-wider">穿搭名称</th>
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase tracking-wider">场合</th>
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase tracking-wider">价格</th>
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase tracking-wider">CTR</th>
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase tracking-wider">状态</th>
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {paged.map((outfit) => {
                const ctr = CTR_VALUES[outfit.id] || 50
                const barColor = ctr >= 80 ? 'bg-primary' : ctr >= 60 ? 'bg-primary/60' : 'bg-primary/30'
                return (
                  <tr key={outfit.id} className="hover:bg-surface-container-low transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-12 h-16 rounded-lg bg-surface-container overflow-hidden border border-outline-variant/20">
                        <img src={outfit.coverImage} alt={outfit.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold text-on-surface">{outfit.name}</p>
                      <p className="text-[10px] text-secondary">ID: {outfit.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${OCCASION_COLORS[outfit.occasion] || 'bg-surface-container text-secondary'}`}>
                        {OCCASION_LABELS[outfit.occasion] || outfit.occasion}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">¥{outfit.totalPrice}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-secondary">CTR</span>
                          <span className="text-primary">{ctr / 10}%</span>
                        </div>
                        <div className="w-20 h-1.5 bg-surface-container rounded-full overflow-hidden">
                          <div className={`h-full ${barColor} rounded-full`} style={{ width: `${ctr}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-semibold ${outfit.active ? 'text-green-700' : 'text-on-surface-variant/50'}`}>
                        <span className={`w-2 h-2 rounded-full ${outfit.active ? 'bg-green-500' : 'bg-outline'}`} />
                        {outfit.active ? '已上架' : '已下架'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => dispatch({ type: 'TOGGLE_OUTFIT', outfitId: outfit.id })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            outfit.active ? 'bg-outline-variant/30 text-secondary hover:bg-outline-variant/50' : 'bg-primary/10 text-primary hover:bg-primary/20'
                          }`}
                        >
                          {outfit.active ? '下架' : '上架'}
                        </button>
                        <button className="p-1.5 text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-all text-sm">✏️</button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between bg-surface-container-low">
          <p className="text-xs text-secondary font-semibold">
            第 {(page - 1) * perPage + 1}-{Math.min(page * perPage, total)} 条，共 {total} 条
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="p-1.5 text-secondary hover:bg-primary/10 rounded-lg disabled:opacity-30 text-sm"
            >◀</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold ${
                  p === page ? 'bg-primary text-white' : 'text-secondary hover:bg-primary/10'
                }`}
              >{p}</button>
            ))}
            <button
              onClick={() => setPage(Math.min(pages, page + 1))}
              disabled={page === pages}
              className="p-1.5 text-secondary hover:bg-primary/10 rounded-lg disabled:opacity-30 text-sm"
            >▶</button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { seedAllActivities, generateBulkActivities } from '../store/seedData'
import Pagination from '../components/Pagination'

const TYPE_LABELS: Record<string, string> = {
  purchase: '购买', save: '收藏', share: '分享', view: '浏览',
  register: '注册', review: '评价', refer: '推荐', other: '其他',
}

export default function ActivitiesPage() {
  const [activities] = useState(() => [...seedAllActivities, ...generateBulkActivities(2000)])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 12

  const filtered = activities.filter(a => {
    if (!search) return true
    return a.name.toLowerCase().includes(search.toLowerCase()) || a.action.toLowerCase().includes(search.toLowerCase())
  })

  const total = filtered.length
  const pages = Math.ceil(total / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-[28px] font-bold text-on-surface">活动日志</h2>
          <p className="text-sm text-secondary mt-1">用户行为时间线</p>
        </div>
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          placeholder="搜索用户名或行为..."
          className="px-4 py-2 bg-surface border border-outline-variant/40 rounded-lg text-xs focus:border-primary focus:outline-none w-56"
        />
      </div>

      {/* Timeline */}
      <div className="bg-surface rounded-2xl border border-outline-variant/20 overflow-hidden shadow-sm">
        <div className="divide-y divide-outline-variant/10">
          {paged.map((a, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 hover:bg-surface-container-low transition-colors group">
              <div className="w-10 h-10 rounded-full bg-primary-container/30 border border-outline-variant/20 flex items-center justify-center text-xs font-bold text-primary shrink-0 group-hover:scale-110 transition-transform">
                {a.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-on-surface truncate">{a.name}</p>
                <p className="text-xs text-secondary truncate">{a.action}</p>
              </div>
              <span className="text-[11px] text-outline font-semibold shrink-0 bg-surface-container-low px-3 py-1 rounded-full">{a.time}</span>
            </div>
          ))}
        </div>
        <div className="px-6 py-4 border-t border-outline-variant/10 bg-surface-container-low">
          <Pagination page={page} total={total} perPage={perPage} onChange={setPage} />
        </div>
      </div>
    </div>
  )
}

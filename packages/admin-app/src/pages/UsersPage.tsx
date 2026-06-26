import { useState } from 'react'
import type { AdminUser } from '../shared/types'
import { seedUsers, generateBulkUsers } from '../store/seedData'

export default function UsersPage() {
  const [users] = useState<AdminUser[]>(() => {
    const saved = localStorage.getItem('ggai-admin-users')
    if (saved) return JSON.parse(saved)
    return [...seedUsers, ...generateBulkUsers(1500)]
  })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const perPage = 8

  const toggleBan = (userId: string) => {
    const updated = users.map(u =>
      u.id === userId ? { ...u, status: u.status === 'active' ? 'banned' as const : 'active' as const } : u
    )
    localStorage.setItem('ggai-admin-users', JSON.stringify(updated))
    window.location.reload()
  }

  const filtered = users.filter(u => {
    if (statusFilter !== 'all' && u.status !== statusFilter) return false
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const total = filtered.length
  const pages = Math.ceil(total / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-[28px] font-bold text-on-surface">用户管理</h2>
          <p className="text-sm text-secondary mt-1">管理平台注册用户</p>
        </div>
        <div className="flex gap-3">
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="搜索用户名或邮箱..."
            className="px-4 py-2 bg-surface border border-outline-variant/40 rounded-lg text-xs focus:border-primary focus:outline-none w-56"
          />
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            className="px-4 py-2 bg-surface border border-outline-variant/40 rounded-lg text-xs text-secondary cursor-pointer"
          >
            <option value="all">全部状态</option>
            <option value="active">正常</option>
            <option value="banned">已封禁</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: '总用户', value: users.length, dot: 'bg-primary' },
          { label: '活跃', value: users.filter(u => u.status === 'active').length, dot: 'bg-green-500' },
          { label: '已封禁', value: users.filter(u => u.status === 'banned').length, dot: 'bg-error' },
          { label: '有订单', value: users.filter(u => u.orderCount > 0).length, dot: 'bg-tertiary' },
        ].map(s => (
          <div key={s.label} className="bg-surface p-5 rounded-2xl border border-outline-variant/20 hover:border-primary/40 transition-all cursor-default">
            <div className="flex items-center gap-2 mb-2"><span className={`w-2.5 h-2.5 rounded-full ${s.dot}`} /></div>
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
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase">用户</th>
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase">邮箱</th>
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase">加入日期</th>
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase">订单数</th>
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase">消费总额</th>
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase">状态</th>
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {paged.map(u => (
                <tr key={u.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-container/30 border border-outline-variant/20 flex items-center justify-center text-xs font-bold text-primary">{u.avatar}</div>
                      <span className="text-sm font-semibold">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary">{u.email}</td>
                  <td className="px-6 py-4 text-sm text-secondary">{u.joinDate}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{u.orderCount}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-primary">¥{u.totalSpent.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${u.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-error-container/40 text-error'}`}>
                      {u.status === 'active' ? '正常' : '已封禁'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => toggleBan(u.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${u.status === 'active' ? 'bg-error/10 text-error hover:bg-error/20' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}
                    >
                      {u.status === 'active' ? '封禁' : '解封'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between bg-surface-container-low">
          <p className="text-xs text-secondary font-semibold">第 {(page - 1) * perPage + 1}-{Math.min(page * perPage, total)} 条，共 {total} 条</p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1.5 text-secondary hover:bg-primary/10 rounded-lg disabled:opacity-30 text-sm">◀</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold ${p === page ? 'bg-primary text-white shadow-sm' : 'text-secondary hover:bg-primary/10'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(Math.min(pages, page + 1))} disabled={page === pages} className="p-1.5 text-secondary hover:bg-primary/10 rounded-lg disabled:opacity-30 text-sm">▶</button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import type { AdminOrder } from '../shared/types'
import { seedOrders, generateBulkOrders } from '../store/seedData'

const STATUS_LABELS: Record<string, string> = {
  pending: '待处理', shipped: '已发货', delivered: '已完成', cancelled: '已取消',
}
const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-700',
  shipped: 'bg-blue-50 text-blue-700',
  delivered: 'bg-green-50 text-green-700',
  cancelled: 'bg-outline-variant/30 text-outline',
}

export default function OrdersPage() {
  const [orders] = useState<AdminOrder[]>(() => {
    const saved = localStorage.getItem('ggai-admin-orders')
    if (saved) return JSON.parse(saved)
    return [...seedOrders, ...generateBulkOrders(1000)]
  })
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const perPage = 8

  const updateStatus = (orderId: string, newStatus: AdminOrder['status']) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    localStorage.setItem('ggai-admin-orders', JSON.stringify(updated))
    window.location.reload()
  }

  const filtered = orders.filter(o => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false
    if (search && !o.userName.toLowerCase().includes(search.toLowerCase()) && !o.items.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const total = filtered.length
  const pages = Math.ceil(total / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-[28px] font-bold text-on-surface">订单管理</h2>
          <p className="text-sm text-secondary mt-1">查看和管理用户订单</p>
        </div>
        <div className="flex gap-3">
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            placeholder="搜索用户或商品..."
            className="px-4 py-2 bg-surface border border-outline-variant/40 rounded-lg text-xs focus:border-primary focus:outline-none w-48"
          />
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
            className="px-4 py-2 bg-surface border border-outline-variant/40 rounded-lg text-xs text-secondary cursor-pointer"
          >
            <option value="all">全部状态</option>
            <option value="pending">待处理</option>
            <option value="shipped">已发货</option>
            <option value="delivered">已完成</option>
            <option value="cancelled">已取消</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4">
        {[
          { label: '全部', value: orders.length, dot: 'bg-primary' },
          { label: '待处理', value: orders.filter(o => o.status === 'pending').length, dot: 'bg-yellow-500' },
          { label: '已发货', value: orders.filter(o => o.status === 'shipped').length, dot: 'bg-blue-500' },
          { label: '已完成', value: orders.filter(o => o.status === 'delivered').length, dot: 'bg-green-500' },
          { label: '已取消', value: orders.filter(o => o.status === 'cancelled').length, dot: 'bg-outline' },
        ].map(s => (
          <div key={s.label} className="bg-surface p-4 rounded-2xl border border-outline-variant/20 hover:border-primary/40 transition-all cursor-default">
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
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase">订单ID</th>
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase">用户</th>
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase">商品</th>
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase">金额</th>
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase">日期</th>
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase">状态</th>
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {paged.map(o => (
                <tr key={o.id} className="hover:bg-surface-container-low transition-colors group">
                  <td className="px-6 py-4 text-xs text-outline font-mono">#{o.id}</td>
                  <td className="px-6 py-4 text-sm font-semibold">{o.userName}</td>
                  <td className="px-6 py-4 text-sm text-secondary">{o.items}</td>
                  <td className="px-6 py-4 text-sm font-bold text-primary">¥{o.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-secondary">{o.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[o.status]}`}>{STATUS_LABELS[o.status]}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <select
                      value={o.status}
                      onChange={e => updateStatus(o.id, e.target.value as AdminOrder['status'])}
                      className="px-2 py-1 bg-surface-container-low border border-outline-variant/30 rounded-lg text-xs text-secondary cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <option value="pending">待处理</option>
                      <option value="shipped">已发货</option>
                      <option value="delivered">已完成</option>
                      <option value="cancelled">已取消</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-outline-variant/10 flex items-center justify-between bg-surface-container-low">
          <p className="text-xs text-secondary font-semibold">共 {total} 条订单</p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1.5 text-secondary hover:bg-primary/10 rounded-lg disabled:opacity-30 text-sm">◀</button>
            {Array.from({ length: Math.min(pages, 5) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold ${p === page ? 'bg-primary text-white shadow-sm' : 'text-secondary hover:bg-primary/10'}`}>{p}</button>
            ))}
            <button onClick={() => setPage(Math.min(pages, page + 1))} disabled={page === pages} className="p-1.5 text-secondary hover:bg-primary/10 rounded-lg disabled:opacity-30 text-sm">▶</button>
          </div>
        </div>
      </div>
    </div>
  )
}

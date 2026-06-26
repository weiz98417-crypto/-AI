import { useState } from 'react'
import { useAdmin } from '../store/AdminContext'
import { OUTFIT_IMAGE_POOL as IMG_POOL } from '../store/seedData'
import type { ManagedOutfit } from '../shared/types'

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

const ALL_OCCASIONS = ['', 'work-commute', 'client-meeting', 'weekend-date', 'girls-gathering']

function getDefaultImage(occasion: string): string {
  const pool = IMG_POOL[occasion]
  return pool ? pool[0] : '/assets/outfits/work-commute-1-main.jpg'
}

export default function OutfitsPage() {
  const { state, dispatch } = useAdmin()
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newOccasion, setNewOccasion] = useState('work-commute')
  const [newPrice, setNewPrice] = useState('')
  const [newImage, setNewImage] = useState(getDefaultImage('work-commute'))
  const [filterOccasion, setFilterOccasion] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'status' | ''>('')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const perPage = 10

  const handleOccasionChange = (occasion: string) => {
    setNewOccasion(occasion)
    setNewImage(getDefaultImage(occasion))
  }

  const handleAdd = () => {
    if (!newName.trim()) return
    const id = `new-${Date.now()}`
    const price = parseInt(newPrice) || 888
    const outfit: ManagedOutfit = {
      id, occasion: newOccasion as ManagedOutfit['occasion'],
      name: newName, items: [], totalPrice: price,
      priceRange: price > 1000 ? 'premium' as const : price > 500 ? 'mid' as const : 'budget' as const,
      styleTags: ['简约通勤'], coverImage: newImage,
      brandSummary: '自定义品牌', active: true,
    }
    dispatch({ type: 'ADD_OUTFIT', outfit })
    setNewName(''); setNewPrice(''); setShowForm(false); setPage(1)
    setNewImage(getDefaultImage('work-commute'))
  }

  const handleEdit = (outfit: ManagedOutfit) => {
    const price = parseInt(editPrice) || outfit.totalPrice
    dispatch({ type: 'UPDATE_OUTFIT', outfitId: outfit.id, name: editName || outfit.name, totalPrice: price })
    setEditingId(null)
  }

  const startEdit = (outfit: ManagedOutfit) => {
    setEditingId(outfit.id)
    setEditName(outfit.name)
    setEditPrice(String(outfit.totalPrice))
  }

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
  let filtered = filterOccasion
    ? outfits.filter(o => o.occasion === filterOccasion)
    : outfits

  // Sort
  if (sortBy) {
    filtered = [...filtered].sort((a, b) => {
      let va: any, vb: any
      if (sortBy === 'name') { va = a.name; vb = b.name }
      else if (sortBy === 'price') { va = a.totalPrice; vb = b.totalPrice }
      else { va = a.active ? 1 : 0; vb = b.active ? 1 : 0 }
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
  }

  const toggleSort = (col: 'name' | 'price' | 'status') => {
    if (sortBy === col) setSortDir(sd => sd === 'asc' ? 'desc' : 'asc')
    else { setSortBy(col); setSortDir('asc') }
  }

  const total = filtered.length
  const pages = Math.ceil(total / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  const occasionImages = IMG_POOL[newOccasion] || IMG_POOL['work-commute']

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-[28px] font-bold text-on-surface">内容管理</h2>
          <p className="text-sm text-secondary mt-1">管理和策划推荐穿搭内容</p>
        </div>
        <div className="flex gap-3">
          <select
            value={filterOccasion}
            onChange={e => { setFilterOccasion(e.target.value); setPage(1) }}
            className="px-4 py-2 bg-surface border border-outline-variant/40 rounded-lg text-secondary hover:border-primary transition-all text-xs font-semibold cursor-pointer"
          >
            <option value="">全部场合</option>
            {ALL_OCCASIONS.filter(Boolean).map(o => (
              <option key={o} value={o}>{OCCASION_LABELS[o]}</option>
            ))}
          </select>
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 flex items-center gap-2 bg-primary text-white rounded-lg hover:opacity-90 transition-all text-xs font-semibold shadow-sm"
          >
            {showForm ? '取消' : '＋ 新增穿搭'}
          </button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-surface rounded-2xl border border-primary/30 p-6 shadow-sm">
          <h3 className="text-sm font-bold mb-4 text-primary">新增穿搭方案</h3>
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-xs text-secondary mb-1 font-semibold">穿搭名称</label>
              <input value={newName} onChange={e => setNewName(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none"
                placeholder="如：春季通勤套装" />
            </div>
            <div>
              <label className="block text-xs text-secondary mb-1 font-semibold">场合</label>
              <select value={newOccasion} onChange={e => handleOccasionChange(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none cursor-pointer">
                <option value="work-commute">上班通勤</option>
                <option value="client-meeting">客户会议</option>
                <option value="weekend-date">周末约会</option>
                <option value="girls-gathering">闺蜜聚会</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-secondary mb-1 font-semibold">价格 (¥)</label>
              <input value={newPrice} onChange={e => setNewPrice(e.target.value)}
                className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none"
                placeholder="如：1280" type="number" />
            </div>
            <div>
              <label className="block text-xs text-secondary mb-1 font-semibold">封面图片</label>
              <div className="flex gap-2 items-center">
                <select value={newImage} onChange={e => setNewImage(e.target.value)}
                  className="flex-1 px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-xs focus:border-primary focus:outline-none cursor-pointer">
                  {occasionImages.map(img => (
                    <option key={img} value={img}>{img.split('/').pop()}</option>
                  ))}
                </select>
                <div className="w-10 h-12 rounded-lg bg-surface-container overflow-hidden border border-outline-variant/20 shrink-0">
                  <img src={newImage} alt="preview" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
          <button onClick={handleAdd}
            className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
            确认添加
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '已发布', value: outfits.filter(o => o.active).length, dot: 'bg-green-500' },
          { label: '已下架', value: outfits.filter(o => !o.active).length, dot: 'bg-secondary' },
          { label: '平均点击率', value: '8.5%', dot: 'bg-tertiary' },
          { label: '总曝光', value: '42.5k', dot: 'bg-red-400' },
        ].map((s) => (
          <div key={s.label} className="bg-surface p-5 rounded-2xl border border-outline-variant/20 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default">
            <div className="flex items-center justify-between mb-3">
              <span className={`w-3 h-3 rounded-full ${s.dot} inline-block`} />
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
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase tracking-wider cursor-pointer hover:text-primary select-none" onClick={() => toggleSort('name')}>
                  穿搭名称 {sortBy === 'name' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase tracking-wider">场合</th>
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase tracking-wider cursor-pointer hover:text-primary select-none" onClick={() => toggleSort('price')}>
                  价格 {sortBy === 'price' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase tracking-wider">CTR</th>
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase tracking-wider cursor-pointer hover:text-primary select-none" onClick={() => toggleSort('status')}>
                  状态 {sortBy === 'status' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
                </th>
                <th className="px-6 py-4 text-xs text-secondary font-semibold uppercase tracking-wider text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/10">
              {paged.map((outfit) => {
                const ctr = Math.floor(Math.random() * 40 + 55)
                const barColor = ctr >= 80 ? 'bg-primary' : ctr >= 60 ? 'bg-primary/60' : 'bg-primary/30'
                const isEditing = editingId === outfit.id
                return (
                  <tr key={outfit.id} className="hover:bg-surface-container-low hover:shadow-sm transition-all group border-l-4 border-l-transparent hover:border-l-primary/30">
                    <td className="px-6 py-4">
                      <div className="w-12 h-16 rounded-lg bg-surface-container overflow-hidden border border-outline-variant/20">
                        <img src={outfit.coverImage} alt={outfit.name} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <input value={editName} onChange={e => setEditName(e.target.value)}
                          className="w-full px-2 py-1 bg-surface-container-low border border-outline-variant rounded text-sm focus:border-primary focus:outline-none" />
                      ) : (
                        <>
                          <p className="text-sm font-semibold text-on-surface">{outfit.name}</p>
                          <p className="text-[10px] text-secondary">ID: {outfit.id}</p>
                        </>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${OCCASION_COLORS[outfit.occasion] || 'bg-surface-container text-secondary'}`}>
                        {OCCASION_LABELS[outfit.occasion] || outfit.occasion}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      {isEditing ? (
                        <input value={editPrice} onChange={e => setEditPrice(e.target.value)}
                          type="number"
                          className="w-20 px-2 py-1 bg-surface-container-low border border-outline-variant rounded text-sm focus:border-primary focus:outline-none" />
                      ) : (
                        `¥${outfit.totalPrice}`
                      )}
                    </td>
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
                        {isEditing ? (
                          <>
                            <button onClick={() => handleEdit(outfit)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-all text-sm font-semibold">保存</button>
                            <button onClick={() => setEditingId(null)} className="p-1.5 text-secondary hover:bg-outline-variant/30 rounded-lg transition-all text-sm font-semibold">取消</button>
                          </>
                        ) : (
                          <>
                            <button onClick={() => startEdit(outfit)} className="p-1.5 text-secondary hover:text-primary hover:bg-primary/10 rounded-lg transition-all text-sm font-semibold">Edit</button>
                            <button onClick={() => setDeleteConfirm(outfit.id)} className="p-1.5 text-error/60 hover:text-error hover:bg-error/5 rounded-lg transition-all text-sm font-semibold">删除</button>
                          </>
                        )}
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
              className="p-1.5 text-secondary hover:bg-primary/10 hover:text-primary rounded-lg disabled:opacity-30 text-sm transition-all"
            >◀</button>
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold ${
                  p === page ? 'bg-primary text-white shadow-sm' : 'text-secondary hover:bg-primary/10 hover:text-primary transition-all'
                }`}
              >{p}</button>
            ))}
            <button
              onClick={() => setPage(Math.min(pages, page + 1))}
              disabled={page === pages}
              className="p-1.5 text-secondary hover:bg-primary/10 hover:text-primary rounded-lg disabled:opacity-30 text-sm transition-all"
            >▶</button>
          </div>
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-surface rounded-2xl p-6 shadow-2xl border border-outline-variant/20 max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="text-base font-bold text-on-surface mb-2">确认删除</h3>
            <p className="text-sm text-secondary mb-4">
              确定要删除「{state.managedOutfits.find(o => o.id === deleteConfirm)?.name}」吗？此操作不可撤销。
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 bg-surface-container text-on-surface rounded-lg text-sm font-semibold hover:bg-outline-variant/20 transition-colors">取消</button>
              <button onClick={() => { dispatch({ type: 'DELETE_OUTFIT', outfitId: deleteConfirm }); setDeleteConfirm(null) }} className="px-4 py-2 bg-error text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">删除</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

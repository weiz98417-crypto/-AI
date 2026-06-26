import { useState } from 'react'
import { useAdmin } from '../store/AdminContext'
import { OUTFIT_IMAGE_POOL as IMG_POOL } from '../store/seedData'
import type { ManagedOutfit } from '../shared/types'
import ImageUploader from '../components/ImageUploader'
import Pagination from '../components/Pagination'

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

export default function OutfitsPage() {
  const { state, dispatch } = useAdmin()
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [filterOccasion, setFilterOccasion] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editPrice, setEditPrice] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'status' | ''>('')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // New outfit form state
  const [newName, setNewName] = useState('')
  const [newOccasion, setNewOccasion] = useState('work-commute')
  const [newStyleTags, setNewStyleTags] = useState<string[]>(['简约通勤'])
  const [newImages, setNewImages] = useState<string[]>([])
  const [newItems, setNewItems] = useState([{ name: '', brand: '', price: '', category: 'top' as const }])
  const perPage = 10

  const ALL_STYLE_TAGS = ['简约通勤', '优雅知性', '潮流街头', '温柔甜美', '休闲舒适', '职业精英']

  const addItem = () => setNewItems([...newItems, { name: '', brand: '', price: '', category: 'top' as const }])
  const removeItem = (i: number) => newItems.length > 1 && setNewItems(newItems.filter((_, idx) => idx !== i))
  const updateItem = (i: number, f: string, v: any) => {
    const copy = [...newItems]; (copy[i] as any)[f] = v; setNewItems(copy)
  }
  const toggleTag = (t: string) => {
    setNewStyleTags(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  const totalPrice = newItems.reduce((s, it) => s + (parseInt(it.price) || 0), 0)
  const brandSummary = newItems.filter(it => it.brand.trim()).map(it => it.brand.trim()).join(' + ') || '自定义品牌'
  const priceRange = totalPrice > 2000 ? 'luxury' as const : totalPrice > 1000 ? 'premium' as const : totalPrice > 500 ? 'mid' as const : 'budget' as const

  const handleAdd = () => {
    if (!newName.trim() || newItems.length === 0) return
    const id = `new-${Date.now()}`
    const items = newItems.filter(it => it.name.trim()).map(it => ({
      name: it.name, brand: it.brand || '品牌', price: parseInt(it.price) || 0,
      category: it.category, image: '/assets/outfits/placeholder.svg',
    }))
    const cover = newImages[0] || IMG_POOL[newOccasion]?.[0] || '/assets/outfits/work-commute-1-main.jpg'
    const outfit: ManagedOutfit = {
      id, occasion: newOccasion as ManagedOutfit['occasion'],
      name: newName.trim(), items, totalPrice, priceRange,
      styleTags: newStyleTags.length > 0 ? newStyleTags : ['简约通勤'],
      coverImage: cover, brandSummary, active: true,
    }
    dispatch({ type: 'ADD_OUTFIT', outfit })
    // Reset
    setNewName(''); setNewOccasion('work-commute'); setNewStyleTags(['简约通勤'])
    setNewImages([]); setNewItems([{ name: '', brand: '', price: '', category: 'top' as const }])
    setShowForm(false); setPage(1)
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

      {/* Add Form — Full E-commerce Style */}
      {showForm && (
        <div className="bg-surface rounded-2xl border border-primary/30 p-6 shadow-sm">
          <h3 className="text-base font-bold mb-5 text-primary flex items-center gap-2">
            <span className="w-1 h-5 bg-primary rounded-full" />
            新增穿搭方案
          </h3>

          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Left column: basic info */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-secondary mb-1 font-semibold">穿搭名称 *</label>
                <input value={newName} onChange={e => setNewName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none"
                  placeholder="如：春季知性通勤套装" />
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1 font-semibold">适用场合 *</label>
                <select value={newOccasion} onChange={e => setNewOccasion(e.target.value)}
                  className="w-full px-3 py-2.5 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none cursor-pointer">
                  <option value="work-commute">上班通勤</option>
                  <option value="client-meeting">客户会议</option>
                  <option value="weekend-date">周末约会</option>
                  <option value="girls-gathering">闺蜜聚会</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-secondary mb-1 font-semibold">风格标签</label>
                <div className="flex flex-wrap gap-1.5">
                  {ALL_STYLE_TAGS.map(t => (
                    <button key={t} onClick={() => toggleTag(t)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${newStyleTags.includes(t) ? 'bg-primary text-white shadow-sm' : 'bg-surface-container-low text-secondary hover:border-primary/40 border border-outline-variant/20'}`}
                    >{t}</button>
                  ))}
                </div>
              </div>

              {/* Preview card */}
              <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/20">
                <p className="text-[10px] text-outline uppercase font-semibold mb-2">预览摘要</p>
                <p className="text-sm font-bold">{newName || '未命名穿搭'}</p>
                <p className="text-xs text-secondary mt-0.5">{brandSummary || '暂无品牌信息'}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-base font-bold text-primary">¥{totalPrice.toLocaleString()}</span>
                  <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full">{priceRange}</span>
                </div>
              </div>
            </div>

            {/* Right column: image upload */}
            <div>
              <label className="block text-xs text-secondary mb-1 font-semibold">穿搭图片</label>
              <ImageUploader images={newImages} onChange={setNewImages} max={5} />
              <p className="text-[10px] text-outline mt-1.5">第一张为封面图。拖放排序。建议 3:4 比例。</p>
            </div>
          </div>

          {/* Items section */}
          <div className="border-t border-outline-variant/20 pt-5 mb-5">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-bold text-on-surface">搭配单品</h4>
              <button onClick={addItem}
                className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-semibold hover:bg-primary/20 transition-colors"
              >+ 添加单品</button>
            </div>
            <div className="space-y-2">
              {newItems.map((item, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center bg-surface-container-low rounded-xl p-3 border border-outline-variant/10">
                  <div className="col-span-3">
                    <input value={item.name} onChange={e => updateItem(i, 'name', e.target.value)}
                      placeholder="单品名称" className="w-full px-2 py-1.5 bg-white border border-outline-variant/30 rounded-lg text-xs focus:border-primary focus:outline-none" />
                  </div>
                  <div className="col-span-3">
                    <input value={item.brand} onChange={e => updateItem(i, 'brand', e.target.value)}
                      placeholder="品牌名" className="w-full px-2 py-1.5 bg-white border border-outline-variant/30 rounded-lg text-xs focus:border-primary focus:outline-none" />
                  </div>
                  <div className="col-span-2">
                    <input value={item.price} onChange={e => updateItem(i, 'price', e.target.value)}
                      placeholder="¥价格" type="number" className="w-full px-2 py-1.5 bg-white border border-outline-variant/30 rounded-lg text-xs focus:border-primary focus:outline-none" />
                  </div>
                  <div className="col-span-2">
                    <select value={item.category} onChange={e => updateItem(i, 'category', e.target.value)}
                      className="w-full px-2 py-1.5 bg-white border border-outline-variant/30 rounded-lg text-xs focus:border-primary focus:outline-none cursor-pointer">
                      <option value="top">上衣</option>
                      <option value="bottom">下装</option>
                      <option value="outerwear">外套</option>
                      <option value="dress">连衣裙</option>
                      <option value="shoes">鞋履</option>
                      <option value="accessory">配饰</option>
                    </select>
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <button onClick={() => removeItem(i)} disabled={newItems.length === 1}
                      className="px-2 py-1 text-xs text-error/60 hover:text-error disabled:opacity-20 transition-colors">移除</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowForm(false)}
              className="px-6 py-2.5 bg-surface-container text-on-surface rounded-lg text-sm font-semibold hover:bg-outline-variant/20 transition-colors">取消</button>
            <button onClick={handleAdd}
              disabled={!newName.trim() || newItems.every(it => !it.name.trim())}
              className="px-8 py-2.5 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-40 transition-opacity shadow-sm">
              确认上架
            </button>
          </div>
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
        <div className="px-6 py-4 border-t border-outline-variant/10 bg-surface-container-low">
          <Pagination page={page} total={total} perPage={perPage} onChange={setPage} />
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

import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../store/AdminContext'

export default function AdminTopBar() {
  const { state } = useAdmin()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const q = query.toLowerCase().trim()
  const matchedOutfits = q ? state.managedOutfits.filter(o =>
    o.name.toLowerCase().includes(q) || o.brandSummary.toLowerCase().includes(q) || o.styleTags.some(t => t.includes(q))
  ).slice(0, 5) : []

  const matchedActivities = q ? state.activities.filter(a =>
    a.name.toLowerCase().includes(q) || a.action.toLowerCase().includes(q)
  ).slice(0, 3) : []

  const matchedMetrics = q ? [
    { label: 'Today Revenue', value: '¥' + state.metrics.todayRevenue.toLocaleString(), nav: '/' },
    { label: 'Active Users', value: String(state.metrics.activeUsers), nav: '/analytics' },
    { label: 'Total Outfits', value: String(state.managedOutfits.length), nav: '/outfits' },
  ].filter(m => m.label.toLowerCase().includes(q) || m.value.includes(q)) : []

  const hasResults = matchedOutfits.length > 0 || matchedActivities.length > 0 || matchedMetrics.length > 0

  return (
    <header className="fixed top-0 right-0 left-[260px] h-16 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 flex justify-between items-center px-8 z-40">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full group" ref={ref}>
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm pointer-events-none select-none">⌕</span>
          <input
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all placeholder:text-outline/60 focus:shadow-lg focus:shadow-primary/5"
            placeholder="搜索穿搭、用户、数据..."
            type="text"
            value={query}
            onChange={e => { setQuery(e.target.value); setOpen(true) }}
            onFocus={() => query && setOpen(true)}
          />

          {/* Dropdown */}
          {open && query && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-surface rounded-2xl border border-outline-variant/20 shadow-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
              {!hasResults && (
                <div className="p-6 text-center text-sm text-secondary">未找到匹配结果</div>
              )}

              {matchedOutfits.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-[10px] text-outline font-semibold uppercase tracking-widest bg-surface-container-low">穿搭内容</div>
                  {matchedOutfits.map(o => (
                    <button
                      key={o.id}
                      onClick={() => { navigate('/outfits'); setOpen(false); setQuery('') }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container-low transition-colors text-left"
                    >
                      <div className="w-8 h-10 rounded bg-surface-container overflow-hidden shrink-0">
                        <img src={o.coverImage} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-on-surface truncate">{o.name}</p>
                        <p className="text-[10px] text-secondary truncate">{o.brandSummary}</p>
                      </div>
                      <span className={`text-[10px] font-semibold shrink-0 ${o.active ? 'text-green-600' : 'text-outline'}`}>{o.active ? '已上架' : '已下架'}</span>
                    </button>
                  ))}
                </div>
              )}

              {matchedActivities.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-[10px] text-outline font-semibold uppercase tracking-widest bg-surface-container-low border-t border-outline-variant/10">用户活动</div>
                  {matchedActivities.map((a, i) => (
                    <button
                      key={i}
                      onClick={() => { navigate('/'); setOpen(false); setQuery('') }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container-low transition-colors text-left"
                    >
                      <div className="w-8 h-8 rounded-full bg-primary-container/30 border border-outline-variant/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                        {a.name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-on-surface truncate">{a.name}</p>
                        <p className="text-[10px] text-secondary truncate">{a.action}</p>
                      </div>
                      <span className="text-[10px] text-outline shrink-0">{a.time}</span>
                    </button>
                  ))}
                </div>
              )}

              {matchedMetrics.length > 0 && (
                <div>
                  <div className="px-4 py-2 text-[10px] text-outline font-semibold uppercase tracking-widest bg-surface-container-low border-t border-outline-variant/10">数据指标</div>
                  {matchedMetrics.map(m => (
                    <button
                      key={m.label}
                      onClick={() => { navigate(m.nav); setOpen(false); setQuery('') }}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-surface-container-low transition-colors text-left"
                    >
                      <span className="text-sm text-on-surface">{m.label}</span>
                      <span className="text-sm font-bold text-primary">{m.value}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center cursor-pointer transition-all hover:shadow-sm relative"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2a2.5 2.5 0 0 0-1 4.8V9l-2 3h6l-2-3V6.8A2.5 2.5 0 0 0 8 2z" stroke="#615d5f" strokeWidth="1.2" strokeLinecap="round"/><circle cx="12" cy="4" r="2.5" fill="#ba1a1a" stroke="white" strokeWidth="0.5"/></svg>
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-surface rounded-2xl border border-outline-variant/20 shadow-2xl overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-outline-variant/10 flex justify-between items-center">
                <h3 className="text-sm font-bold">消息通知</h3>
                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold">3 条未读</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {[
                  { title: '新用户激增', body: '今日新增 128 位注册用户，较昨日增长 42%', time: '5分钟前', dot: true, nav: '/users' },
                  { title: '库存预警', body: '「知性通勤套装」即将售罄，建议补充库存', time: '1小时前', dot: true, nav: '/outfits' },
                  { title: '系统通知', body: 'DeepSeek API 调用量已达本月配额的 80%', time: '3小时前', dot: true, nav: '/settings' },
                  { title: '订单完成', body: '用户 Sophie Chen 已完成一笔 ¥2,198 的订单', time: '昨天', dot: false, nav: '/orders' },
                  { title: '数据报告', body: '本周用户活跃度报告已生成', time: '昨天', dot: false, nav: '/' },
                  { title: '退款申请', body: '用户 Tom Huang 申请退款「轻松休闲办公」', time: '2天前', dot: false, nav: '/orders' },
                  { title: '内容审核', body: '3 套新穿搭已通过自动审核，已上架', time: '2天前', dot: false, nav: '/outfits' },
                  { title: '活动提醒', body: '本月用户分享率提升 15%，推荐优化分享功能', time: '3天前', dot: false, nav: '/activities' },
                ].map((n, i) => (
                  <div key={i} onClick={() => { navigate(n.nav || '/'); setNotifOpen(false) }} className="px-4 py-3 hover:bg-surface-container-low transition-colors cursor-pointer border-b border-outline-variant/5">
                    <div className="flex items-center gap-2 mb-0.5">
                      {n.dot && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
                      <span className="text-sm font-semibold">{n.title}</span>
                    </div>
                    <p className="text-xs text-secondary ml-4">{n.body}</p>
                    <span className="text-[10px] text-outline ml-4 mt-1 inline-block">{n.time}</span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-outline-variant/10 text-center">
                <button className="text-xs text-primary font-semibold hover:underline">查看全部通知</button>
              </div>
            </div>
          )}
        </div>
        <div className="w-px h-6 bg-outline-variant/30 mx-1" />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-semibold text-on-surface leading-none">管理员</p>
            <p className="text-[10px] text-secondary">Super Admin</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-container/40 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            A
          </div>
        </div>
      </div>
    </header>
  )
}

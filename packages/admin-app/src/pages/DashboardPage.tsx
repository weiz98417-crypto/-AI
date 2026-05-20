import { useAdmin } from '../store/AdminContext'

const METRICS = [
  { label: '总营收', value: '¥124,500', icon: '💰', change: '+12%', up: true },
  { label: '活跃用户', value: '8,420', icon: '👥', change: '+5%', up: true },
  { label: '推荐点击率', value: '18.5%', icon: '📈', change: '+2.4%', up: true },
  { label: '转化率', value: '4.2%', icon: '🛒', change: '-0.5%', up: false },
]

const ACTIVITIES = [
  { name: 'Sophie Chen', action: '收藏了 "知性通勤套装"', time: '2分钟前' },
  { name: 'Marco Rossi', action: '开通了高级会员', time: '15分钟前' },
  { name: 'Julia Zhang', action: '通过微信分享了一套穿搭', time: '32分钟前' },
  { name: 'Leo Kim', action: '更新了身材测量数据', time: '1小时前' },
  { name: 'Emma Wang', action: '通过 "上班通勤" 链接下单', time: '2小时前' },
]

const CHART_DAYS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
const CHART_VALUES = [60, 75, 55, 80, 70, 90, 65]
const maxVal = Math.max(...CHART_VALUES)

export default function DashboardPage() {
  const { state } = useAdmin()

  if (state.loading) {
    return (
      <div>
        <div className="grid grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((i) => <div key={i} className="bg-surface rounded-2xl h-32 animate-pulse" />)}
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 bg-surface rounded-3xl h-96 animate-pulse" />
          <div className="col-span-4 bg-surface rounded-3xl h-96 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {METRICS.map((m) => (
          <div key={m.label} className="bg-white/70 backdrop-blur-sm border border-primary-container/20 p-6 rounded-2xl hover:border-primary/40 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <span className="p-2 bg-primary-container/20 text-primary rounded-lg text-lg">{m.icon}</span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${m.up ? 'text-green-600 bg-green-50' : 'text-red-500 bg-red-50'}`}>
                {m.change}
              </span>
            </div>
            <p className="text-xs text-secondary font-semibold uppercase tracking-wider mb-1">{m.label}</p>
            <p className="text-2xl font-bold text-on-surface">{m.value}</p>
          </div>
        ))}
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Chart */}
        <div className="col-span-12 lg:col-span-8 bg-white/70 backdrop-blur-sm border border-primary-container/20 rounded-3xl p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-semibold text-on-surface">穿搭热度趋势</h2>
              <p className="text-sm text-secondary mt-1">AI推荐穿搭的用户互动数据</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-1.5 bg-surface-container rounded-full text-xs text-on-surface-variant">每日</button>
              <button className="px-4 py-1.5 bg-primary text-white rounded-full text-xs shadow-sm">每周</button>
            </div>
          </div>

          {/* SVG Chart */}
          <div className="h-64 relative">
            <svg className="w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line key={i} x1="0" y1={i * 50} x2="700" y2={i * 50} stroke="#e9e0e1" strokeWidth="0.5" />
              ))}
              {/* Area fill */}
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#E8A0B9" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#E8A0B9" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d={`M0,${200 - (CHART_VALUES[0] / maxVal) * 180} ${CHART_VALUES.map((v, i) => {
                  const x = (i / (CHART_VALUES.length - 1)) * 700
                  const y = 200 - (v / maxVal) * 180
                  return `L${x},${y}`
                }).join(' ')} L700,200 L0,200 Z`}
                fill="url(#areaGrad)"
              />
              {/* Line */}
              <path
                d={`M0,${200 - (CHART_VALUES[0] / maxVal) * 180} ${CHART_VALUES.map((v, i) => {
                  const x = (i / (CHART_VALUES.length - 1)) * 700
                  const y = 200 - (v / maxVal) * 180
                  return `L${x},${y}`
                }).join(' ')}`}
                fill="none" stroke="#874c63" strokeWidth="3" strokeLinecap="round"
              />
              {/* Dots */}
              {CHART_VALUES.map((v, i) => {
                const x = (i / (CHART_VALUES.length - 1)) * 700
                const y = 200 - (v / maxVal) * 180
                return <circle key={i} cx={x} cy={y} r="5" fill="#874c63" stroke="white" strokeWidth="2" />
              })}
              {/* Y-axis labels */}
              {[0, 25, 50, 75, 100].map((v, i) => (
                <text key={i} x="10" y={10 + i * 45} fill="#837377" fontSize="10">{v}%</text>
              ))}
            </svg>
          </div>
          <div className="flex justify-between mt-2 text-[11px] text-outline font-semibold border-t border-outline-variant/10 pt-3">
            {CHART_DAYS.map((d) => <span key={d}>{d}</span>)}
          </div>
        </div>

        {/* Activity */}
        <div className="col-span-12 lg:col-span-4 bg-white/70 backdrop-blur-sm border border-primary-container/20 rounded-3xl flex flex-col">
          <div className="p-6 border-b border-outline-variant/10">
            <h2 className="text-xl font-semibold text-on-surface">最近动态</h2>
            <p className="text-sm text-secondary mt-1">实时用户互动记录</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {ACTIVITIES.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-container-low transition-colors">
                <div className="w-9 h-9 rounded-full bg-primary-container/30 border border-outline-variant/20 flex items-center justify-center text-sm shrink-0">
                  {a.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface truncate">{a.name}</p>
                  <p className="text-xs text-secondary truncate">{a.action}</p>
                </div>
                <span className="text-[10px] text-outline font-semibold shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-outline-variant/10">
            <button className="w-full text-primary text-xs font-semibold hover:underline">查看全部动态 →</button>
          </div>
        </div>
      </div>
    </div>
  )
}

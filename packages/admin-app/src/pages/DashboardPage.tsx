import { useState } from 'react'
import { useAdmin } from '../store/AdminContext'

const METRIC_CONFIGS = [
  { label: 'Total Revenue', key: 'todayRevenue' as const, prefix: '¥', format: 'currency' },
  { label: 'Active Users', key: 'activeUsers' as const, prefix: '', format: 'number' },
  { label: 'Recommendation CTR', key: 'orderCount' as const, prefix: '', format: 'pct' },
  { label: 'Conversion Rate', key: 'favoriteCount' as const, prefix: '', format: 'number' },
]

function formatValue(val: number, format: string): string {
  if (format === 'currency') return '¥' + val.toLocaleString()
  if (format === 'pct') return (val / 10).toFixed(1) + '%'
  return val.toLocaleString()
}

const TREND_META: Record<string, { change: string; up: boolean }> = {
  todayRevenue: { change: '+12%', up: true },
  activeUsers: { change: '+5%', up: true },
  orderCount: { change: '+2.4%', up: true },
  favoriteCount: { change: '-0.5%', up: false },
}

export default function DashboardPage() {
  const { state, dispatch } = useAdmin()
  const [dateRange, setDateRange] = useState('7d')

  // Simulate date-range multipliers
  const multiplier = dateRange === '30d' ? 4.2 : dateRange === '90d' ? 12.5 : 1

  const handleExportCSV = () => {
    const rows = [
      ['Metric', 'Value', 'Change'],
      ...METRIC_CONFIGS.map(m => {
        const val = state.metrics[m.key] as number
        const trend = TREND_META[m.key]
        return [m.label, String(m.prefix + formatValue(Math.round(val * multiplier), m.format)), trend.change]
      }),
    ]
    const csv = rows.map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `dashboard-${dateRange}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  if (state.loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <div key={i} className="glass-card rounded-2xl h-32 animate-pulse" />)}
        </div>
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-8 glass-card rounded-3xl h-96 animate-pulse" />
          <div className="col-span-4 glass-card rounded-3xl h-96 animate-pulse" />
        </div>
      </div>
    )
  }

  const maxVal = Math.max(...state.chartData, 1)

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header with date range + export */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-[28px] font-bold text-on-surface">数据看板</h2>
          <p className="text-sm text-secondary mt-1">核心运营指标概览</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="px-4 py-2 bg-surface border border-outline-variant/40 rounded-lg text-xs text-secondary cursor-pointer"
          >
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="90d">最近90天</option>
          </select>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-surface border border-outline-variant/40 rounded-lg text-xs text-secondary hover:border-primary hover:text-primary transition-all font-semibold"
          >
            Export CSV
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-container">
        {METRIC_CONFIGS.map((m) => {
          const val = state.metrics[m.key] as number
          const trend = TREND_META[m.key]
          return (
            <div key={m.label} className="glass-card p-6 rounded-2xl flex flex-col gap-2 group hover:border-primary/40 cursor-default">
              <div className="flex justify-between items-start">
                <span className={`p-2 rounded-lg text-lg transition-transform group-hover:scale-110 ${
                  trend.up ? 'bg-primary-container/20 text-primary shadow-sm shadow-primary/10' : 'bg-error-container/30 text-error shadow-sm shadow-error/10'
                }`}>
                  {trend.up ? '↑' : '↓'}
                </span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full transition-all group-hover:scale-105 ${
                  trend.up ? 'text-green-600 bg-green-50' : 'text-error bg-error-container/30'
                }`}>
                  {trend.change}
                </span>
              </div>
              <div>
                <p className="text-secondary font-semibold text-xs uppercase tracking-wider">{m.label}</p>
                <h3 className="text-2xl font-semibold text-on-surface mt-1 group-hover:text-primary transition-colors">{m.prefix}{formatValue(Math.round(val * multiplier), m.format)}</h3>
              </div>
            </div>
          )
        })}
      </section>

      {/* Bento Grid */}
      <div className="grid grid-cols-12 gap-8">
        {/* Chart + Sub Cards */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Chart */}
          <div className="glass-card rounded-3xl p-8 overflow-hidden relative group">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-xl font-semibold text-on-surface">Real-time Outfit Popularity</h2>
                <p className="text-sm text-secondary mt-1">Engagement metrics across top AI-generated styles</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => dispatch({ type: 'SET_CHART_PERIOD', period: 'daily' })}
                  className={`px-4 py-2 rounded-full text-xs transition-colors ${
                    state.chartPeriod === 'daily'
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface-container text-on-surface-variant hover:bg-outline-variant/30'
                  }`}
                >Daily</button>
                <button
                  onClick={() => dispatch({ type: 'SET_CHART_PERIOD', period: 'weekly' })}
                  className={`px-4 py-2 rounded-full text-xs transition-colors ${
                    state.chartPeriod === 'weekly'
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-surface-container text-on-surface-variant hover:bg-outline-variant/30'
                  }`}
                >Weekly</button>
              </div>
            </div>

            <div className="h-64 w-full relative">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                {[100, 75, 50, 25, 0].map((v, i) => (
                  <text key={i} x="0" y={12 + i * 45} fill="#837377" fontSize="10" fontWeight="600">{v}%</text>
                ))}
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E8A0B9" />
                    <stop offset="100%" stopColor="#E8A0B9" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {/* Area */}
                <path
                  d={`M0,${200 - (state.chartData[0] / maxVal) * 180} ${state.chartData.map((v, i) => `L${(i / (state.chartData.length - 1)) * 700},${200 - (v / maxVal) * 180}`).join(' ')} L700,200 L0,200 Z`}
                  fill="url(#chartGrad)" opacity="0.3"
                />
                {/* Line */}
                <path
                  d={`M0,${200 - (state.chartData[0] / maxVal) * 180} ${state.chartData.map((v, i) => `L${(i / (state.chartData.length - 1)) * 700},${200 - (v / maxVal) * 180}`).join(' ')}`}
                  fill="none" stroke="#E8A0B9" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray="1000" strokeDashoffset="1000" className="chart-line"
                >
                  <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="1.2s" begin="0.2s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1" />
                </path>
                {/* Dots */}
                {state.chartData.map((v, i) => (
                  <circle key={i} cx={(i / (state.chartData.length - 1)) * 700} cy={200 - (v / maxVal) * 180} r="6" fill="#874C63" stroke="white" strokeWidth="2" opacity="1" />
                ))}
              </svg>
            </div>

            {/* Day labels */}
            <div className="flex justify-between mt-4 text-xs text-outline font-semibold border-t border-outline-variant/10 pt-4">
              {state.chartDays.map(d => <span key={d}>{d}</span>)}
            </div>
          </div>

          {/* Sub Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {state.trending.map((item, i) => (
              <div key={i} className="glass-card p-6 rounded-2xl flex items-center gap-6 group cursor-default">
                <div className={`w-20 h-20 rounded-xl border border-outline-variant/20 flex items-center justify-center text-2xl font-bold shrink-0 transition-all group-hover:scale-110 group-hover:shadow-lg ${
                  i === 0 ? 'bg-primary-container/20 text-primary group-hover:shadow-primary/10' : 'bg-tertiary-container/30 text-tertiary group-hover:shadow-tertiary/10'
                }`}>
                  {item.name[0]}
                </div>
                <div>
                  <span className={`text-xs uppercase font-semibold ${i === 0 ? 'text-primary' : 'text-tertiary'}`}>{item.label}</span>
                  <h4 className={`text-lg font-semibold text-on-surface mt-0.5 transition-colors ${i === 0 ? 'group-hover:text-primary' : 'group-hover:text-tertiary'}`}>{item.name}</h4>
                  <p className="text-sm text-secondary mt-0.5">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity List */}
        <div className="col-span-12 lg:col-span-4 h-full">
          <div className="glass-card rounded-3xl h-full flex flex-col">
            <div className="p-8 border-b border-outline-variant/10">
              <h2 className="text-xl font-semibold text-on-surface">Recent User Activity</h2>
              <p className="text-sm text-secondary mt-1">Real-time engagement log</p>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2 stagger-container">
              {state.activities.map((a, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-surface-container-low transition-all group cursor-default hover:shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-primary-container/30 border border-outline-variant/20 flex items-center justify-center text-xs font-bold text-primary shrink-0 group-hover:scale-110 transition-transform">
                    {a.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-on-surface truncate group-hover:text-primary transition-colors">{a.name}</p>
                    <p className="text-xs text-secondary truncate">{a.action}</p>
                  </div>
                  <span className="text-[10px] text-outline font-semibold shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
            <div className="p-6 border-t border-outline-variant/10">
              <button
                onClick={() => dispatch({ type: 'SET_CHART_PERIOD', period: state.chartPeriod })}
                className="w-full text-primary text-xs font-semibold hover:underline transition-all"
              >View All Activity Logs — {state.activities.length} entries</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

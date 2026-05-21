import { useAdmin } from '../store/AdminContext'

const METRICS = [
  { label: 'Total Revenue', value: '¥124,500', change: '+12%', up: true },
  { label: 'Active Users', value: '8,420', change: '+5%', up: true },
  { label: 'Recommendation CTR', value: '18.5%', change: '+2.4%', up: true },
  { label: 'Conversion Rate', value: '4.2%', change: '-0.5%', up: false },
]

const ACTIVITIES = [
  { name: 'Sophie Chen', action: 'Saved "Pink Pastel Bliss" outfit', time: '2m ago' },
  { name: 'Marco Rossi', action: 'Applied for premium membership', time: '15m ago' },
  { name: 'Julia Zhang', action: 'Shared a recommendation via WeChat', time: '32m ago' },
  { name: 'Leo Kim', action: 'Updated profile measurement data', time: '1h ago' },
  { name: 'Emma Watson', action: 'Purchased through "Office Chic" link', time: '2h ago' },
]

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const VALUES = [60, 75, 55, 80, 70, 90, 65]
const maxVal = Math.max(...VALUES)

export default function DashboardPage() {
  const { state } = useAdmin()

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

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* KPI Cards Row */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-container">
        {METRICS.map((m) => (
          <div key={m.label} className="glass-card p-6 rounded-2xl flex flex-col gap-2 group hover:border-primary/40 cursor-default">
            <div className="flex justify-between items-start">
              <span className={`p-2 rounded-lg text-lg transition-transform group-hover:scale-110 ${
                m.up ? 'bg-primary-container/20 text-primary shadow-sm shadow-primary/10' : 'bg-error-container/30 text-error shadow-sm shadow-error/10'
              }`}>
                {m.up ? '↑' : '↓'}
              </span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full transition-all group-hover:scale-105 ${
                m.up ? 'text-green-600 bg-green-50' : 'text-error bg-error-container/30'
              }`}>
                {m.change}
              </span>
            </div>
            <div>
              <p className="text-secondary font-semibold text-xs uppercase tracking-wider">{m.label}</p>
              <h3 className="text-2xl font-semibold text-on-surface mt-1 group-hover:text-primary transition-colors">{m.value}</h3>
            </div>
          </div>
        ))}
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
                <button className="px-4 py-2 bg-surface-container rounded-full text-xs text-on-surface-variant hover:bg-outline-variant/30 transition-colors">Daily</button>
                <button className="px-4 py-2 bg-primary text-white rounded-full text-xs shadow-sm">Weekly</button>
              </div>
            </div>

            <div className="h-64 w-full relative">
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 700 200" preserveAspectRatio="none">
                {/* Y-axis labels */}
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
                  d={`M0,${200 - (VALUES[0] / maxVal) * 180} ${VALUES.map((v, i) => `L${(i / (VALUES.length - 1)) * 700},${200 - (v / maxVal) * 180}`).join(' ')} L700,200 L0,200 Z`}
                  fill="url(#chartGrad)" opacity="0" className="chart-area"
                >
                  <animate attributeName="opacity" from="0" to="0.3" dur="0.8s" begin="0.3s" fill="freeze" />
                </path>
                {/* Line */}
                <path
                  d={`M0,${200 - (VALUES[0] / maxVal) * 180} ${VALUES.map((v, i) => `L${(i / (VALUES.length - 1)) * 700},${200 - (v / maxVal) * 180}`).join(' ')}`}
                  fill="none" stroke="#E8A0B9" strokeWidth="4" strokeLinecap="round"
                  strokeDasharray="1000" strokeDashoffset="1000" className="chart-line"
                >
                  <animate attributeName="stroke-dashoffset" from="1000" to="0" dur="1.2s" begin="0.2s" fill="freeze" calcMode="spline" keySplines="0.25 0.1 0.25 1" />
                </path>
                {/* Dots */}
                {VALUES.map((v, i) => (
                  <circle key={i} cx={(i / (VALUES.length - 1)) * 700} cy={200 - (v / maxVal) * 180} r="0" fill="#874C63" stroke="white" strokeWidth="2" opacity="0">
                    <animate attributeName="r" from="0" to="6" dur="0.4s" begin={`${0.8 + i * 0.1}s`} fill="freeze" calcMode="spline" keySplines="0.175 0.885 0.32 1.275" />
                    <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin={`${0.8 + i * 0.1}s`} fill="freeze" />
                  </circle>
                ))}
              </svg>
            </div>

            {/* Day labels */}
            <div className="flex justify-between mt-4 text-xs text-outline font-semibold border-t border-outline-variant/10 pt-4">
              {DAYS.map(d => <span key={d}>{d}</span>)}
            </div>
          </div>

          {/* Sub Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl flex items-center gap-6 group cursor-default">
              <div className="w-20 h-20 rounded-xl bg-primary-container/20 border border-outline-variant/20 flex items-center justify-center text-primary text-2xl font-bold shrink-0 transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-primary/10">
                T
              </div>
              <div>
                <span className="text-xs text-primary uppercase font-semibold">Trending Now</span>
                <h4 className="text-lg font-semibold text-on-surface mt-0.5 group-hover:text-primary transition-colors">Spring Minimalist</h4>
                <p className="text-sm text-secondary mt-0.5">2.4k saves this hour</p>
              </div>
            </div>
            <div className="glass-card p-6 rounded-2xl flex items-center gap-6 group cursor-default">
              <div className="w-20 h-20 rounded-xl bg-tertiary-container/30 border border-outline-variant/20 flex items-center justify-center text-tertiary text-2xl font-bold shrink-0 transition-all group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-tertiary/10">
                R
              </div>
              <div>
                <span className="text-xs text-tertiary uppercase font-semibold">Rising Star</span>
                <h4 className="text-lg font-semibold text-on-surface mt-0.5 group-hover:text-tertiary transition-colors">Urban Silk Path</h4>
                <p className="text-sm text-secondary mt-0.5">1.1k saves this hour</p>
              </div>
            </div>
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
              {ACTIVITIES.map((a, i) => (
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
              <button className="w-full text-primary text-xs font-semibold hover:underline transition-all">View All Activity Logs</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

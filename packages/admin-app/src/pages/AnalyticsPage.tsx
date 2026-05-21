import { useAdmin } from '../store/AdminContext'

const STYLE_BARS = [
  { name: '简约通勤', pct: 42, color: 'bg-primary-container' },
  { name: '优雅知性', pct: 28, color: 'bg-primary' },
  { name: '波西米亚', pct: 18, color: 'bg-tertiary-container' },
  { name: '街头轻奢', pct: 12, color: 'bg-secondary-container' },
]

const COLORS = [
  { name: '珊瑚粉', hex: '#E8A0B9', pct: 35 },
  { name: '天蓝色', hex: '#A0BEE8', pct: 24 },
  { name: '灰绿色', hex: '#D4E2D4', pct: 19 },
  { name: '午夜黑', hex: '#342F30', pct: 15 },
]

const COHORTS = [
  { label: '8月1日', values: [100, 82, 75, 68, 52, 48, 41, 35] },
  { label: '8月8日', values: [100, 85, 78, 72, 64, 59, 55, null] },
  { label: '8月15日', values: [100, 88, 81, 76, 69, 65, null, null] },
]

export default function AnalyticsPage() {
  const { state } = useAdmin()

  if (state.loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-surface rounded animate-pulse mb-2" />
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8 bg-surface rounded-3xl h-80 animate-pulse" />
          <div className="col-span-4 bg-surface rounded-3xl h-80 animate-pulse" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <header className="mb-6">
        <h2 className="text-[32px] font-bold text-primary mb-1">用户偏好分析</h2>
        <p className="text-sm text-secondary">深入了解用户的风格偏好与留存数据</p>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Style Bars */}
        <div className="col-span-12 lg:col-span-8 bg-white/70 backdrop-blur-sm border border-primary-container/20 rounded-3xl p-8 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
              热门风格
            </h3>
            <select className="bg-surface border border-outline-variant/30 rounded-lg text-xs py-1.5 px-3">
              <option>最近30天</option>
              <option>最近90天</option>
            </select>
          </div>
          <div className="space-y-5">
            {STYLE_BARS.map((bar) => (
              <div key={bar.name} className="space-y-1.5">
                <div className="flex justify-between text-xs text-secondary font-semibold">
                  <span>{bar.name}</span>
                  <span className="text-primary font-bold">{bar.pct}%</span>
                </div>
                <div className="h-9 bg-surface-container rounded-full overflow-hidden flex items-center px-1">
                  <div
                    className={`h-7 ${bar.color} rounded-full transition-all duration-1000`}
                    style={{ width: `${bar.pct}%`, minWidth: bar.pct > 0 ? '30px' : '0' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trending Colors */}
        <div className="col-span-12 lg:col-span-4 bg-white/70 backdrop-blur-sm border border-primary-container/20 rounded-3xl p-8 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
          <h3 className="text-xl font-semibold text-primary mb-8">流行色系</h3>
          <div className="flex flex-col gap-5">
            {COLORS.map((c) => (
              <div key={c.name} className="flex items-center gap-4 group cursor-default">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 shrink-0 animate-scale-in"
                  style={{ backgroundColor: c.hex, boxShadow: `0 4px 16px ${c.hex}55` }}
                >
                  <span className={`text-xs font-bold ${c.hex === '#342F30' || c.hex === '#874C63' ? 'text-white' : 'text-on-surface'}`}>
                    {c.pct}%
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">{c.name}</p>
                  <p className="text-xs text-secondary">{c.hex}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-6 border-t border-outline-variant/20">
            <div className="p-4 bg-surface-container rounded-2xl">
              <p className="text-xs text-primary font-bold mb-1">风格洞察</p>
              <p className="text-sm text-secondary">用户本周偏爱高对比度配色，建议推荐更多午夜黑搭配方案。</p>
            </div>
          </div>
        </div>

        {/* Retention Cohort */}
        <div className="col-span-12 bg-white/70 backdrop-blur-sm border border-primary-container/20 rounded-3xl p-8 hover:shadow-lg hover:border-primary/30 transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <div>
              <h3 className="text-xl font-semibold text-primary">用户留存分析</h3>
              <p className="text-sm text-secondary">按周获客队列的留存率</p>
            </div>
            <div className="flex gap-3">
              <span className="flex items-center gap-1 text-xs text-secondary"><div className="w-3 h-3 bg-primary rounded-sm" /> 高</span>
              <span className="flex items-center gap-1 text-xs text-secondary"><div className="w-3 h-3 bg-primary/40 rounded-sm" /> 中</span>
              <span className="flex items-center gap-1 text-xs text-secondary"><div className="w-3 h-3 bg-surface-container rounded-sm" /> 低</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[700px]">
              {/* Header */}
              <div className="grid grid-cols-9 gap-1 mb-2">
                <div className="text-xs text-secondary font-semibold px-2">队列</div>
                {['第0周', '第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周'].map((w) => (
                  <div key={w} className="text-xs text-secondary font-semibold text-center">{w}</div>
                ))}
              </div>

              {/* Rows */}
              <div className="space-y-1">
                {COHORTS.map((cohort, ri) => (
                  <div key={ri} className="grid grid-cols-9 gap-1">
                    <div className="bg-surface px-3 py-2 rounded-lg text-xs text-primary font-semibold border border-outline-variant/10">
                      {cohort.label}
                    </div>
                    {cohort.values.map((v, ci) => {
                      if (v === null) return <div key={ci} className="bg-surface-container text-on-surface/30 text-center py-2 rounded-lg text-xs">--</div>
                      const alpha = 1 - (ci * 0.08)
                      return (
                        <div
                          key={ci}
                          className="text-white text-center py-2 rounded-lg text-xs font-semibold transition-transform hover:scale-105 hover:z-10 hover:shadow-md cursor-default"
                          style={{ backgroundColor: `rgba(135,76,99,${Math.max(0.15, alpha)})` }}
                        >{v}%</div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insight cards */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="bg-surface p-5 rounded-2xl border border-outline-variant/20 hover:border-primary/30 hover:shadow-md transition-all cursor-default">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><span className="w-3 h-3 rounded-sm bg-primary inline-block" /></div>
                <h4 className="text-sm font-semibold">转化率</h4>
              </div>
              <p className="text-2xl font-bold">12.4%</p>
              <p className="text-xs text-green-600 font-semibold mt-1">↑ +2.4% 较上周</p>
            </div>
            <div className="bg-surface p-5 rounded-2xl border border-outline-variant/20 hover:border-primary/30 hover:shadow-md transition-all cursor-default">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-tertiary/10 flex items-center justify-center"><span className="w-3 h-3 rounded-sm bg-tertiary inline-block" /></div>
                <h4 className="text-sm font-semibold">活跃用户</h4>
              </div>
              <p className="text-2xl font-bold">1,842</p>
              <p className="text-xs text-secondary mt-1">12分钟前更新</p>
            </div>
            <div className="bg-surface p-5 rounded-2xl border border-outline-variant/20 hover:border-primary/30 hover:shadow-md transition-all cursor-default">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center"><span className="w-3 h-3 rounded-sm bg-secondary inline-block" /></div>
                <h4 className="text-sm font-semibold">用户满意度</h4>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-3 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary-container rounded-full" style={{ width: '88%' }} />
                </div>
                <span className="text-sm font-bold text-primary">88%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

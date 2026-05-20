import { useAdmin } from '../store/AdminContext'
import MetricCard from '../components/MetricCard'

export default function DashboardPage() {
  const { state, dispatch } = useAdmin()

  if (state.loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-8">数据Dashboard</h1>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface rounded-2xl h-32 animate-pulse" />
          ))}
        </div>
        <div className="bg-surface rounded-2xl h-48 animate-pulse" />
      </div>
    )
  }

  const { metrics } = state

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">数据Dashboard</h1>

      {metrics.activeUsers === 0 && metrics.orderCount === 0 ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">bar_chart</span>
          <p className="text-on-surface-variant mb-4">暂无数据指标</p>
          <button
            onClick={() => dispatch({ type: 'SET_LOADING', loading: true })}
            className="px-6 py-2 bg-primary text-on-primary rounded-full text-sm"
          >
            刷新数据
          </button>
        </div>
      ) : (
        <>
          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <MetricCard label="今日营收" value={`¥${metrics.todayRevenue.toLocaleString()}`} icon="payments" trend="较昨日 +12%" />
            <MetricCard label="活跃用户" value={metrics.activeUsers} icon="group" trend="较昨日 +8%" />
            <MetricCard label="订单量" value={metrics.orderCount} icon="shopping_bag" trend="较昨日 +5%" />
            <MetricCard label="收藏数" value={metrics.favoriteCount} icon="favorite" trend="较昨日 +15%" />
          </div>

          {/* Top Occasions */}
          <div className="bg-surface rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">热门场合排行</h2>
            <div className="space-y-3">
              {metrics.topOccasions.map((occ, idx) => (
                <div key={occ.name} className="flex items-center gap-3">
                  <span className="text-2xl font-extrabold text-primary w-8">{idx + 1}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium text-sm">{occ.name}</span>
                      <span className="text-sm text-on-surface-variant">{occ.count}%</span>
                    </div>
                    <div className="h-2 bg-surface-container rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${occ.count}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

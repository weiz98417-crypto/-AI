import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { useAdmin } from '../store/AdminContext'

const PIE_COLORS = ['#874c63', '#e8a0b9', '#fcb2cb', '#ffd9e4']
const BAR_COLOR = '#874c63'

export default function AnalyticsPage() {
  const { state } = useAdmin()

  if (state.loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-8">用户偏好分析</h1>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-surface rounded-2xl h-80 animate-pulse" />
          <div className="bg-surface rounded-2xl h-80 animate-pulse" />
        </div>
      </div>
    )
  }

  const { analytics } = state
  const isEmpty = analytics.styleDistribution.length === 0

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">用户偏好分析</h1>

      {isEmpty ? (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-6xl text-outline mb-4">donut_small</span>
          <p className="text-on-surface-variant">暂无偏好分析数据</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Style Distribution Pie Chart */}
          <div className="bg-surface rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">风格偏好分布</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.styleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={110}
                  paddingAngle={4}
                  dataKey="value"
                  nameKey="name"
                  label={({ name, value }) => `${name} ${value}%`}
                >
                  {analytics.styleDistribution.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Color Preferences Bar Chart */}
          <div className="bg-surface rounded-2xl p-6 shadow-sm">
            <h2 className="font-semibold mb-4">颜色偏好</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.colorPreferences} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e2e1" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#837377" />
                <YAxis tick={{ fontSize: 12 }} stroke="#837377" />
                <Tooltip />
                <Bar dataKey="count" fill={BAR_COLOR} radius={[8, 8, 0, 0]} name="偏好人数" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )
}

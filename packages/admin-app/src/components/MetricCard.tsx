interface Props {
  label: string
  value: string | number
  icon: string
  trend?: string
}

export default function MetricCard({ label, value, icon, trend }: Props) {
  return (
    <div className="bg-surface rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-on-surface-variant">{label}</span>
        <span className="material-symbols-outlined text-primary bg-primary-fixed rounded-lg p-2 text-xl">
          {icon}
        </span>
      </div>
      <p className="text-3xl font-extrabold">{value}</p>
      {trend && <p className="text-xs text-on-surface-variant mt-1">{trend}</p>}
    </div>
  )
}

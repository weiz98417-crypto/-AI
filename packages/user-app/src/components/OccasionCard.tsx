import type { Occasion } from '@ggai/shared/types'

interface Props {
  occasion: Occasion
  onClick: () => void
  active?: boolean
}

export default function OccasionCard({ occasion, onClick, active }: Props) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl p-5 text-left transition-all duration-200 active:scale-95 ${
        active
          ? 'bg-primary text-on-primary shadow-lg'
          : 'bg-surface-container hover:bg-surface-container-high shadow-sm'
      }`}
    >
      <span className="text-3xl block mb-2">{occasion.icon}</span>
      <p className={`font-semibold text-base ${active ? 'text-on-primary' : 'text-on-surface'}`}>
        {occasion.name}
      </p>
      <p className={`text-xs mt-1 ${active ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>
        {occasion.description}
      </p>
    </button>
  )
}

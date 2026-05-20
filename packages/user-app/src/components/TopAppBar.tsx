import { useNavigate } from 'react-router-dom'

interface Props {
  title: string
  showBack?: boolean
  rightAction?: React.ReactNode
}

export default function TopAppBar({ title, showBack = true, rightAction }: Props) {
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 w-full z-50 bg-background flex items-center justify-between px-3 h-12">
      <div className="flex items-center gap-2">
        {showBack && (
          <button onClick={() => navigate(-1)} className="active:opacity-70 transition-opacity">
            <span className="material-symbols-outlined text-primary">arrow_back_ios</span>
          </button>
        )}
      </div>
      <h1 className="text-lg font-bold text-on-surface" style={{ fontSize: '18px', lineHeight: '24px', letterSpacing: '-0.01em' }}>
        {title}
      </h1>
      <div className="w-6">{rightAction || null}</div>
    </header>
  )
}

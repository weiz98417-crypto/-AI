import { useNavigate } from 'react-router-dom'

interface Props {
  title: string
  showBack?: boolean
  rightAction?: React.ReactNode
}

export default function TopAppBar({ title, showBack = true, rightAction }: Props) {
  const navigate = useNavigate()

  return (
    <header className="fixed top-0 w-full z-50 glass-nav flex items-center justify-between px-3 h-12">
      <div className="flex items-center gap-2 w-10">
        {showBack && (
          <button onClick={() => navigate(-1)} className="active:opacity-70 text-primary text-xl">
            ←
          </button>
        )}
      </div>
      <h1 className="text-lg font-bold text-on-surface">{title}</h1>
      <div className="w-10 flex justify-end">{rightAction || null}</div>
    </header>
  )
}

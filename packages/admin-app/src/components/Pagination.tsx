export default function Pagination({ page, total, perPage, onChange }: {
  page: number; total: number; perPage: number; onChange: (p: number) => void
}) {
  const totalPages = Math.ceil(total / perPage)
  if (totalPages <= 1) return null

  const maxVisible = 8
  let start = Math.max(1, page - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages, start + maxVisible - 1)
  if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1)

  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-outline">{total.toLocaleString()} 条记录</span>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-xs text-secondary hover:bg-primary/10 hover:text-primary disabled:opacity-25 transition-all">◀</button>
        {start > 1 && (
          <>
            <button onClick={() => onChange(1)} className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold text-secondary hover:bg-primary/10 hover:text-primary transition-all">1</button>
            {start > 2 && <span className="text-outline text-xs px-1">...</span>}
          </>
        )}
        {pages.map(p => (
          <button key={p} onClick={() => onChange(p)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${p === page ? 'bg-primary text-white shadow-sm' : 'text-secondary hover:bg-primary/10 hover:text-primary'}`}>{p}</button>
        ))}
        {end < totalPages && (
          <>
            {end < totalPages - 1 && <span className="text-outline text-xs px-1">...</span>}
            <button onClick={() => onChange(totalPages)} className="w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold text-secondary hover:bg-primary/10 hover:text-primary transition-all">{totalPages}</button>
          </>
        )}
        <button onClick={() => onChange(Math.min(totalPages, page + 1))} disabled={page === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-xs text-secondary hover:bg-primary/10 hover:text-primary disabled:opacity-25 transition-all">▶</button>
      </div>
    </div>
  )
}

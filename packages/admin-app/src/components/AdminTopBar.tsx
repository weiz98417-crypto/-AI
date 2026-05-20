export default function AdminTopBar() {
  return (
    <header className="h-16 flex justify-between items-center px-8 w-full z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 sticky top-0">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm pointer-events-none select-none">⌕</span>
          <input
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all placeholder:text-outline/60"
            placeholder="搜索穿搭、用户、数据..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center cursor-pointer transition-colors">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2a2.5 2.5 0 0 0-1 4.8V9l-2 3h6l-2-3V6.8A2.5 2.5 0 0 0 8 2z" stroke="#615d5f" strokeWidth="1.2" strokeLinecap="round"/><circle cx="12" cy="4" r="2.5" fill="#ba1a1a" stroke="white" strokeWidth="0.5"/></svg>
        </div>
        <div className="w-px h-6 bg-outline-variant/30 mx-1" />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-semibold text-on-surface leading-none">管理员</p>
            <p className="text-[10px] text-secondary">Super Admin</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-container/40 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            A
          </div>
        </div>
      </div>
    </header>
  )
}

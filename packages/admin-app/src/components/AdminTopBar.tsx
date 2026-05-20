export default function AdminTopBar() {
  return (
    <header className="h-16 flex justify-between items-center px-8 w-full z-40 bg-surface/80 backdrop-blur-md border-b border-outline-variant/20 sticky top-0">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full group">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline text-sm">🔍</span>
          <input
            className="w-full bg-surface-container-low border border-outline-variant/30 rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none transition-all placeholder:text-outline/60"
            placeholder="搜索穿搭、用户、数据..."
            type="text"
          />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="p-2 text-secondary hover:bg-primary-container/20 rounded-full transition-all text-lg">🔔</button>
        <div className="w-px h-6 bg-outline-variant/30 mx-1" />
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs font-semibold text-on-surface leading-none">管理员</p>
            <p className="text-[10px] text-secondary">Super Admin</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-primary-container/40 border border-primary/20 flex items-center justify-center text-sm">👤</div>
        </div>
      </div>
    </header>
  )
}

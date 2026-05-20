export default function SearchBar() {
  return (
    <div className="relative flex items-center">
      <span className="material-symbols-outlined absolute left-4 text-on-surface-variant text-lg">search</span>
      <input
        className="w-full h-12 pl-12 pr-4 bg-surface-container-lowest border border-outline-variant rounded-xl focus:outline-none focus:border-primary text-sm text-on-surface-variant"
        style={{ fontSize: '14px', lineHeight: '20px' }}
        placeholder="Find your style for today..."
        type="text"
      />
    </div>
  )
}

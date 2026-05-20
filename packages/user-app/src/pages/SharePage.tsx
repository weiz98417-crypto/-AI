import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'

export default function SharePage() {
  const { outfitId } = useParams<{ outfitId: string }>()
  const navigate = useNavigate()
  const { state } = useApp()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [generating, setGenerating] = useState(true)
  const [error, setError] = useState('')

  const outfit = state.outfits.find((o) => o.id === outfitId)
  const occasion = state.occasions.find((o) => o.id === outfit?.occasion)

  useEffect(() => {
    if (!outfit) { setGenerating(false); setError('notfound'); return }
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const W = 750; const H = 1100
    canvas.width = W * dpr; canvas.height = H * dpr
    canvas.style.width = '100%'; canvas.style.maxWidth = '375px'; canvas.style.height = 'auto'

    const ctx = canvas.getContext('2d')
    if (!ctx) { setError('canvas'); setGenerating(false); return }
    ctx.scale(dpr, dpr)

    try {
      // Background
      const bg = ctx.createLinearGradient(0, 0, W, H)
      bg.addColorStop(0, '#fcf9f8'); bg.addColorStop(0.6, '#ffd9e4'); bg.addColorStop(1, '#e8a0b9')
      ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)

      // Brand bar
      ctx.fillStyle = '#874c63'; ctx.fillRect(0, 0, W, 80)
      ctx.fillStyle = '#fff'; ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center'
      ctx.fillText('GuangGuangAI', W / 2, 52)

      // Outfit name
      ctx.fillStyle = '#1b1c1c'; ctx.font = 'bold 40px "Plus Jakarta Sans", sans-serif'
      ctx.fillText(outfit.name, W / 2, 200)

      // Occasion badge
      if (occasion) {
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(W / 2 - 80, 230, 160, 40, 20); ctx.fill()
        ctx.fillStyle = '#874c63'; ctx.font = '20px "Plus Jakarta Sans", sans-serif'; ctx.fillText(occasion.name, W / 2, 258)
      }

      // Image area
      const imgGrad = ctx.createLinearGradient(0, 300, W, 750)
      imgGrad.addColorStop(0, '#ffd9e4'); imgGrad.addColorStop(1, '#874c63')
      ctx.fillStyle = imgGrad; ctx.beginPath(); ctx.roundRect(40, 300, W - 80, 450, 24); ctx.fill()

      // Silhouette
      ctx.fillStyle = '#ffffff33'; ctx.beginPath()
      ctx.ellipse(W / 2, 460, 70, 90, 0, 0, Math.PI * 2); ctx.fill()
      ctx.fillRect(W / 2 - 45, 500, 90, 150)

      // Price
      ctx.fillStyle = '#874c63'; ctx.beginPath(); ctx.roundRect(W / 2 - 90, 720, 180, 50, 25); ctx.fill()
      ctx.fillStyle = '#fff'; ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif'; ctx.fillText(`¥${outfit.totalPrice}`, W / 2, 756)

      // Bottom info
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(40, 780, W - 80, 140, 20); ctx.fill()
      ctx.strokeStyle = '#d5c2c6'; ctx.lineWidth = 1; ctx.stroke()

      ctx.fillStyle = '#874c63'; ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'left'
      ctx.fillText(outfit.brandSummary, 70, 830)
      ctx.fillStyle = '#605e5e'; ctx.font = '16px "Plus Jakarta Sans", sans-serif'
      ctx.fillText(outfit.styleTags.join(' · '), 70, 860)

      // QR placeholder
      ctx.strokeStyle = '#d5c2c6'; ctx.lineWidth = 1; ctx.beginPath(); ctx.roundRect(W - 140, 800, 80, 80, 12); ctx.stroke()
      ctx.fillStyle = '#1b1c1c'; ctx.font = '12px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center'
      ctx.fillText('SCAN', W - 100, 845)

      // Footer
      ctx.fillStyle = '#ffffffdd'; ctx.beginPath(); ctx.roundRect(40, H - 100, W - 80, 60, 16); ctx.fill()
      ctx.fillStyle = '#605e5e'; ctx.font = '14px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center'
      ctx.fillText('逛逛AI · AI帮你搭', W / 2, H - 60)

      setGenerating(false)
    } catch { setError('canvas'); setGenerating(false) }
  }, [outfit, occasion])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (!blob) { setError('canvas'); return }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `${outfitId || 'outfit'}-share.png`; a.click()
      URL.revokeObjectURL(url)
    }, 'image/png')
  }

  if (error === 'notfound') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-6">
          <span className="material-symbols-outlined text-7xl text-outline mb-4">error_outline</span>
          <p className="text-lg font-bold text-on-surface-variant mb-2">未找到该穿搭</p>
          <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-primary text-on-primary rounded-full text-sm font-semibold">返回首页</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-40">
      <header className="fixed top-0 w-full z-50 bg-background flex items-center justify-between px-3 h-12">
        <button onClick={() => navigate(-1)} className="active:opacity-70">
          <span className="material-symbols-outlined text-primary">arrow_back_ios</span>
        </button>
        <h1 className="text-lg font-bold text-on-surface">Share</h1>
        <div className="w-6" />
      </header>

      <main className="pt-16 px-3 flex flex-col items-center">
        {generating && (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-on-surface-variant">生成分享卡片...</p>
          </div>
        )}

        {error === 'canvas' && (
          <div className="text-center py-20">
            <p className="text-on-surface-variant mb-4">生成失败</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-primary text-on-primary rounded-full text-sm font-semibold">重试</button>
          </div>
        )}

        {/* Thumbnail selector */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar w-full mb-6 mt-2">
          {state.outfits.filter(o => o.occasion === outfit?.occasion).map((o) => (
            <button key={o.id} onClick={() => navigate(`/share/${o.id}`)}
              className={`flex-none w-14 h-18 rounded-lg overflow-hidden border-2 transition-all ${o.id === outfitId ? 'border-primary' : 'border-outline-variant opacity-60'}`}>
              <img src={o.coverImage} alt={o.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        <canvas ref={canvasRef} className="rounded-xl shadow-lg w-full max-w-[375px]" />
      </main>

      {!generating && !error && (
        <footer className="fixed bottom-0 w-full bg-surface-container-lowest/90 backdrop-blur-md border-t border-outline-variant p-3">
          <div className="flex gap-3">
            <button onClick={handleDownload}
              className="flex-1 py-4 bg-primary text-on-primary rounded-xl text-lg font-bold active:opacity-90 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">download</span>
              Save Image
            </button>
          </div>
        </footer>
      )}
    </div>
  )
}

import { useState, useRef, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'
import TopAppBar from '../components/TopAppBar'

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
    if (!outfit) {
      setGenerating(false)
      setError('notfound')
      return
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const W = 750
    const H = 1334

    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width = W * dpr
    canvas.height = H * dpr
    canvas.style.width = '100%'
    canvas.style.height = 'auto'
    canvas.style.maxWidth = `${W}px`
    canvas.style.aspectRatio = '750 / 1334'

    const ctx = canvas.getContext('2d')
    if (!ctx) { setError('canvas'); setGenerating(false); return }
    ctx.scale(dpr, dpr)

    try {
      // Background
      ctx.fillStyle = '#fcf9f8'
      ctx.fillRect(0, 0, W, H)

      // Top bar (branding area)
      ctx.fillStyle = '#f0eded'
      ctx.fillRect(0, 0, W, 90)
      ctx.fillStyle = '#874c63'
      ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('GuangGuangAI', 40, 56)

      // Main image area (placeholder with gradient)
      const imgGrad = ctx.createLinearGradient(0, 90, 0, 820)
      imgGrad.addColorStop(0, '#e8a0b9')
      imgGrad.addColorStop(1, '#ffd9e4')
      ctx.fillStyle = imgGrad
      ctx.fillRect(40, 120, W - 80, 700)

      // Decorative
      ctx.fillStyle = '#ffffff33'
      ctx.beginPath()
      ctx.arc(W / 2, 470, 180, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#874c63'
      ctx.font = '60px "Material Symbols Outlined"'
      ctx.textAlign = 'center'
      ctx.fillText('\uea5b', W / 2, 500) // checkroom

      // Floating tag
      ctx.fillStyle = '#ffffffee'
      ctx.beginPath()
      ctx.roundRect(60, 150, 180, 40, 20)
      ctx.fill()
      ctx.fillStyle = '#874c63'
      ctx.font = '22px "Plus Jakarta Sans", sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(outfit.name, 150, 176)

      // Occasion badge
      if (occasion) {
        ctx.fillStyle = '#ffffffee'
        ctx.beginPath()
        ctx.roundRect(60, 200, 160, 36, 18)
        ctx.fill()
        ctx.fillStyle = '#1b1c1c'
        ctx.font = '20px "Plus Jakarta Sans", sans-serif'
        ctx.fillText(occasion.name, 140, 225)
      }

      // Price badge
      ctx.fillStyle = '#874c63'
      ctx.beginPath()
      ctx.roundRect(W - 200, 740, 160, 50, 25)
      ctx.fill()
      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(`¥${outfit.totalPrice}`, W - 120, 774)

      // Bottom info card
      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.roundRect(40, 860, W - 80, 200, 24)
      ctx.fill()
      ctx.strokeStyle = '#d5c2c6'
      ctx.lineWidth = 1
      ctx.stroke()

      // Brand
      ctx.fillStyle = '#874c63'
      ctx.beginPath()
      ctx.arc(80, 900, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#874c63'
      ctx.font = 'bold 20px "Plus Jakarta Sans", sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('GUANGGUANG AI', 96, 906)

      // Name
      ctx.fillStyle = '#1b1c1c'
      ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif'
      ctx.fillText(outfit.name, 80, 950)

      // Subtitle
      ctx.fillStyle = '#605e5e'
      ctx.font = '18px "Plus Jakarta Sans", sans-serif'
      ctx.fillText('Found via Intelligent Outfit Discovery', 80, 985)

      // QR section
      ctx.strokeStyle = '#d5c2c6'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.roundRect(W - 170, 880, 80, 80, 12)
      ctx.stroke()
      ctx.fillStyle = '#1b1c1c'
      ctx.font = '12px "Plus Jakarta Sans", sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('QR', W - 130, 930)

      // Footer
      ctx.fillStyle = '#f0eded'
      ctx.fillRect(0, H - 120, W, 120)
      ctx.fillStyle = '#605e5e'
      ctx.font = '16px "Plus Jakarta Sans", sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('Scan to Discover · 逛逛AI', W / 2, H - 60)

      setGenerating(false)
    } catch {
      setError('canvas')
      setGenerating(false)
    }
  }, [outfit, occasion])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      canvas.toBlob((blob) => {
        if (!blob) { setError('canvas'); return }
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${outfitId || 'outfit'}-share.png`
        a.click()
        URL.revokeObjectURL(url)
      }, 'image/png')
    } catch { setError('canvas') }
  }

  if (!generating && error === 'notfound') {
    return (
      <div className="min-h-screen bg-background">
        <TopAppBar title="GuangGuangAI" />
        <main className="pt-16 px-3 text-center">
          <span className="material-symbols-outlined text-7xl text-outline mb-4 mt-20">error_outline</span>
          <p className="text-xl font-semibold text-on-surface-variant mb-2">未找到该穿搭</p>
          <p className="text-sm text-on-surface-variant mb-6">该穿搭方案不存在或已被移除</p>
          <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-primary text-on-primary rounded-full text-sm font-semibold">
            返回首页
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <TopAppBar title="GuangGuangAI" />

      <main className="pt-14 pb-40 px-3">
        {/* Outfit selector thumbnails */}
        <section className="mt-6 mb-6">
          <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1">
            {state.outfits.filter(o => o.occasion === outfit?.occasion).map((o) => (
              <button
                key={o.id}
                onClick={() => navigate(`/share/${o.id}`)}
                className={`flex-none w-16 h-20 rounded-lg overflow-hidden transition-all ${
                  o.id === outfitId ? 'border-2 border-primary' : 'border border-outline-variant opacity-60'
                }`}
              >
                <img src={o.coverImage} alt={o.name} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </section>

        {/* Canvas */}
        {generating && (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-on-surface-variant">正在生成分享卡片...</p>
          </div>
        )}

        {error === 'canvas' && (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-outline mb-4">brush</span>
            <p className="text-sm text-on-surface-variant mb-4">图片生成失败</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-primary text-on-primary rounded-full text-sm font-semibold">
              重试
            </button>
          </div>
        )}

        <div className="flex justify-center">
          <canvas ref={canvasRef} className="rounded-xl shadow-lg w-full" />
        </div>
      </main>

      {/* Bottom Actions */}
      {!generating && !error && (
        <footer className="fixed bottom-0 w-full z-50 bg-surface-container-lowest/90 backdrop-blur-md border-t border-outline-variant pb-safe">
          <div className="px-3 py-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              <button onClick={handleDownload} className="flex flex-col items-center gap-2 active:scale-95 transition-transform">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="material-symbols-outlined">download</span>
                </div>
                <span className="text-xs font-semibold text-on-surface" style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}>Save</span>
              </button>
              <div className="flex flex-col items-center gap-2 opacity-40">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="material-symbols-outlined">chat</span>
                </div>
                <span className="text-xs font-semibold text-on-surface" style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}>WeChat</span>
              </div>
              <div className="flex flex-col items-center gap-2 opacity-40">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                  <span className="material-symbols-outlined">share</span>
                </div>
                <span className="text-xs font-semibold text-on-surface" style={{ fontSize: '12px', lineHeight: '16px', fontWeight: 600 }}>RED</span>
              </div>
            </div>
            <button
              onClick={handleDownload}
              className="w-full py-4 bg-primary text-white rounded-xl text-lg font-bold active:opacity-90 transition-opacity flex items-center justify-center gap-2"
              style={{ fontSize: '18px', lineHeight: '24px', fontWeight: 700 }}
            >
              <span className="material-symbols-outlined">ios_share</span>
              Generate & Share Card
            </button>
          </div>
        </footer>
      )}
    </div>
  )
}

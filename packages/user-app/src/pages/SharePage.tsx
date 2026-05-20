import { useRef, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../store/AppContext'

export default function SharePage() {
  const { outfitId } = useParams<{ outfitId: string }>()
  const navigate = useNavigate()
  const { state } = useApp()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState('')

  const outfit = state.outfits.find((o) => o.id === outfitId)
  const occasion = state.occasions.find((o) => o.id === outfit?.occasion)

  useEffect(() => {
    if (!outfit) { setError('notfound'); return }

    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const W = 750; const H = 1200
    canvas.width = W * dpr; canvas.height = H * dpr
    canvas.style.width = '100%'; canvas.style.maxWidth = '375px'; canvas.style.height = 'auto'
    canvas.style.aspectRatio = '750 / 1200'

    const ctx = canvas.getContext('2d')
    if (!ctx) { setError('canvas'); return }
    ctx.scale(dpr, dpr)

    // Load the outfit image onto canvas
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = outfit.coverImage

    img.onload = () => {
      try {
        // Background
        ctx.fillStyle = '#fcf9f8'
        ctx.fillRect(0, 0, W, H)

        // Top bar
        ctx.fillStyle = '#874c63'
        ctx.fillRect(0, 0, W, 80)
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('逛逛AI', W / 2, 52)

        // The outfit image — centered, with rounded corners
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(40, 110, W - 80, 700, 20)
        ctx.clip()
        ctx.drawImage(img, 40, 110, W - 80, 700)
        ctx.restore()

        // Occasion tag overlay
        if (occasion) {
          ctx.fillStyle = '#ffffffcc'
          ctx.beginPath()
          ctx.roundRect(60, 130, 130, 36, 18)
          ctx.fill()
          ctx.fillStyle = '#874c63'
          ctx.font = '20px "Plus Jakarta Sans", sans-serif'
          ctx.textAlign = 'center'
          ctx.fillText(occasion.name, 125, 155)
        }

        // Price badge
        ctx.fillStyle = '#874c63'
        ctx.beginPath()
        ctx.roundRect(W - 210, 740, 170, 50, 25)
        ctx.fill()
        ctx.fillStyle = '#ffffff'
        ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText(`¥${outfit.totalPrice}`, W - 125, 774)

        // Bottom card
        ctx.fillStyle = '#ffffff'
        ctx.beginPath()
        ctx.roundRect(40, 850, W - 80, 180, 20)
        ctx.fill()
        ctx.strokeStyle = '#d5c2c6'
        ctx.lineWidth = 1
        ctx.stroke()

        // Brand
        ctx.fillStyle = '#874c63'
        ctx.beginPath()
        ctx.arc(80, 895, 5, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = '#874c63'
        ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif'
        ctx.textAlign = 'left'
        ctx.fillText('逛逛AI', 96, 902)

        // Name
        ctx.fillStyle = '#1b1c1c'
        ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif'
        ctx.fillText(outfit.name, 80, 950)

        // Desc
        ctx.fillStyle = '#605e5e'
        ctx.font = '16px "Plus Jakarta Sans", sans-serif'
        ctx.fillText(outfit.styleTags.join(' · '), 80, 985)

        // QR placeholder with Chinese
        ctx.fillStyle = '#f0eded'
        ctx.beginPath()
        ctx.roundRect(W - 150, 870, 90, 90, 16)
        ctx.fill()
        ctx.fillStyle = '#605e5e'
        ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif'
        ctx.textAlign = 'center'
        ctx.fillText('扫码', W - 105, 908)
        ctx.fillText('体验', W - 105, 930)

        // Footer
        ctx.fillStyle = '#f0eded'
        ctx.fillRect(0, H - 100, W, 100)
        ctx.fillStyle = '#605e5e'
        ctx.font = '14px "Plus Jakarta Sans", sans-serif'
        ctx.fillText('逛逛AI · AI帮你搭，每天不重样', W / 2, H - 55)
        ctx.fillText('长按保存图片分享给好友', W / 2, H - 30)

        setReady(true)
      } catch {
        setError('canvas')
      }
    }

    img.onerror = () => {
      // Fallback: draw without image
      try {
        ctx.fillStyle = '#fcf9f8'; ctx.fillRect(0, 0, W, H)
        ctx.fillStyle = '#874c63'; ctx.fillRect(0, 0, W, 80)
        ctx.fillStyle = '#fff'; ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center'
        ctx.fillText('逛逛AI', W / 2, 52)

        const imgGrad = ctx.createLinearGradient(0, 110, W, 810)
        imgGrad.addColorStop(0, '#ffd9e4'); imgGrad.addColorStop(0.5, '#e8a0b9'); imgGrad.addColorStop(1, '#874c63')
        ctx.fillStyle = imgGrad
        ctx.beginPath(); ctx.roundRect(40, 110, W - 80, 700, 20); ctx.fill()

        ctx.fillStyle = '#ffffff66'; ctx.font = 'bold 36px "Plus Jakarta Sans", sans-serif'
        ctx.fillText(outfit.name, W / 2, 450)
        if (occasion) {
          ctx.fillStyle = '#ffffff99'
          ctx.font = '24px "Plus Jakarta Sans", sans-serif'
          ctx.fillText(occasion.name, W / 2, 500)
        }

        ctx.fillStyle = '#874c63'
        ctx.beginPath(); ctx.roundRect(W / 2 - 90, 720, 180, 50, 25); ctx.fill()
        ctx.fillStyle = '#fff'; ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif'
        ctx.fillText(`¥${outfit.totalPrice}`, W / 2, 756)

        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.roundRect(40, 850, W - 80, 180, 20); ctx.fill()
        ctx.fillStyle = '#874c63'; ctx.font = 'bold 18px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'left'
        ctx.fillText('逛逛AI', 80, 900)
        ctx.fillStyle = '#1b1c1c'; ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif'
        ctx.fillText(outfit.name, 80, 945)
        ctx.fillStyle = '#605e5e'; ctx.font = '16px "Plus Jakarta Sans", sans-serif'
        ctx.fillText(outfit.styleTags.join(' · '), 80, 975)

        ctx.fillStyle = '#f0eded'; ctx.beginPath(); ctx.roundRect(W - 150, 870, 90, 90, 16); ctx.fill()
        ctx.fillStyle = '#605e5e'; ctx.font = 'bold 14px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center'
        ctx.fillText('扫码', W - 105, 908); ctx.fillText('体验', W - 105, 930)

        ctx.fillStyle = '#f0eded'; ctx.fillRect(0, H - 100, W, 100)
        ctx.fillStyle = '#605e5e'; ctx.font = '14px "Plus Jakarta Sans", sans-serif'; ctx.textAlign = 'center'
        ctx.fillText('逛逛AI · AI帮你搭，每天不重样', W / 2, H - 55)
        ctx.fillText('长按保存图片分享给好友', W / 2, H - 30)

        setReady(true)
      } catch {
        setError('canvas')
      }
    }
  }, [outfit, occasion])

  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    try {
      const link = document.createElement('a')
      link.download = `${outfit?.name || 'outfit'}-逛逛AI.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch {
      setError('canvas')
    }
  }

  if (error === 'notfound') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center px-6">
          <span className="text-5xl">😕</span>
          <p className="text-lg font-bold text-on-surface-variant mb-2">未找到该穿搭</p>
          <p className="text-sm text-on-surface-variant mb-4">该穿搭方案不存在或已被移除</p>
          <button onClick={() => navigate('/')} className="px-6 py-2.5 bg-primary text-on-primary rounded-full text-sm font-semibold">返回首页</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-28">
      <header className="fixed top-0 w-full z-50 bg-background flex items-center justify-between px-3 h-12">
        <button onClick={() => navigate(-1)} className="active:opacity-70 text-primary text-xl">←</button>
        <h1 className="text-lg font-bold text-on-surface">分享穿搭</h1>
        <div className="w-6" />
      </header>

      <main className="pt-14 px-3 flex flex-col items-center">
        {!ready && !error && (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-on-surface-variant">正在生成分享卡片...</p>
          </div>
        )}

        {error === 'canvas' && (
          <div className="text-center py-20">
            <p className="text-on-surface-variant mb-4">图片生成失败，请重试</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2.5 bg-primary text-on-primary rounded-full text-sm font-semibold">重试</button>
          </div>
        )}

        {/* Thumbnails */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar w-full mb-4 mt-2">
          {state.outfits.filter(o => o.occasion === outfit?.occasion).map((o) => (
            <button key={o.id} onClick={() => navigate(`/share/${o.id}`)}
              className={`flex-none w-14 h-18 rounded-lg overflow-hidden border-2 transition-all ${o.id === outfitId ? 'border-primary' : 'border-outline-variant opacity-60'}`}>
              <img src={o.coverImage} alt={o.name} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* Canvas */}
        <canvas ref={canvasRef} className="rounded-xl shadow-lg w-full max-w-[375px]" />

        {/* Tips */}
        {ready && (
          <p className="text-xs text-on-surface-variant text-center mt-3 mb-4">👆 长按或截图保存分享卡片</p>
        )}
      </main>

      {ready && !error && (
        <footer className="fixed bottom-0 w-full bg-surface-container-lowest/90 backdrop-blur-md border-t border-outline-variant p-3">
          <button onClick={handleDownload}
            className="w-full py-4 bg-primary text-on-primary rounded-xl text-base font-bold active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
            💾 保存图片到相册
          </button>
        </footer>
      )}
    </div>
  )
}

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
    if (!outfit) {
      setGenerating(false)
      setError('notfound')
      return
    }

    const dpr = window.devicePixelRatio || 1
    const W = 750
    const H = 1334

    const canvas = canvasRef.current
    if (!canvas) return

    canvas.width = W * dpr
    canvas.height = H * dpr
    canvas.style.width = `${W}px`
    canvas.style.height = `${H}px`

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      setError('canvas')
      setGenerating(false)
      return
    }

    ctx.scale(dpr, dpr)

    try {
      // Background
      ctx.fillStyle = '#fcf9f8'
      ctx.fillRect(0, 0, W, H)

      // Header bar
      ctx.fillStyle = '#874c63'
      ctx.fillRect(0, 0, W, 80)

      ctx.fillStyle = '#ffffff'
      ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('逛逛AI', W / 2, 52)

      // Main image area placeholder
      ctx.fillStyle = '#e6e1e1'
      ctx.fillRect(40, 120, W - 80, 700)

      ctx.fillStyle = '#837377'
      ctx.font = '48px "Material Symbols Outlined"'
      ctx.textAlign = 'center'
      ctx.fillText('\uea5b', W / 2, 500) // checkroom icon

      // Outfit name
      ctx.fillStyle = '#1b1c1c'
      ctx.font = 'bold 42px "Plus Jakarta Sans", sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText(outfit.name, W / 2, 900)

      // Occasion tag
      if (occasion) {
        ctx.fillStyle = '#ffd9e4'
        const tagW = 200
        const tagX = (W - tagW) / 2
        ctx.beginPath()
        ctx.roundRect(tagX, 930, tagW, 50, 25)
        ctx.fill()

        ctx.fillStyle = '#6c354b'
        ctx.font = '24px "Plus Jakarta Sans", sans-serif'
        ctx.fillText(occasion.name, W / 2, 964)
      }

      // Total price
      ctx.fillStyle = '#874c63'
      ctx.font = 'bold 48px "Plus Jakarta Sans", sans-serif'
      ctx.fillText(`¥${outfit.totalPrice}`, W / 2, 1050)

      // Brand summary
      ctx.fillStyle = '#514347'
      ctx.font = '22px "Plus Jakarta Sans", sans-serif'
      ctx.fillText(outfit.brandSummary, W / 2, 1100)

      // Footer
      ctx.fillStyle = '#f0eded'
      ctx.fillRect(0, H - 120, W, 120)

      ctx.fillStyle = '#605e5e'
      ctx.font = '20px "Plus Jakarta Sans", sans-serif'
      ctx.fillText('逛逛AI · AI帮你搭', W / 2, H - 60)

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
        if (!blob) {
          setError('canvas')
          return
        }
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${outfitId || 'outfit'}-share.png`
        a.click()
        URL.revokeObjectURL(url)
      }, 'image/png')
    } catch {
      setError('canvas')
    }
  }

  // Not found
  if (!generating && error === 'notfound') {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="material-symbols-outlined text-on-surface">
            arrow_back
          </button>
          <h1 className="text-xl font-bold">分享穿搭</h1>
        </div>
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-7xl text-outline mb-4">error_outline</span>
          <p className="text-xl font-semibold text-on-surface-variant mb-2">未找到该穿搭</p>
          <p className="text-on-surface-variant mb-6">该穿搭方案不存在或已被移除</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2.5 bg-primary text-on-primary rounded-full font-medium"
          >
            返回首页
          </button>
        </div>
      </div>
    )
  }

  // Canvas error
  if (!generating && error === 'canvas') {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate(-1)} className="material-symbols-outlined text-on-surface">
            arrow_back
          </button>
          <h1 className="text-xl font-bold">分享穿搭</h1>
        </div>
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-7xl text-outline mb-4">brush</span>
          <p className="text-on-surface-variant mb-4">图片生成失败</p>
          <p className="text-sm text-on-surface-variant mb-6">无法生成分享图片，请重试</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-primary text-on-primary rounded-full font-medium"
          >
            重试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8 pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="material-symbols-outlined text-on-surface">
          arrow_back
        </button>
        <h1 className="text-xl font-bold">分享穿搭</h1>
      </div>

      {generating && (
        <div className="text-center py-20">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-on-surface-variant">正在生成分享图片...</p>
        </div>
      )}

      <div className="flex justify-center">
        <canvas ref={canvasRef} className="max-w-full rounded-2xl shadow-lg" />
      </div>

      {!generating && (
        <button
          onClick={handleDownload}
          className="w-full mt-6 py-3.5 bg-primary text-on-primary rounded-xl font-semibold text-lg active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">download</span>
          保存图片
        </button>
      )}
    </div>
  )
}

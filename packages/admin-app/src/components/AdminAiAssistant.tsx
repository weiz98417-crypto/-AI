import { useState, useRef, useEffect } from 'react'
import { useAdmin } from '../store/AdminContext'

interface Props { onClose: () => void }

export default function AdminAiAssistant({ onClose }: Props) {
  const { state } = useAdmin()
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: '你好！我是逛逛AI 运营助手。\n\n我可以帮你：\n📊 分析用户偏好趋势\n👗 推荐爆款穿搭方向\n💰 定价策略建议\n📈 数据洞察解读\n\n直接问我吧~' },
  ])
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const genReply = (q: string): string => {
    const activeUsers = state.metrics.activeUsers
    const totalOutfits = state.managedOutfits.length
    const activeOutfits = state.managedOutfits.filter(o => o.active).length
    const topStyle = state.styleBars[0]
    const rev = state.metrics.todayRevenue

    if (q.includes('趋势') || q.includes('热门') || q.includes('流行')) {
      return `根据最近数据：\n\n🔥 最热门风格：${topStyle?.name || '简约通勤'} (${topStyle?.pct || 42}%)\n📈 活跃用户：${activeUsers} 人\n📦 在架穿搭：${activeOutfits}/${totalOutfits} 套\n\n💡 建议：加大「${topStyle?.name || '简约通勤'}」风格的内容投放，用户偏好明显。`
    }
    if (q.includes('定价') || q.includes('价格') || q.includes('多少钱')) {
      const ranges = state.managedOutfits.reduce((acc: Record<string, number>, o) => { acc[o.priceRange] = (acc[o.priceRange] || 0) + 1; return acc }, {})
      const top = Object.entries(ranges).sort((a, b) => b[1] - a[1])[0]
      const labels: Record<string, string> = { budget: '平价', mid: '中端', premium: '高端', luxury: '奢华' }
      return `定价分布分析：\n\n${Object.entries(ranges).map(([k, v]) => `• ${labels[k] || k}：${v} 套`).join('\n')}\n\n💡 用户最偏好「${labels[top[0]] || top[0]}」价位。建议新上架穿搭优先覆盖这个价格区间。`
    }
    if (q.includes('用户') || q.includes('偏好') || q.includes('喜欢')) {
      return `用户偏好画像：\n\n👥 总活跃用户：${activeUsers}\n💰 今日营收：¥${rev.toLocaleString()}\n🎨 最受欢迎风格：${topStyle?.name || '简约通勤'}\n\n💡 建议推出更多${topStyle?.name || '简约通勤'}风格的穿搭，特别是中高端价位。`
    }
    if (q.includes('推荐') || q.includes('上新') || q.includes('方向')) {
      return `上新建议：\n\n1️⃣ ${topStyle?.name || '简约通勤'}风格 — 当前最热门，优先补充\n2️⃣ 中端价位(¥500-1000) — 转化率最高区间\n3️⃣ 周末约会场景 — 内容最少但需求增长快\n\n建议本周新增 3-5 套相关穿搭。`
    }
    return `根据当前数据（${activeUsers} 活跃用户，${activeOutfits} 在架穿搭，今日营收 ¥${rev.toLocaleString()}），你认为需要重点优化的方向是什么？我可以帮你具体分析~`
  }

  const handleSend = () => {
    if (!input.trim()) return
    const q = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: q }])
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', text: genReply(q) }])
    }, 600)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20 shrink-0 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white text-sm font-bold">AI</div>
          <div>
            <h2 className="text-base font-bold text-on-surface">运营助手</h2>
            <p className="text-[10px] text-outline">数据驱动的穿搭运营建议</p>
          </div>
        </div>
        <button onClick={onClose} className="text-outline hover:text-primary text-xl px-1">×</button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-primary text-white rounded-br-md' : 'bg-surface-container-low text-on-surface rounded-bl-md'}`}>
              <p className="whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-outline-variant/20 shrink-0 space-y-2 bg-white/50">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:border-primary focus:outline-none"
            placeholder="输入问题，如：最近什么风格最火？..."
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center disabled:opacity-40 active:scale-90 shrink-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {['看趋势', '定价分析', '用户偏好', '上新建议'].map(t => (
            <button key={t} onClick={() => { setInput(t); }} className="px-2.5 py-1 text-[10px] bg-surface-container border border-outline-variant/20 rounded-full text-secondary hover:border-primary hover:text-primary transition-colors">{t}</button>
          ))}
        </div>
      </div>
    </div>
  )
}

import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send } from './Icons'

interface Props { onClose: () => void }

export default function StyleAssistant({ onClose }: Props) {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: '你好！我是逛逛AI 产品小助手 ✨\n\n有任何关于App的问题都可以问我：\n• 怎么使用穿搭推荐？\n• 如何收藏喜欢的穿搭？\n• 怎么分享穿搭给朋友？\n• 偏好设置有什么用？\n\n直接问我吧~' },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const callDeepSeek = async (userMsg: string) => {
    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system: '你是逛逛AI的产品小助手。回答用户关于App功能和使用方法的问题。用中文，友好亲切，控制在150字以内。App核心功能：1.场景化穿搭推荐（选场合→AI推荐方案）2.收藏穿搭 3.分享穿搭卡片 4.偏好设置（颜色/预算/风格）5.AI对话推荐。',
          user: userMsg,
        }),
      })
      const data = await res.json()
      return data.text || '抱歉，我暂时无法回复。请稍后再试~'
    } catch {
      return '网络连接失败，请检查网络后重试~'
    }
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const q = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: q }])
    setLoading(true)

    const reply = await callDeepSeek(q)
    setMessages(prev => [...prev, { role: 'ai', text: reply }])
    setLoading(false)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20 shrink-0 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-tertiary/10 flex items-center justify-center text-xl">✨</div>
          <div>
            <h2 className="text-base font-bold text-on-surface">产品小助手</h2>
            <p className="text-[10px] text-outline">帮你了解App的各种功能</p>
          </div>
        </div>
        <button onClick={onClose} className="text-outline hover:text-primary text-xl px-1">×</button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`} style={{ animation: `slideUp 0.35s ease-out ${Math.min(i, 5) * 0.05}s both` }}>
            <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${m.role === 'user' ? 'bg-tertiary text-white rounded-br-md' : 'bg-surface-container-low text-on-surface rounded-bl-md'}`}>
              <p className="whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-surface-container-low rounded-2xl px-4 py-2.5 flex items-center gap-2">
              <div className="flex gap-1 items-end h-4">
                <div className="w-1.5 h-1.5 rounded-full bg-tertiary/60 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-tertiary animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 rounded-full bg-tertiary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-xs text-secondary">思考中...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 border-t border-outline-variant/20 shrink-0 flex gap-2 bg-white/50">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="flex-1 px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:border-tertiary focus:outline-none"
          placeholder="输入问题..."
          disabled={loading}
        />
        <button onClick={handleSend} disabled={!input.trim() || loading}
          className="w-10 h-10 bg-tertiary text-white rounded-xl flex items-center justify-center disabled:opacity-40 active:scale-90 shrink-0">
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}

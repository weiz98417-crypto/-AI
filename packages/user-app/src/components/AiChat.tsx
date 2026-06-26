import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Outfit } from '@ggai/shared/types'
import type { ChatMessage, RecommendationResult } from '../store/aiConversation'
import { useApp } from '../store/AppContext'
import OutfitCardInline from './OutfitCardInline'
import { IconRobot, IconSend2, IconCamera, IconX } from './Icons'
import { calculateAiScore } from '../store/aiEngine'
import { getAiOutfitStory } from '../store/deepseek'

interface Props { embedded?: boolean; occasion?: string; onClose?: () => void }

const SYSTEM_PROMPT = `你是逛逛AI的穿搭推荐顾问。根据用户的场合和偏好推荐穿搭方案。回复要求：
1. 用中文，自然亲切，像时尚朋友在聊天
2. 先分析用户需求，再给出1-2套推荐
3. 避免使用markdown格式（不要用##、**、-等标记）
4. 控制在200字以内
5. 如果用户追问细节，在对话中延续上文回答`

export default function AiChat({ embedded = false, occasion, onClose }: Props) {
  const { state } = useApp()
  const [messages, setMessages] = useState<ChatMessage[]>([{
    id: 'init', role: 'ai',
    text: '嗨！我是逛逛AI穿搭顾问~ 今天你想去什么场合？有什么穿搭偏好吗？',
    timestamp: Date.now(),
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState('')
  const [result, setResult] = useState<RecommendationResult | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [showCamera, setShowCamera] = useState(false)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, streaming, result])
  useEffect(() => { if (!embedded) inputRef.current?.focus() }, [embedded])

  const callDeepSeek = async (history: { role: string; content: string }[]): Promise<string> => {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history }),
    })
    const data = await res.json()
    return data.text || ''
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userText = input.trim()
    setInput('')
    setLoading(true)
    setStreaming('')

    const userMsg: ChatMessage = { id: 'u' + Date.now(), role: 'user', text: userText, timestamp: Date.now() }
    setMessages(prev => [...prev, userMsg])
    setResult(null)

    // Build conversation history
    const history = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.slice(-8).map(m => ({ role: m.role === 'user' ? 'user' as const : 'assistant' as const, content: m.text })),
      { role: 'user', content: userText },
    ]

    try {
      const text = await callDeepSeek(history)
      // Simulate streaming: yield chunks character by character
      let displayed = ''
      for (let i = 0; i < text.length; i++) {
        displayed += text[i]
        if (i % 3 === 0 || i === text.length - 1) {
          setStreaming(displayed)
          await new Promise(r => setTimeout(r, 15))
        }
      }
      setStreaming('')

      const aiMsg: ChatMessage = { id: 'ai' + Date.now(), role: 'ai', text: displayed, timestamp: Date.now() }
      setMessages(prev => [...prev, aiMsg])

      // Generate top recommendations
      const ctx = occasion || extractOccasion(userText)
      const scored = state.outfits
        .filter(o => o.occasion === ctx)
        .map(o => ({ outfit: o, score: calculateAiScore(o, state.preferences) }))
        .sort((a, b) => b.score - a.score).slice(0, 4).map(x => x.outfit)

      if (scored.length > 0) {
        const stories: Record<string, string> = {}
        for (const o of scored.slice(0, 2)) {
          try { stories[o.id] = await getAiOutfitStory(o) }
          catch { stories[o.id] = `${o.name} — 总价¥${o.totalPrice}` }
        }
        setResult({ outfits: scored, reasoning: displayed, styleAnalysis: '', stories })
      }
    } catch {
      setStreaming('')
      setMessages(prev => [...prev, { id: 'err' + Date.now(), role: 'ai', text: '抱歉，AI 暂时无法响应。请稍后再试~', timestamp: Date.now() }])
    } finally {
      setLoading(false)
    }
  }

  const QUICK_REPLIES = ['上班通勤', '客户会议', '周末约会', '闺蜜聚会', '帮我推荐一套约会穿搭']

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20 shrink-0 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <IconRobot size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface">逛逛AI 穿搭顾问</h2>
            <p className="text-[10px] text-outline">AI-powered style assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {result && <button onClick={() => setCollapsed(!collapsed)} className="text-xs text-outline hover:text-primary">{collapsed ? '展开对话' : '收起对话'}</button>}
          {onClose && <button onClick={onClose} className="text-outline hover:text-primary text-xl px-1">×</button>}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {!collapsed && (
          <div className="px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{ animation: `slideUp 0.35s ease-out ${Math.min(i, 5) * 0.05}s both` }}>
                <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                  m.role === 'user' ? 'bg-primary text-white rounded-br-md' : 'bg-surface-container-low text-on-surface rounded-bl-md'
                }`}>
                  {m.role === 'ai' ? (
                    <div className="prose prose-sm max-w-none prose-p:my-0.5"><ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown></div>
                  ) : (
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  )}
                </div>
              </div>
            ))}
            {streaming && (
              <div className="flex justify-start">
                <div className="max-w-[82%] bg-surface-container-low rounded-2xl rounded-bl-md px-4 py-2.5 text-sm leading-relaxed shadow-sm">
                  <div className="prose prose-sm max-w-none prose-p:my-0.5"><ReactMarkdown remarkPlugins={[remarkGfm]}>{streaming}</ReactMarkdown></div>
                  <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse align-middle" />
                </div>
              </div>
            )}
            {loading && !streaming && (
              <div className="flex justify-start">
                <div className="bg-surface-container-low rounded-2xl px-4 py-2.5 flex items-center gap-2">
                  <div className="flex gap-1 items-end h-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-xs text-secondary">思考中...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}

        {result && (
          <div className={`px-4 pb-4 ${collapsed ? 'pt-4' : 'border-t border-outline-variant/10 pt-4'}`}>
            <h3 className="text-sm font-bold text-on-surface mb-3">为你推荐</h3>
            <div className="space-y-3">
              {result.outfits.map((outfit: Outfit) => (
                <OutfitCardInline key={outfit.id} outfit={outfit} story={result.stories[outfit.id]} />
              ))}
            </div>
          </div>
        )}
      </div>

      {!result && (
        <div className="p-4 border-t border-outline-variant/20 shrink-0 space-y-2 bg-white/50 relative">
          {messages.length <= 2 && (
            <div className="flex flex-wrap gap-1.5">
              {QUICK_REPLIES.map(r => (
                <button key={r} disabled={loading} onClick={() => { setInput(r); setTimeout(() => handleSend(), 50) }}
                  className="px-3 py-1.5 text-xs bg-surface-container-low border border-outline-variant/30 rounded-full hover:border-primary hover:text-primary transition-all disabled:opacity-40">{r}</button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={() => setShowCamera(true)} disabled={loading}
              className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/30 text-secondary flex items-center justify-center shrink-0 hover:border-primary hover:text-primary transition-colors active:scale-90">
              <IconCamera size={18} />
            </button>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:border-primary focus:outline-none"
              placeholder={loading ? 'AI 正在回复...' : '描述你的场合或需求...'}
              disabled={loading} />
            <button onClick={handleSend} disabled={!input.trim() || loading}
              className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center disabled:opacity-40 active:scale-90 transition-all hover:shadow-md hover:shadow-primary/20 shrink-0">
              <IconSend2 size={16} />
            </button>
          </div>
          {showCamera && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowCamera(false)}>
              <div className="bg-surface rounded-2xl p-6 shadow-2xl border border-outline-variant/20 mx-8 text-center" onClick={e => e.stopPropagation()}>
                <IconCamera size={40} className="text-primary mx-auto mb-3" />
                <h3 className="text-base font-bold mb-1">需要相机权限</h3>
                <p className="text-xs text-secondary mb-4">逛逛AI 需要访问你的相机来识别穿搭风格</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowCamera(false)} className="flex-1 py-2 bg-surface-container text-on-surface rounded-lg text-sm font-semibold">拒绝</button>
                  <button onClick={() => {
                    setShowCamera(false)
                    setMessages(prev => [...prev,
                      { id: 'cam' + Date.now(), role: 'user', text: '拍照分析今日穿搭', timestamp: Date.now() },
                      { id: 'cam-ai' + Date.now(), role: 'ai', text: '抱歉，无法获取手机相机权限。请前往系统设置→隐私→相机，允许逛逛AI访问你的相机后再试~', timestamp: Date.now() },
                    ])
                  }} className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold">允许</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {result && !onClose && (
        <div className="p-4 border-t border-outline-variant/20 shrink-0 flex gap-2 bg-white/50">
          <button onClick={() => { setResult(null); setMessages([{ id: 'init', role: 'ai', text: '嗨！我是逛逛AI穿搭顾问~ 今天你想去什么场合？有什么穿搭偏好吗？', timestamp: Date.now() }]) }}
            className="flex-1 py-2.5 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors">重新对话</button>
        </div>
      )}
    </div>
  )
}

function extractOccasion(text: string): string {
  if (text.includes('通勤') || text.includes('上班') || text.includes('办公')) return 'work-commute'
  if (text.includes('会议') || text.includes('客户') || text.includes('商务')) return 'client-meeting'
  if (text.includes('约会') || text.includes('周末')) return 'weekend-date'
  if (text.includes('聚会') || text.includes('闺蜜')) return 'girls-gathering'
  return 'work-commute'
}

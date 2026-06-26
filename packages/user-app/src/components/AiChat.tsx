import { useState, useRef, useEffect } from 'react'
import type { Outfit } from '@ggai/shared/types'
import type { ChatMessage, RecommendationResult } from '../store/aiConversation'
import { startSession, addUserMessage, generateFull } from '../store/aiConversation'
import { useApp } from '../store/AppContext'
import OutfitCardInline from './OutfitCardInline'
import { Bot, Send, Camera } from './Icons'

interface Props {
  embedded?: boolean
  occasion?: string
  onClose?: () => void
}

export default function AiChat({ embedded = false, occasion, onClose }: Props) {
  const { state } = useApp()
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const s = startSession(state.preferences)
    return s.messages
  })
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [thinkingText, setThinkingText] = useState('')
  const [result, setResult] = useState<RecommendationResult | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinkingText, result])

  useEffect(() => {
    if (!embedded) inputRef.current?.focus()
  }, [embedded])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userText = input.trim()
    setInput('')
    setLoading(true)
    setThinkingText('')

    const userMsg = addUserMessage(userText)
    setMessages(prev => [...prev, userMsg])

    const ctx = occasion || userText

    try {
      for await (const chunk of generateFull(ctx, state.preferences, state.outfits)) {
        if (chunk.type === 'thinking') {
          setThinkingText(chunk.text || '')
        } else if (chunk.type === 'text') {
          setThinkingText('')
          // Add AI text message
          setMessages(prev => [...prev, {
            id: 'ai-' + Date.now(),
            role: 'ai',
            text: chunk.text || '',
            timestamp: Date.now(),
          }])
        } else if (chunk.type === 'result' && chunk.result) {
          setThinkingText('')
          setResult(chunk.result)
        }
      }
    } catch (e: any) {
      setMessages(prev => [...prev, {
        id: 'ai-err-' + Date.now(),
        role: 'ai',
        text: '抱歉，AI 暂时无法响应。请稍后再试~',
        timestamp: Date.now(),
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleQuickReply = (text: string) => {
    setInput(text)
    // Trigger send on next render
    setTimeout(() => handleSend(), 50)
  }

  const QUICK_REPLIES = ['上班通勤', '客户会议', '周末约会', '闺蜜聚会', '今天有什么推荐']

  const containerClass = embedded
    ? 'flex flex-col h-full'
    : 'flex flex-col h-full max-h-[85vh]'

  return (
    <div className={containerClass}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20 shrink-0 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Bot size={20} /></div>
          <div>
            <h2 className="text-base font-bold text-on-surface">逛逛AI 穿搭顾问</h2>
            <p className="text-[10px] text-outline">AI-powered style assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {result && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-xs text-outline hover:text-primary transition-colors px-2 py-1"
            >
              {collapsed ? '展开对话' : '收起对话'}
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="text-outline hover:text-primary text-xl leading-none px-1">×</button>
          )}
        </div>
      </div>

      {/* Body: Messages + Results */}
      <div className="flex-1 overflow-y-auto">
        {/* Conversation (collapsible when results shown) */}
        {!collapsed && (
          <div className="px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{ animation: `slideUp 0.35s ease-out ${Math.min(i, 5) * 0.05}s both` }}>
                <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                  m.role === 'user'
                    ? 'bg-primary text-white rounded-br-md'
                    : 'bg-surface-container-low text-on-surface rounded-bl-md'
                }`}>
                  <p className="whitespace-pre-wrap">{m.text}</p>
                </div>
              </div>
            ))}

            {thinkingText && (
              <div className="flex justify-start">
                <div className="bg-surface-container-low rounded-2xl px-4 py-2.5 flex items-center gap-2 text-sm text-secondary">
                  <div className="flex gap-1 items-end h-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span>{thinkingText}</span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className={`px-4 pb-4 ${collapsed ? 'pt-4' : 'border-t border-outline-variant/10 pt-4'}`}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-bold text-on-surface">✨ 为你推荐</h3>
              {result.styleAnalysis && (
                <span className="text-[10px] text-outline bg-surface-container-low px-2 py-0.5 rounded-full">AI 精选</span>
              )}
            </div>

            {result.styleAnalysis && (
              <p className="text-xs text-secondary mb-3 leading-relaxed bg-surface-container-low/50 rounded-xl p-3">
                {result.styleAnalysis}
              </p>
            )}

            <div className="space-y-3">
              {result.outfits.map((outfit: Outfit) => (
                <OutfitCardInline
                  key={outfit.id}
                  outfit={outfit}
                  story={result.stories[outfit.id]}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      {!result && (
        <div className="p-4 border-t border-outline-variant/20 shrink-0 space-y-2 bg-white/50 relative">
          {/* Quick replies */}
          {messages.length <= 2 && (
            <div className="flex flex-wrap gap-1.5">
              {QUICK_REPLIES.map(r => (
                <button
                  key={r}
                  disabled={loading}
                  onClick={() => handleQuickReply(r)}
                  className="px-3 py-1.5 text-xs bg-surface-container-low border border-outline-variant/30 rounded-full hover:border-primary hover:text-primary transition-all disabled:opacity-40"
                >{r}</button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={() => setShowCamera(true)}
              disabled={loading}
              className="w-10 h-10 rounded-xl bg-surface-container-low border border-outline-variant/30 text-secondary flex items-center justify-center shrink-0 hover:border-primary hover:text-primary transition-colors active:scale-90"
            >
              <Camera size={18} />
            </button>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:border-primary focus:outline-none"
              placeholder={loading ? 'AI 正在思考...' : '描述你的场合或需求...'}
              disabled={loading}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center disabled:opacity-40 active:scale-90 transition-all hover:shadow-md hover:shadow-primary/20 shrink-0"
            ><Send size={16} /></button>
          </div>

          {/* Camera Permission Mock */}
          {showCamera && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowCamera(false)}>
              <div className="bg-surface rounded-2xl p-6 shadow-2xl border border-outline-variant/20 mx-8 text-center" onClick={e => e.stopPropagation()}>
                <div className="text-4xl mb-3">📸</div>
                <h3 className="text-base font-bold mb-1">需要相机权限</h3>
                <p className="text-xs text-secondary mb-4">逛逛AI 需要访问你的相机来识别你的穿搭风格</p>
                <div className="flex gap-3">
                  <button onClick={() => setShowCamera(false)} className="flex-1 py-2 bg-surface-container text-on-surface rounded-lg text-sm font-semibold">拒绝</button>
                  <button onClick={() => {
                    setShowCamera(false);
                    setMessages(prev => [...prev,
                      { id: 'cam-u-' + Date.now(), role: 'user', text: '📸 请求拍照分析穿搭', timestamp: Date.now() },
                      { id: 'cam-ai-' + Date.now(), role: 'ai', text: '抱歉，无法获取手机相机权限。请前往系统设置 → 隐私 → 相机，允许逛逛AI访问你的相机后再试~', timestamp: Date.now() },
                    ]);
                  }} className="flex-1 py-2 bg-primary text-white rounded-lg text-sm font-semibold">允许</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Done state: regenerate button */}
      {result && !onClose && (
        <div className="p-4 border-t border-outline-variant/20 shrink-0 flex gap-2 bg-white/50">
          <button
            onClick={() => { setResult(null); setMessages([]); startSession(state.preferences); }}
            className="flex-1 py-2.5 bg-primary/10 text-primary rounded-xl text-sm font-semibold hover:bg-primary/20 transition-colors"
          >重新对话</button>
        </div>
      )}
    </div>
  )
}

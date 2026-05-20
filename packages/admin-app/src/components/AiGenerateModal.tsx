import { useState, useRef, useEffect } from 'react'
import type { ManagedOutfit } from '../shared/types'

interface Props {
  onClose: () => void
  onAdd: (outfit: ManagedOutfit) => void
}

type Message = { role: 'ai' | 'user'; text: string }

const QUESTIONS = [
  '你好！我是逛逛AI造型师 ✨ 先告诉我，你想要什么场合的穿搭？\n\n上班通勤 / 客户会议 / 周末约会 / 闺蜜聚会',
  '明白了！那你偏爱什么色系呢？\n\n暖色调（粉/米/棕）/ 冷色调（蓝/灰/黑）/ 中性色 / 亮色',
  '最后，你的预算大概在什么范围？\n\n¥500以下 / ¥500-1500 / ¥1500以上 / 不限',
]

export default function AiGenerateModal({ onClose, onAdd }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: QUESTIONS[0] }
  ])
  const [input, setInput] = useState('')
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    const newAnswers = [...answers, userMsg]
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setAnswers(newAnswers)
    setInput('')

    const nextStep = step + 1
    if (nextStep < QUESTIONS.length) {
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'ai', text: QUESTIONS[nextStep] }])
        setStep(nextStep)
      }, 500)
    } else {
      // All questions answered — call DeepSeek
      setLoading(true)
      setMessages(prev => [...prev, { role: 'ai', text: '好的，我已经了解了你的需求。让我为你生成专属穿搭方案...' }])

      try {
        const system = `你是逛逛AI的穿搭设计师。根据用户的回答和场合，生成一套完整的穿搭方案。必须严格返回JSON：
{
  "name": "穿搭名称（中文，10字以内）",
  "items": [{"name": "单品名", "brand": "品牌名", "price": 数字, "category": "top|bottom|outerwear|dress|shoes|accessory"}],
  "styleTags": ["标签1", "标签2"],
  "totalPrice": 数字,
  "brandSummary": "品牌摘要"
}
生成3-4个单品，总价合理（200-3000），风格标签2个。`

        const user = `用户回答：
1. 场合偏好：${newAnswers[0]}
2. 色系偏好：${newAnswers[1]}
3. 预算范围：${newAnswers[2]}

请根据以上信息生成一套穿搭方案。`

        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ system, user }),
        })
        const data = await res.json()
        const text = data.text || ''

        // Parse JSON from response
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          const outfit: ManagedOutfit = {
            id: `ai-${Date.now()}`,
            occasion: answers[0].includes('上班') ? 'work-commute' :
                       answers[0].includes('会议') ? 'client-meeting' :
                       answers[0].includes('约会') ? 'weekend-date' : 'girls-gathering',
            name: parsed.name || 'AI推荐穿搭',
            items: parsed.items || [],
            totalPrice: parsed.totalPrice || 888,
            priceRange: parsed.totalPrice > 1000 ? 'premium' : parsed.totalPrice > 500 ? 'mid' : 'budget',
            styleTags: parsed.styleTags || ['简约通勤'],
            coverImage: '/assets/outfits/work-commute-1-main.jpg',
            brandSummary: parsed.brandSummary || 'AI Generated',
            active: true,
          }
          setMessages(prev => [...prev, {
            role: 'ai',
            text: `✨ 已为你生成「${outfit.name}」！\n${outfit.items.map(i => `· ${i.brand} ${i.name} ¥${i.price}`).join('\n')}\n总价：¥${outfit.totalPrice}\n风格：${outfit.styleTags.join(' / ')}\n\n已添加到穿搭列表 ✓`
          }])
          onAdd(outfit)
        } else {
          setMessages(prev => [...prev, { role: 'ai', text: '生成完成！但格式解析异常，请重试。原始响应：\n' + text.slice(0, 200) }])
        }
      } catch (e: any) {
        setMessages(prev => [...prev, { role: 'ai', text: '抱歉，AI暂时不可用：' + e.message }])
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-surface rounded-3xl w-full max-w-lg mx-4 shadow-2xl border border-outline-variant/20 flex flex-col" style={{ height: '560px' }} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-outline-variant/20 shrink-0">
          <div>
            <h2 className="text-base font-bold text-on-surface">AI 造型师</h2>
            <p className="text-xs text-secondary">回答几个问题，为你定制穿搭</p>
          </div>
          <button onClick={onClose} className="text-secondary hover:text-primary text-xl leading-none">×</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                m.role === 'user'
                  ? 'bg-primary text-white'
                  : 'bg-surface-container-low text-on-surface'
              }`}>
                <p className="whitespace-pre-wrap">{m.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-surface-container-low rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {!loading && step < QUESTIONS.length && (
          <div className="p-4 border-t border-outline-variant/20 shrink-0 flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              className="flex-1 px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:border-primary focus:outline-none"
              placeholder="输入你的回答..."
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="px-5 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold disabled:opacity-40 active:scale-95 transition-all"
            >发送</button>
          </div>
        )}

        {/* Done state */}
        {step >= QUESTIONS.length && !loading && (
          <div className="p-4 border-t border-outline-variant/20 shrink-0 flex gap-2">
            <button onClick={onClose} className="flex-1 py-2.5 bg-surface-container text-on-surface rounded-xl text-sm font-semibold">
              关闭
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

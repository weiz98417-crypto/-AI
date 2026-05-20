import { useState, useRef, useEffect } from 'react'
import type { ManagedOutfit } from '../shared/types'

interface Props {
  onClose: () => void
  onAdd: (outfit: ManagedOutfit) => void
}

type Message = { role: 'ai' | 'user'; text: string }

const QUESTIONS = [
  '你好！我是逛逛AI内容助手。来帮你的平台创建新的穿搭推荐。\n\n首先，这次面向什么目标客群？\n\n职场新人 / 资深白领 / 学生群体 / 高端用户 / 不限',
  '好的。你希望推荐什么季节或场景的穿搭？\n\n春季通勤 / 夏季约会 / 秋冬商务 / 闺蜜聚会 / 不限',
  '定价定位在哪个档位？\n\n平价亲民 (¥200↓) / 中端轻奢 (¥200-800) / 高端精品 (¥800+) / 不限',
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
      setMessages(prev => [...prev, { role: 'ai', text: '收到。正在根据你的客群和市场定位生成穿搭方案...' }])

      try {
        const system = `你是逛逛AI平台的内容运营助手。你的任务是根据运营人员提供的目标客群、场景和定价策略，生成一套适合发布到平台的穿搭推荐方案。返回JSON：
{
  "name": "穿搭名称（中文，10字以内）",
  "items": [{"name": "单品名", "brand": "品牌名", "price": 数字, "category": "top|bottom|outerwear|dress|shoes|accessory"}],
  "styleTags": ["标签1", "标签2"],
  "totalPrice": 数字,
  "brandSummary": "品牌摘要"
}
单品3-4个，价格合理，风格标签2个。`

        const user = `运营需求：
1. 目标客群：${newAnswers[0]}
2. 场景季节：${newAnswers[1]}
3. 定价策略：${newAnswers[2]}

请生成一套穿搭方案。`

        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ system, user }),
        })
        const data = await res.json()
        const text = data.text || ''

        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0])
          const occasionMap: Record<string, string> = {
            '通勤': 'work-commute', '职场': 'work-commute', '商务': 'client-meeting',
            '会议': 'client-meeting', '约会': 'weekend-date', '闺蜜': 'girls-gathering',
          }
          let occasion = 'work-commute'
          for (const [k, v] of Object.entries(occasionMap)) {
            if (newAnswers[1].includes(k)) { occasion = v; break }
          }
          const outfit: ManagedOutfit = {
            id: `ai-${Date.now()}`,
            occasion: occasion as ManagedOutfit['occasion'],
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
            <h2 className="text-base font-bold text-on-surface">AI 内容助手</h2>
            <p className="text-xs text-secondary">回答运营问题，生成平台穿搭内容</p>
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

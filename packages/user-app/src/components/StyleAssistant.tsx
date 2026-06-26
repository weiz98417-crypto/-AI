import { useState } from 'react'

interface Props {
  onClose: () => void
}

export default function StyleAssistant({ onClose }: Props) {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: '你好！我是逛逛AI 产品小助手 ✨\n\n有任何关于App的问题都可以问我：\n• 怎么使用穿搭推荐？\n• 如何收藏喜欢的穿搭？\n• 怎么分享穿搭给朋友？\n• 偏好设置有什么用？\n\n直接问我吧~' },
  ])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return
    const q = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: q }])

    setTimeout(() => {
      const faq: Record<string, string> = {
        '推荐': '在首页选择适合你的场合卡片（上班通勤/客户会议/周末约会/闺蜜聚会），AI会自动为你推荐匹配的穿搭方案。你也可以点击「让AI帮你搭配」和AI对话获取定制方案~',
        '收藏': '看到喜欢的穿搭，点击爱心图标就可以收藏啦！收藏的穿搭会保存在「收藏」页面，随时可以回看。',
        '分享': '在穿搭详情页点击「Share」按钮，可以生成精美的穿搭分享卡片。分享给闺蜜看看你的穿搭灵感吧~',
        '偏好': '在「偏好」页面可以设置你喜欢的颜色、预算档位和风格标签。AI会根据你的偏好为你推荐更精准的穿搭！',
        '价格': '平台覆盖四个价格档位：平价(¥200↓)、中端(¥200-500)、高端(¥500-1000)、奢华(¥1000+)。你可以在偏好中设置预算范围。',
        '场合': '目前支持四个场景：上班通勤、客户会议、周末约会、闺蜜聚会。每个场景都有多套精选穿搭。',
        '怎么': '逛逛AI 是一款AI穿搭推荐App。你只需要告诉AI你的场合和喜好，AI就会为你量身推荐穿搭方案，搭配单品清单和品牌信息，一键分享穿搭卡片！',
      }
      let reply = '感谢你的反馈！如果有具体问题，可以问得更详细一些~ 比如「怎么收藏穿搭」或「价格档位是什么意思」'
      for (const [k, v] of Object.entries(faq)) {
        if (q.includes(k)) { reply = v; break }
      }
      setMessages(prev => [...prev, { role: 'ai', text: reply }])
    }, 500)
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
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            style={{ animation: `slideUp 0.35s ease-out ${Math.min(i, 5) * 0.05}s both` }}>
            <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
              m.role === 'user' ? 'bg-tertiary text-white rounded-br-md' : 'bg-surface-container-low text-on-surface rounded-bl-md'
            }`}>
              <p className="whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-outline-variant/20 shrink-0 flex gap-2 bg-white/50">
        <div className="flex flex-wrap gap-1.5 flex-1">
          {['怎么使用', '如何收藏', '怎么分享', '价格说明'].map(t => (
            <button key={t} onClick={() => { setInput(t); setTimeout(() => handleSend(), 50) }}
              className="px-2.5 py-1 text-[10px] bg-surface-container border border-outline-variant/20 rounded-full text-secondary hover:border-tertiary hover:text-tertiary transition-colors">{t}</button>
          ))}
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-10 h-10 bg-tertiary text-white rounded-xl flex items-center justify-center disabled:opacity-40 active:scale-90 shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22,2 15,22 11,13 2,9"/></svg>
        </button>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { IconSparkle, IconCamera, IconSend } from './Icons'

interface Props {
  onClose: () => void
}

export default function StyleAssistant({ onClose }: Props) {
  const [messages, setMessages] = useState<{ role: 'ai' | 'user'; text: string }[]>([
    { role: 'ai', text: 'Hi! 我是你的私人穿搭助手 👋\n我可以帮你：\n• 检查今天的搭配是否合适\n• 推荐配饰搭配\n• 快速回答风格问题\n\n试试拍照功能或者直接问我吧~' },
  ])
  const [input, setInput] = useState('')
  const [showCamera, setShowCamera] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return
    const userText = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userText }])

    // Generate a helpful response
    setTimeout(() => {
      const tips: Record<string, string> = {
        '配饰': '可以试试珍珠耳环或金属细链项链，简约配饰最百搭~ 避免太过夸张的款式。',
        '颜色': '建议同色系搭配或互补色搭配。珊瑚粉 + 米白色是春夏经典组合！',
        '鞋子': '通勤推荐低跟乐福鞋或尖头平底鞋，约会可选细带凉鞋或玛丽珍鞋~',
        '包包': '日常通勤选中号托特包或链条斜挎包，容量大又时髦。',
        '搭配': '上下呼应法则：如果上衣是亮色，鞋子或包包可以选同色系呼应。',
      }
      let reply = '你的风格偏好我记下了~ 可以更具体地告诉我你想了解什么？比如配饰、颜色、鞋子搭配？'
      for (const [k, v] of Object.entries(tips)) {
        if (userText.includes(k)) { reply = v; break }
      }
      setMessages(prev => [...prev, { role: 'ai', text: reply }])
    }, 600)
  }

  const handleCamera = () => {
    setShowCamera(true)
    // Simulate camera permission flow
    setTimeout(() => {
      setMessages(prev => [...prev,
        { role: 'user', text: '📸 拍照分析今日穿搭' },
        { role: 'ai', text: '正在分析你的穿搭照片...\n\n🔍 检测到：简约通勤风格\n📊 匹配度：87%\n💡 建议：这套搭配很适合今日的上班场合！上衣的珊瑚色调和你的肤色很搭。如果想提升，可以加一条金属细腰带突出腰线~' },
      ])
      setShowCamera(false)
    }, 2000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-outline-variant/20 shrink-0 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
            <IconSparkle size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface">Style Assistant</h2>
            <p className="text-[10px] text-outline">你的私人穿搭顾问</p>
          </div>
        </div>
        <button onClick={onClose} className="text-outline hover:text-primary text-xl leading-none px-1">×</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            style={{ animation: `slideUp 0.35s ease-out ${Math.min(i, 5) * 0.05}s both` }}>
            <div className={`max-w-[82%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
              m.role === 'user'
                ? 'bg-tertiary text-white rounded-br-md'
                : 'bg-surface-container-low text-on-surface rounded-bl-md'
            }`}>
              <p className="whitespace-pre-wrap">{m.text}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Camera Permission Mock */}
      {showCamera && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-surface rounded-2xl p-6 shadow-2xl border border-outline-variant/20 mx-8 text-center">
            <IconCamera size={40} className="text-tertiary mx-auto mb-3" />
            <h3 className="text-base font-bold mb-1">需要相机权限</h3>
            <p className="text-xs text-secondary mb-4">逛逛AI 需要访问你的相机来帮你分析穿搭风格</p>
            <div className="flex gap-3">
              <button onClick={() => setShowCamera(false)} className="flex-1 py-2 bg-surface-container text-on-surface rounded-lg text-sm font-semibold">拒绝</button>
              <button onClick={handleCamera} className="flex-1 py-2 bg-tertiary text-white rounded-lg text-sm font-semibold">允许</button>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-outline-variant/20 shrink-0 flex gap-2 bg-white/50">
        <button
          onClick={handleCamera}
          className="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0 hover:bg-tertiary/20 transition-colors active:scale-90"
        >
          <IconCamera size={18} />
        </button>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          className="flex-1 px-4 py-2.5 bg-surface-container-low border border-outline-variant rounded-xl text-sm focus:border-tertiary focus:outline-none"
          placeholder="问任何穿搭问题..."
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-10 h-10 rounded-xl bg-tertiary text-white flex items-center justify-center shrink-0 disabled:opacity-40 active:scale-90 transition-all"
        >
          <IconSend size={16} />
        </button>
      </div>
    </div>
  )
}

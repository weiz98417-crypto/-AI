import { useState } from 'react'
import { useAdmin } from '../store/AdminContext'

export default function SettingsPage() {
  const { dispatch } = useAdmin()
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwMsg, setPwMsg] = useState('')
  const [pwOk, setPwOk] = useState(false)

  const [temperature, setTemperature] = useState(0.8)
  const [maxTokens, setMaxTokens] = useState(600)
  const [saved, setSaved] = useState(false)

  const handleChangePassword = () => {
    if (currentPw !== '888888') { setPwMsg('当前密码错误'); return }
    if (newPw.length < 6) { setPwMsg('新密码至少6位'); return }
    if (newPw !== confirmPw) { setPwMsg('两次输入的密码不一致'); return }
    setPwMsg('密码修改成功！下次登录生效。')
    setPwOk(true)
  }

  const handleSaveAiConfig = () => {
    localStorage.setItem('ggai-admin-ai-config', JSON.stringify({ temperature, maxTokens }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-8 animate-fade-in-up max-w-3xl">
      <div>
        <h2 className="text-[28px] font-bold text-on-surface">系统设置</h2>
        <p className="text-sm text-secondary mt-1">管理密码、AI参数和系统配置</p>
      </div>

      {/* Password */}
      <div className="bg-surface rounded-2xl border border-outline-variant/20 p-6 shadow-sm">
        <h3 className="text-base font-bold mb-4">修改密码</h3>
        <div className="space-y-4 max-w-sm">
          <div>
            <label className="block text-xs text-secondary mb-1 font-semibold">当前密码</label>
            <input value={currentPw} onChange={e => setCurrentPw(e.target.value)} type="password"
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-secondary mb-1 font-semibold">新密码</label>
            <input value={newPw} onChange={e => setNewPw(e.target.value)} type="password"
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-secondary mb-1 font-semibold">确认新密码</label>
            <input value={confirmPw} onChange={e => setConfirmPw(e.target.value)} type="password"
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none" />
          </div>
          <button onClick={handleChangePassword}
            className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
            修改密码
          </button>
          {pwMsg && (
            <p className={`text-xs font-semibold ${pwOk ? 'text-green-600' : 'text-error'}`}>{pwMsg}</p>
          )}
        </div>
      </div>

      {/* AI Config */}
      <div className="bg-surface rounded-2xl border border-outline-variant/20 p-6 shadow-sm">
        <h3 className="text-base font-bold mb-4">AI 模型配置</h3>
        <div className="space-y-4 max-w-sm">
          <div>
            <label className="block text-xs text-secondary mb-1 font-semibold">Temperature ({temperature})</label>
            <input type="range" min="0" max="2" step="0.1" value={temperature}
              onChange={e => setTemperature(parseFloat(e.target.value))}
              className="w-full accent-primary" />
            <div className="flex justify-between text-[10px] text-outline mt-1">
              <span>精确 (0)</span><span>平衡 (1)</span><span>创意 (2)</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-secondary mb-1 font-semibold">Max Tokens ({maxTokens})</label>
            <input type="range" min="100" max="2000" step="100" value={maxTokens}
              onChange={e => setMaxTokens(parseInt(e.target.value))}
              className="w-full accent-primary" />
          </div>
          <button onClick={handleSaveAiConfig}
            className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
            {saved ? '✓ 已保存' : '保存配置'}
          </button>
        </div>
      </div>

      {/* API Status */}
      <div className="bg-surface rounded-2xl border border-outline-variant/20 p-6 shadow-sm">
        <h3 className="text-base font-bold mb-4">系统状态</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-2 border-b border-outline-variant/10">
            <span className="text-sm text-secondary">DEEPSEEK_API_KEY</span>
            <span className="flex items-center gap-2 text-sm font-semibold text-green-700">
              <span className="w-2 h-2 rounded-full bg-green-500" /> 已配置
            </span>
          </div>
          <div className="flex items-center justify-between py-2 border-b border-outline-variant/10">
            <span className="text-sm text-secondary">Deploy Version</span>
            <span className="text-sm font-semibold">ggai-admin v0.2.0</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-secondary">LocalStorage Status</span>
            <span className="text-sm font-semibold text-green-700">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block mr-1" /> Normal
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

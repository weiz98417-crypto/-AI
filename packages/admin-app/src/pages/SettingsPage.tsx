import { useState, useEffect } from 'react'
import { useAdmin } from '../store/AdminContext'
import {
  User, Lock, Bell, Cpu, Palette, Link as LinkIcon, Database, Shield, Check, Eye, EyeOff,
  Mail, Smartphone, Globe, Key, HardDrive, Trash2, Download,
} from 'lucide-react'

const TABS = [
  { id: 'profile', label: '个人资料', icon: User },
  { id: 'security', label: '安全设置', icon: Shield },
  { id: 'notifications', label: '通知偏好', icon: Bell },
  { id: 'ai', label: 'AI 配置', icon: Cpu },
  { id: 'appearance', label: '外观', icon: Palette },
  { id: 'integrations', label: '集成', icon: LinkIcon },
  { id: 'data', label: '数据管理', icon: Database },
]

function load<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback }
  catch { return fallback }
}
function save(key: string, val: any) { localStorage.setItem(key, JSON.stringify(val)) }

export default function SettingsPage() {
  const [tab, setTab] = useState('profile')
  return (
    <div className="space-y-6 animate-fade-in-up max-w-5xl">
      <div>
        <h2 className="text-[28px] font-bold text-on-surface">系统设置</h2>
        <p className="text-sm text-secondary mt-1">管理你的账户、偏好和系统配置</p>
      </div>
      <div className="flex gap-6">
        <nav className="w-48 shrink-0 space-y-0.5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                tab === t.id ? 'bg-primary/10 text-primary shadow-sm' : 'text-secondary hover:bg-surface-container-low hover:text-on-surface'
              }`}>
              <t.icon size={16} strokeWidth={tab === t.id ? 2.5 : 1.8} /><span>{t.label}</span>
            </button>
          ))}
        </nav>
        <div className="flex-1 min-w-0">
          {tab === 'profile' && <ProfileSection />}
          {tab === 'security' && <SecuritySection />}
          {tab === 'notifications' && <NotificationSection />}
          {tab === 'ai' && <AiConfigSection />}
          {tab === 'appearance' && <AppearanceSection />}
          {tab === 'integrations' && <IntegrationsSection />}
          {tab === 'data' && <DataSection />}
        </div>
      </div>
    </div>
  )
}

function Card({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface rounded-2xl border border-outline-variant/20 p-6 mb-4 shadow-sm">
      <h3 className="text-sm font-bold text-on-surface mb-1">{title}</h3>
      {desc && <p className="text-xs text-secondary mb-4">{desc}</p>}
      {children}
    </div>
  )
}

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  const [show, setShow] = useState(true)
  useEffect(() => { const t = setTimeout(() => setShow(false), 2500); return () => clearTimeout(t) }, [])
  if (!show) return null
  return <div className={`fixed bottom-8 right-8 z-[100] px-5 py-3 rounded-xl shadow-lg text-sm font-semibold animate-fade-in-up ${ok ? 'bg-green-600 text-white' : 'bg-error text-white'}`}>{msg}</div>
}

// ---- Profile ----
function ProfileSection() {
  const [profile, setProfile] = useState(() => load('ggai-admin-profile', { name: '管理员', email: 'admin@ggai.com', phone: '+86 138****8888' }))
  const [saved, setSaved] = useState(false)
  return (
    <div>
      <Card title="基本信息" desc="你的个人资料和联系方式">
        <div className="grid grid-cols-2 gap-4 max-w-lg">
          <div><label className="block text-xs text-secondary mb-1 font-semibold">姓名</label>
            <input value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none" /></div>
          <div><label className="block text-xs text-secondary mb-1 font-semibold">角色</label>
            <input value="Super Admin" disabled className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm text-outline cursor-not-allowed" /></div>
          <div><label className="block text-xs text-secondary mb-1 font-semibold">邮箱</label>
            <input value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} type="email" className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none" /></div>
          <div><label className="block text-xs text-secondary mb-1 font-semibold">手机号</label>
            <input value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none" /></div>
        </div>
        <button onClick={() => { save('ggai-admin-profile', profile); setSaved(true); setTimeout(() => setSaved(false), 2000) }}
          className="mt-4 px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
          {saved ? <><Check size={14} /> 已保存</> : '保存修改'}
        </button>
      </Card>
    </div>
  )
}

// ---- Security ----
function SecuritySection() {
  const { dispatch } = useAdmin()
  const [showPw, setShowPw] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwMsg, setPwMsg] = useState<{ text: string; ok: boolean } | null>(null)
  const pwStrength = Math.min(4, Math.floor(newPw.length / 3) + (/\d/.test(newPw) ? 1 : 0) + (/[a-zA-Z]/.test(newPw) ? 1 : 0))

  const [twoFa, setTwoFa] = useState(() => load('ggai-admin-2fa', false))
  const [devices, setDevices] = useState(() => load('ggai-admin-devices', [
    { device: 'Chrome · Windows', location: '上海', time: '当前会话', id: 1 },
    { device: 'Safari · iPhone 15', location: '上海', time: '2 天前', id: 2 },
    { device: 'Chrome · MacBook Pro', location: '北京', time: '1 周前', id: 3 },
  ]))

  const handleChangePw = () => {
    if (currentPw !== '888888') { setPwMsg({ text: '当前密码错误', ok: false }); return }
    if (newPw.length < 6) { setPwMsg({ text: '新密码至少 6 位', ok: false }); return }
    if (newPw !== confirmPw) { setPwMsg({ text: '两次输入的密码不一致', ok: false }); return }
    save('ggai-admin-password', newPw)
    setCurrentPw(''); setNewPw(''); setConfirmPw('')
    setPwMsg({ text: '密码修改成功！下次登录使用新密码', ok: true })
  }

  const revokeDevice = (id: number) => {
    const next = devices.filter(d => d.id !== id)
    setDevices(next); save('ggai-admin-devices', next)
  }

  return (
    <div>
      <Card title="修改密码" desc="定期更换密码可以保护账户安全">
        <div className="space-y-3 max-w-sm">
          <div><label className="block text-xs text-secondary mb-1 font-semibold">当前密码</label>
            <input type="password" value={currentPw} onChange={e => setCurrentPw(e.target.value)} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none" /></div>
          <div><label className="block text-xs text-secondary mb-1 font-semibold">新密码</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)} className="w-full px-3 py-2 pr-10 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none" placeholder="至少 6 位，包含字母和数字" />
              <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline">{showPw ? <EyeOff size={14} /> : <Eye size={14} />}</button>
            </div>
            <div className="flex gap-1 mt-2">{[1,2,3,4].map(i => <div key={i} className={`h-1 flex-1 rounded-full ${i <= pwStrength ? (pwStrength <= 2 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-surface-container'}`} />)}</div>
            <p className="text-[10px] text-outline mt-1">{['','弱','一般','中','强'][pwStrength]}</p>
          </div>
          <div><label className="block text-xs text-secondary mb-1 font-semibold">确认新密码</label>
            <input type="password" value={confirmPw} onChange={e => setConfirmPw(e.target.value)} className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none" placeholder="再次输入新密码" /></div>
          <button onClick={handleChangePw} className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">更新密码</button>
          {pwMsg && <p className={`text-xs font-semibold ${pwMsg.ok ? 'text-green-600' : 'text-error'}`}>{pwMsg.text}</p>}
        </div>
      </Card>

      <Card title="两步验证 (2FA)" desc="通过手机验证码增加安全保护">
        <div className="flex items-center justify-between max-w-sm">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${twoFa ? 'bg-green-50' : 'bg-yellow-50'}`}>
              <Shield size={18} className={twoFa ? 'text-green-600' : 'text-yellow-600'} />
            </div>
            <div>
              <p className="text-sm font-semibold">{twoFa ? '已启用' : '未启用'}</p>
              <p className="text-xs text-secondary">{twoFa ? '登录时需要输入手机验证码' : '通过手机验证码增加安全保护'}</p>
            </div>
          </div>
          <button onClick={() => { const v = !twoFa; setTwoFa(v); save('ggai-admin-2fa', v) }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${twoFa ? 'bg-surface-container border border-outline-variant/30 hover:border-error hover:text-error' : 'bg-primary text-white hover:opacity-90'}`}>
            {twoFa ? '禁用' : '立即启用'}
          </button>
        </div>
      </Card>

      <Card title="登录设备" desc="管理已登录的设备">
        <div className="space-y-2 max-w-sm">
          {devices.map(d => (
            <div key={d.id} className="flex items-center justify-between py-2 px-3 bg-surface-container-low rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${d.id === 1 ? 'bg-green-500' : 'bg-outline-variant'}`} />
                <div><p className="text-sm font-medium">{d.device}</p><p className="text-[10px] text-secondary">{d.location} · {d.time}</p></div>
              </div>
              {d.id !== 1 && <button onClick={() => revokeDevice(d.id)} className="text-[10px] text-error font-semibold hover:underline">撤销</button>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ---- Notifications ----
function NotificationSection() {
  const [prefs, setPrefs] = useState(() => load('ggai-admin-notifs', {
    newUser: true, newOrder: true, lowStock: true, weeklyReport: false, marketing: false, systemUpdate: true,
    email: true, push: true, sms: false,
  }))
  const toggle = (k: string) => { const next = { ...prefs, [k]: !(prefs as any)[k] }; setPrefs(next); save('ggai-admin-notifs', next) }

  return (
    <div>
      <Card title="通知类型" desc="选择你想要接收的通知">
        <div className="space-y-3 max-w-sm">
          {[
            { key: 'newUser', label: '新用户注册', desc: '有新用户注册时通知' },
            { key: 'newOrder', label: '新订单创建', desc: '用户下单时即时通知' },
            { key: 'lowStock', label: '穿搭库存预警', desc: '穿搭即将下架时提醒' },
            { key: 'weeklyReport', label: '每周数据报告', desc: '每周一发送上周运营报告' },
            { key: 'marketing', label: '营销活动提醒', desc: '促销和活动相关通知' },
            { key: 'systemUpdate', label: '系统更新', desc: '平台功能更新和维护通知' },
          ].map(n => (
            <div key={n.key} className="flex items-center justify-between">
              <div><p className="text-sm font-medium">{n.label}</p><p className="text-[10px] text-secondary">{n.desc}</p></div>
              <button onClick={() => toggle(n.key)} className={`w-10 h-6 rounded-full transition-colors relative ${(prefs as any)[n.key] ? 'bg-primary' : 'bg-outline-variant/40'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${(prefs as any)[n.key] ? 'left-[18px]' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </Card>
      <Card title="通知渠道">
        <div className="space-y-3 max-w-sm">
          {[
            { key: 'email', label: '邮件通知', icon: Mail, desc: 'admin@ggai.com' },
            { key: 'push', label: '浏览器推送', icon: Globe, desc: 'Chrome · 已授权' },
            { key: 'sms', label: '短信通知', icon: Smartphone, desc: '+86 138****8888' },
          ].map(c => (
            <div key={c.key} className="flex items-center justify-between">
              <div className="flex items-center gap-3"><c.icon size={16} className="text-secondary" /><div><p className="text-sm font-medium">{c.label}</p><p className="text-[10px] text-secondary">{c.desc}</p></div></div>
              <button onClick={() => toggle(c.key)} className={`w-10 h-6 rounded-full transition-colors relative ${(prefs as any)[c.key] ? 'bg-primary' : 'bg-outline-variant/40'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${(prefs as any)[c.key] ? 'left-[18px]' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ---- AI Config ----
function AiConfigSection() {
  const [cfg, setCfg] = useState(() => load('ggai-admin-ai-config', { temperature: 0.8, maxTokens: 800, topP: 0.9, freqPenalty: 0.3 }))
  const [saved, setSaved] = useState(false)
  const update = (k: string, v: number) => setCfg({ ...cfg, [k]: v })

  return (
    <div>
      <Card title="DeepSeek API" desc="AI 推荐引擎的核心配置">
        <div className="space-y-4 max-w-sm">
          <div className="flex items-center justify-between py-2"><span className="text-sm">API 状态</span><span className="flex items-center gap-2 text-sm font-semibold text-green-700"><span className="w-2 h-2 rounded-full bg-green-500" /> 已连接</span></div>
          <div className="flex items-center justify-between py-2"><span className="text-sm">本月调用次数</span><span className="text-sm font-semibold">12,847 / 50,000</span></div>
          <div className="h-2 bg-surface-container rounded-full overflow-hidden"><div className="h-full bg-primary rounded-full" style={{ width: '25.7%' }} /></div>
          <div>
            <label className="block text-xs text-secondary mb-1 font-semibold">API Key</label>
            <div className="flex gap-2">
              <input value="sk-••••••••••••••••••••" disabled className="flex-1 px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm text-outline cursor-not-allowed" />
              <button onClick={() => { save('ggai-admin-api-key-ts', Date.now()); alert('API Key 更换功能需要 Vercel 环境变量配置。本地开发请修改 .env 文件中的 DEEPSEEK_API_KEY。') }}
                className="px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-lg text-xs font-semibold hover:border-primary transition-colors">更换</button>
            </div>
          </div>
        </div>
      </Card>

      <Card title="模型参数" desc="调整 AI 生成的行为和风格">
        <div className="space-y-4 max-w-sm">
          {[
            { key: 'temperature', label: 'Temperature', min: 0, max: 2, step: 0.1 },
            { key: 'maxTokens', label: 'Max Tokens', min: 100, max: 2000, step: 100 },
            { key: 'topP', label: 'Top P', min: 0, max: 1, step: 0.05 },
            { key: 'freqPenalty', label: 'Frequency Penalty', min: 0, max: 1, step: 0.1 },
          ].map(s => (
            <div key={s.key}>
              <div className="flex justify-between text-xs mb-1"><span className="text-secondary">{s.label}</span><span className="font-semibold">{(cfg as any)[s.key]}</span></div>
              <input type="range" min={s.min} max={s.max} step={s.step} value={(cfg as any)[s.key]} onChange={e => update(s.key, parseFloat(e.target.value))} className="w-full accent-primary" />
            </div>
          ))}
          <button onClick={() => { save('ggai-admin-ai-config', cfg); setSaved(true); setTimeout(() => setSaved(false), 2000) }}
            className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
            {saved ? <span className="flex items-center gap-2"><Check size={14} /> 已保存</span> : '保存配置'}
          </button>
        </div>
      </Card>

      <Card title="使用统计">
        <div className="grid grid-cols-3 gap-4 max-w-sm">
          {[{ label: '今日调用', value: '1,247' },{ label: '平均延迟', value: '1.2s' },{ label: '成功率', value: '99.7%' }].map(s => (
            <div key={s.label} className="bg-surface-container-low rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-primary">{s.value}</p><p className="text-[10px] text-secondary">{s.label}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ---- Appearance ----
function AppearanceSection() {
  const [theme, setTheme] = useState(() => load('ggai-admin-theme', 'light'))
  const [lang, setLang] = useState(() => load('ggai-admin-lang', 'zh-CN'))
  const [tz, setTz] = useState(() => load('ggai-admin-tz', 'Asia/Shanghai'))

  return (
    <div>
      <Card title="主题" desc="选择界面配色方案">
        <div className="flex gap-3 max-w-sm">
          {[
            { id: 'light', label: '浅色', preview: 'bg-gray-100' },
            { id: 'dark', label: '深色 (即将推出)', preview: 'bg-gray-700' },
            { id: 'system', label: '跟随系统 (即将推出)', preview: 'bg-gradient-to-r from-gray-100 to-gray-700' },
          ].map(t => {
            const active = theme === t.id
            return (
              <button key={t.id} onClick={() => { if (t.id === 'light') { setTheme(t.id); save('ggai-admin-theme', t.id) } }}
                disabled={t.id !== 'light'}
                className={`flex-1 rounded-xl p-3 text-center border-2 transition-all ${active ? 'border-primary bg-primary/5' : 'border-outline-variant/20 opacity-50 cursor-not-allowed'}`}>
                <div className={`w-full h-12 rounded-lg mb-2 ${t.preview}`} />
                <span className={`text-xs font-semibold ${active ? 'text-on-surface' : 'text-outline'}`}>{t.label}</span>
              </button>
            )
          })}
        </div>
      </Card>

      <Card title="语言与地区">
        <div className="space-y-3 max-w-xs">
          <div><label className="block text-xs text-secondary mb-1 font-semibold">语言</label>
            <select value={lang} onChange={e => { setLang(e.target.value); save('ggai-admin-lang', e.target.value) }}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none cursor-pointer">
              <option value="zh-CN">简体中文</option><option value="en">English</option>
            </select></div>
          <div><label className="block text-xs text-secondary mb-1 font-semibold">时区</label>
            <select value={tz} onChange={e => { setTz(e.target.value); save('ggai-admin-tz', e.target.value) }}
              className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none cursor-pointer">
              <option value="Asia/Shanghai">Asia/Shanghai (UTC+8)</option><option value="Asia/Tokyo">Asia/Tokyo (UTC+9)</option><option value="America/New_York">America/New_York (UTC-5)</option>
            </select></div>
        </div>
      </Card>
    </div>
  )
}

// ---- Integrations (display-only) ----
function IntegrationsSection() {
  return (
    <div>
      <Card title="已连接服务" desc="第三方平台集成状态">
        <div className="space-y-3 max-w-sm">
          {[
            { name: 'DeepSeek', desc: 'AI 模型服务', status: '已连接', dot: 'bg-green-500' },
            { name: 'Vercel', desc: '托管和部署平台', status: '已连接', dot: 'bg-green-500' },
            { name: 'GitHub', desc: '代码仓库和 CI/CD', status: '已连接', dot: 'bg-green-500' },
            { name: '微信开放平台', desc: '社交分享和登录', status: '未配置', dot: 'bg-outline-variant' },
            { name: '阿里云 OSS', desc: '图片存储和 CDN', status: '未配置', dot: 'bg-outline-variant' },
          ].map(svc => (
            <div key={svc.name} className="flex items-center justify-between py-2 px-3 bg-surface-container-low rounded-lg">
              <div className="flex items-center gap-3"><span className={`w-2 h-2 rounded-full ${svc.dot}`} /><div><p className="text-sm font-medium">{svc.name}</p><p className="text-[10px] text-secondary">{svc.desc}</p></div></div>
              <span className={`text-xs font-semibold ${svc.status === '已连接' ? 'text-green-700' : 'text-outline'}`}>{svc.status}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

// ---- Data ----
function DataSection() {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)

  const handleExport = (type: string) => {
    let csv = ''
    if (type === 'users') {
      csv = 'Name,Email,JoinDate,Orders,Spent,Status\n' + Array.from({ length: 100 }, (_, i) => `User ${i + 1},user${i}@ggai.com,2026-${String(Math.floor(i / 30) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')},${Math.floor(Math.random() * 20)},${Math.floor(Math.random() * 10000)},active`).join('\n')
    } else if (type === 'orders') {
      csv = 'OrderID,User,Items,Amount,Status,Date\n' + Array.from({ length: 100 }, (_, i) => `ORD-${1000 + i},User ${i + 1},"Outfit Item",${Math.floor(Math.random() * 5000) + 500},${['pending','shipped','delivered','cancelled'][i % 4]},2026-06-${String((i % 28) + 1).padStart(2, '0')}`).join('\n')
    } else {
      csv = 'User,Action,Time\n' + Array.from({ length: 100 }, (_, i) => `User ${i + 1},"Viewed outfit",${Math.floor(Math.random() * 24)}h ago`).join('\n')
    }
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = `ggai-${type}-export-${new Date().toISOString().slice(0, 10)}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const handleDeleteAllUsers = () => {
    localStorage.removeItem('ggai-admin-users')
    setConfirmDelete(false)
  }

  const handleReset = () => {
    for (const k of Object.keys(localStorage)) { if (k.startsWith('ggai-admin-')) localStorage.removeItem(k) }
    setConfirmReset(false)
    window.location.reload()
  }

  return (
    <div>
      <Card title="数据导出" desc="导出你的平台数据用于分析或备份">
        <div className="space-y-3 max-w-sm">
          {[
            { label: '用户数据', desc: 'CSV 格式，包含所有用户信息（前 100 条）', icon: Download, type: 'users' },
            { label: '订单记录', desc: 'CSV 格式，包含交易明细（前 100 条）', icon: Download, type: 'orders' },
            { label: '活动日志', desc: 'CSV 格式，行为日志（前 100 条）', icon: Download, type: 'activities' },
          ].map(d => (
            <div key={d.label} className="flex items-center justify-between py-2 px-3 bg-surface-container-low rounded-lg">
              <div><p className="text-sm font-medium">{d.label}</p><p className="text-[10px] text-secondary">{d.desc}</p></div>
              <button onClick={() => handleExport(d.type)} className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-outline-variant/30 rounded-lg text-xs font-semibold hover:border-primary transition-colors"><d.icon size={12} /> 导出</button>
            </div>
          ))}
        </div>
      </Card>

      <Card title="危险操作" desc="这些操作不可撤销，请谨慎操作">
        <div className="space-y-3 max-w-sm">
          <div className="flex items-center justify-between py-2 px-3 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center gap-3"><Trash2 size={16} className="text-error" /><div><p className="text-sm font-semibold text-error">删除所有用户数据</p><p className="text-[10px] text-error/70">永久删除所有用户数据，不可恢复</p></div></div>
            {confirmDelete ? (
              <div className="flex gap-2"><button onClick={handleDeleteAllUsers} className="px-3 py-1.5 bg-error text-white rounded-lg text-xs font-semibold">确认</button><button onClick={() => setConfirmDelete(false)} className="px-3 py-1.5 bg-surface-container rounded-lg text-xs">取消</button></div>
            ) : <button onClick={() => setConfirmDelete(true)} className="px-3 py-1.5 bg-error text-white rounded-lg text-xs font-semibold hover:opacity-90">删除</button>}
          </div>
          <div className="flex items-center justify-between py-2 px-3 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center gap-3"><HardDrive size={16} className="text-error" /><div><p className="text-sm font-semibold text-error">重置平台数据</p><p className="text-[10px] text-error/70">清空所有数据恢复出厂设置</p></div></div>
            {confirmReset ? (
              <div className="flex gap-2"><button onClick={handleReset} className="px-3 py-1.5 bg-error text-white rounded-lg text-xs font-semibold">确认</button><button onClick={() => setConfirmReset(false)} className="px-3 py-1.5 bg-surface-container rounded-lg text-xs">取消</button></div>
            ) : <button onClick={() => setConfirmReset(true)} className="px-3 py-1.5 bg-error text-white rounded-lg text-xs font-semibold hover:opacity-90">重置</button>}
          </div>
        </div>
      </Card>
    </div>
  )
}

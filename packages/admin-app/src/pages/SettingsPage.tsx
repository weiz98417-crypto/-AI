import { useState } from 'react'
import {
  User, Lock, Bell, Cpu, Palette, Link, Database, Shield, Check, Eye, EyeOff,
  Mail, Smartphone, Globe, Key, HardDrive, Trash2, Download,
} from 'lucide-react'

const TABS = [
  { id: 'profile', label: '个人资料', icon: User },
  { id: 'security', label: '安全设置', icon: Shield },
  { id: 'notifications', label: '通知偏好', icon: Bell },
  { id: 'ai', label: 'AI 配置', icon: Cpu },
  { id: 'appearance', label: '外观', icon: Palette },
  { id: 'integrations', label: '集成', icon: Link },
  { id: 'data', label: '数据管理', icon: Database },
]

export default function SettingsPage() {
  const [tab, setTab] = useState('profile')
  const TabIcon = TABS.find(t => t.id === tab)?.icon || User

  return (
    <div className="space-y-6 animate-fade-in-up max-w-5xl">
      <div>
        <h2 className="text-[28px] font-bold text-on-surface">系统设置</h2>
        <p className="text-sm text-secondary mt-1">管理你的账户、偏好和系统配置</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <nav className="w-48 shrink-0 space-y-0.5">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                tab === t.id ? 'bg-primary/10 text-primary shadow-sm' : 'text-secondary hover:bg-surface-container-low hover:text-on-surface'
              }`}>
              <t.icon size={16} strokeWidth={tab === t.id ? 2.5 : 1.8} />
              <span>{t.label}</span>
            </button>
          ))}
        </nav>

        {/* Content area */}
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

function SettingCard({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="bg-surface rounded-2xl border border-outline-variant/20 p-6 mb-4 shadow-sm">
      <h3 className="text-sm font-bold text-on-surface mb-1">{title}</h3>
      {desc && <p className="text-xs text-secondary mb-4">{desc}</p>}
      {children}
    </div>
  )
}

function ProfileSection() {
  return (
    <div>
      <SettingCard title="基本信息" desc="你的个人资料和联系方式">
        <div className="grid grid-cols-2 gap-4 max-w-lg">
          <div>
            <label className="block text-xs text-secondary mb-1 font-semibold">姓名</label>
            <input defaultValue="管理员" className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-secondary mb-1 font-semibold">角色</label>
            <input defaultValue="Super Admin" disabled className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm text-outline cursor-not-allowed" />
          </div>
          <div>
            <label className="block text-xs text-secondary mb-1 font-semibold">邮箱</label>
            <input defaultValue="admin@ggai.com" type="email" className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-secondary mb-1 font-semibold">手机号</label>
            <input defaultValue="+86 138****8888" className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none" />
          </div>
        </div>
        <button className="mt-4 px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center gap-2">
          <Check size={14} /> 保存修改
        </button>
      </SettingCard>

      <SettingCard title="头像" desc="推荐 1:1 比例，支持 JPG/PNG">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-primary/10 border border-outline-variant/20 flex items-center justify-center text-primary text-xl font-bold">A</div>
          <div>
            <button className="px-4 py-2 bg-surface-container border border-outline-variant/30 rounded-lg text-xs font-semibold hover:border-primary transition-colors">上传图片</button>
            <p className="text-[10px] text-outline mt-1">最大 2MB</p>
          </div>
        </div>
      </SettingCard>
    </div>
  )
}

function SecuritySection() {
  const [showPw, setShowPw] = useState(false)
  const [pwStrength, setPwStrength] = useState(0)

  return (
    <div>
      <SettingCard title="修改密码" desc="定期更换密码可以保护账户安全">
        <div className="space-y-3 max-w-sm">
          <div>
            <label className="block text-xs text-secondary mb-1 font-semibold">当前密码</label>
            <input type="password" defaultValue="888888" className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none" />
          </div>
          <div>
            <label className="block text-xs text-secondary mb-1 font-semibold">新密码</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} onChange={e => setPwStrength(Math.min(4, e.target.value.length / 3))}
                className="w-full px-3 py-2 pr-10 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none" placeholder="至少 8 位，包含字母和数字" />
              <button onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-outline">{showPw ? <EyeOff size={14} /> : <Eye size={14} />}</button>
            </div>
            <div className="flex gap-1 mt-2">
              {[1,2,3,4].map(i => (
                <div key={i} className={`h-1 flex-1 rounded-full ${i <= pwStrength ? (pwStrength <= 2 ? 'bg-yellow-500' : 'bg-green-500') : 'bg-surface-container'}`} />
              ))}
            </div>
            <p className="text-[10px] text-outline mt-1">{['','弱 — 太短了','弱 — 加一些数字','中 — 还不错','强 — 很安全！'][pwStrength]}</p>
          </div>
          <div>
            <label className="block text-xs text-secondary mb-1 font-semibold">确认新密码</label>
            <input type="password" className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none" placeholder="再次输入新密码" />
          </div>
          <button className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">更新密码</button>
        </div>
      </SettingCard>

      <SettingCard title="两步验证 (2FA)" desc="添加额外的安全层保护你的账户">
        <div className="flex items-center justify-between max-w-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center"><Shield size={18} className="text-yellow-600" /></div>
            <div>
              <p className="text-sm font-semibold">未启用</p>
              <p className="text-xs text-secondary">通过手机验证码增加安全保护</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-surface-container border border-outline-variant/30 rounded-lg text-xs font-semibold hover:border-primary transition-colors">立即启用</button>
        </div>
      </SettingCard>

      <SettingCard title="登录设备" desc="最近登录过的设备">
        <div className="space-y-2 max-w-sm">
          {[
            { device: 'Chrome · Windows', location: '上海, 中国', time: '当前会话', active: true },
            { device: 'Safari · iPhone 15', location: '上海, 中国', time: '2 天前', active: false },
            { device: 'Chrome · MacBook Pro', location: '北京, 中国', time: '1 周前', active: false },
          ].map((d, i) => (
            <div key={i} className="flex items-center justify-between py-2 px-3 bg-surface-container-low rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${d.active ? 'bg-green-500' : 'bg-outline-variant'}`} />
                <div>
                  <p className="text-sm font-medium">{d.device}</p>
                  <p className="text-[10px] text-secondary">{d.location} · {d.time}</p>
                </div>
              </div>
              {!d.active && <button className="text-[10px] text-error font-semibold hover:underline">撤销</button>}
            </div>
          ))}
        </div>
      </SettingCard>
    </div>
  )
}

function NotificationSection() {
  const [prefs, setPrefs] = useState({
    newUser: true, newOrder: true, lowStock: true, weeklyReport: false,
    marketing: false, systemUpdate: true, email: true, push: true, sms: false,
  })
  const toggle = (k: string) => setPrefs(p => ({ ...p, [k]: !(p as any)[k] }))

  return (
    <div>
      <SettingCard title="通知类型" desc="选择你想要接收的通知">
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
      </SettingCard>

      <SettingCard title="通知渠道">
        <div className="space-y-3 max-w-sm">
          {[
            { key: 'email', label: '邮件通知', icon: Mail, desc: 'admin@ggai.com' },
            { key: 'push', label: '浏览器推送', icon: Globe, desc: 'Chrome · 已授权' },
            { key: 'sms', label: '短信通知', icon: Smartphone, desc: '+86 138****8888' },
          ].map(c => (
            <div key={c.key} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <c.icon size={16} className="text-secondary" />
                <div><p className="text-sm font-medium">{c.label}</p><p className="text-[10px] text-secondary">{c.desc}</p></div>
              </div>
              <button onClick={() => toggle(c.key)} className={`w-10 h-6 rounded-full transition-colors relative ${(prefs as any)[c.key] ? 'bg-primary' : 'bg-outline-variant/40'}`}>
                <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all ${(prefs as any)[c.key] ? 'left-[18px]' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>
      </SettingCard>
    </div>
  )
}

function AiConfigSection() {
  return (
    <div>
      <SettingCard title="DeepSeek API" desc="AI 推荐引擎的核心配置">
        <div className="space-y-4 max-w-sm">
          <div className="flex items-center justify-between py-2">
            <span className="text-sm">API 状态</span>
            <span className="flex items-center gap-2 text-sm font-semibold text-green-700"><span className="w-2 h-2 rounded-full bg-green-500" /> 已连接</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm">本月调用次数</span>
            <span className="text-sm font-semibold">12,847 / 50,000</span>
          </div>
          <div className="h-2 bg-surface-container rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: '25.7%' }} />
          </div>
          <div>
            <label className="block text-xs text-secondary mb-1 font-semibold">API Key</label>
            <div className="flex gap-2">
              <input value="sk-••••••••••••••••••••" disabled className="flex-1 px-3 py-2 bg-surface-container-low border border-outline-variant/30 rounded-lg text-sm text-outline cursor-not-allowed" />
              <button className="px-3 py-2 bg-surface-container border border-outline-variant/30 rounded-lg text-xs font-semibold hover:border-primary transition-colors">更换</button>
            </div>
          </div>
        </div>
      </SettingCard>

      <SettingCard title="模型参数" desc="调整 AI 生成的行为和风格">
        <div className="space-y-4 max-w-sm">
          <div>
            <div className="flex justify-between text-xs mb-1"><span className="text-secondary">Temperature</span><span className="font-semibold">0.8</span></div>
            <input type="range" min="0" max="2" step="0.1" defaultValue="0.8" className="w-full accent-primary" />
            <div className="flex justify-between text-[10px] text-outline mt-0.5"><span>精确</span><span>平衡</span><span>创意</span></div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1"><span className="text-secondary">Max Tokens</span><span className="font-semibold">800</span></div>
            <input type="range" min="100" max="2000" step="100" defaultValue="800" className="w-full accent-primary" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1"><span className="text-secondary">Top P</span><span className="font-semibold">0.9</span></div>
            <input type="range" min="0" max="1" step="0.05" defaultValue="0.9" className="w-full accent-primary" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1"><span className="text-secondary">Frequency Penalty</span><span className="font-semibold">0.3</span></div>
            <input type="range" min="0" max="1" step="0.1" defaultValue="0.3" className="w-full accent-primary" />
          </div>
          <button className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">保存配置</button>
        </div>
      </SettingCard>

      <SettingCard title="使用统计">
        <div className="grid grid-cols-3 gap-4 max-w-sm">
          {[
            { label: '今日调用', value: '1,247' },
            { label: '平均延迟', value: '1.2s' },
            { label: '成功率', value: '99.7%' },
          ].map(s => (
            <div key={s.label} className="bg-surface-container-low rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-primary">{s.value}</p>
              <p className="text-[10px] text-secondary">{s.label}</p>
            </div>
          ))}
        </div>
      </SettingCard>
    </div>
  )
}

function AppearanceSection() {
  return (
    <div>
      <SettingCard title="主题" desc="选择界面配色方案">
        <div className="flex gap-3 max-w-sm">
          {[
            { id: 'light', label: '浅色', active: true, bg: 'bg-white border-2 border-primary' },
            { id: 'dark', label: '深色', active: false, bg: 'bg-gray-800 border-2 border-outline-variant/20 opacity-40' },
            { id: 'system', label: '跟随系统', active: false, bg: 'bg-gradient-to-r from-white to-gray-800 border-2 border-outline-variant/20 opacity-40' },
          ].map(t => (
            <button key={t.id} className={`flex-1 rounded-xl p-3 text-center ${t.bg} transition-all`}>
              <div className={`w-full h-12 rounded-lg mb-2 ${t.id === 'dark' ? 'bg-gray-700' : t.id === 'system' ? 'bg-gradient-to-r from-gray-100 to-gray-700' : 'bg-gray-100'}`} />
              <span className={`text-xs font-semibold ${t.active ? 'text-on-surface' : 'text-outline'}`}>{t.label}</span>
            </button>
          ))}
        </div>
      </SettingCard>

      <SettingCard title="语言与地区">
        <div className="space-y-3 max-w-xs">
          <div>
            <label className="block text-xs text-secondary mb-1 font-semibold">语言</label>
            <select className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none cursor-pointer">
              <option>简体中文</option><option>English</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-secondary mb-1 font-semibold">时区</label>
            <select className="w-full px-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg text-sm focus:border-primary focus:outline-none cursor-pointer">
              <option>Asia/Shanghai (UTC+8)</option><option>Asia/Tokyo (UTC+9)</option><option>America/New_York (UTC-5)</option>
            </select>
          </div>
        </div>
      </SettingCard>
    </div>
  )
}

function IntegrationsSection() {
  return (
    <div>
      <SettingCard title="已连接服务" desc="第三方平台集成状态">
        <div className="space-y-3 max-w-sm">
          {[
            { name: 'DeepSeek', desc: 'AI 模型服务', status: '已连接', dot: 'bg-green-500' },
            { name: 'Vercel', desc: '托管和部署平台', status: '已连接', dot: 'bg-green-500' },
            { name: 'GitHub', desc: '代码仓库和 CI/CD', status: '已连接', dot: 'bg-green-500' },
            { name: '微信开放平台', desc: '社交分享和登录', status: '未配置', dot: 'bg-outline-variant' },
            { name: '阿里云 OSS', desc: '图片存储和 CDN', status: '未配置', dot: 'bg-outline-variant' },
          ].map(svc => (
            <div key={svc.name} className="flex items-center justify-between py-2 px-3 bg-surface-container-low rounded-lg">
              <div className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full ${svc.dot}`} />
                <div><p className="text-sm font-medium">{svc.name}</p><p className="text-[10px] text-secondary">{svc.desc}</p></div>
              </div>
              <span className={`text-xs font-semibold ${svc.status === '已连接' ? 'text-green-700' : 'text-outline'}`}>{svc.status}</span>
            </div>
          ))}
        </div>
      </SettingCard>
    </div>
  )
}

function DataSection() {
  return (
    <div>
      <SettingCard title="数据导出" desc="导出你的平台数据用于分析或备份">
        <div className="space-y-3 max-w-sm">
          {[
            { label: '用户数据', desc: 'CSV 格式，包含所有用户信息', icon: Download },
            { label: '订单记录', desc: 'CSV 格式，包含交易明细', icon: Download },
            { label: '活动日志', desc: 'JSON 格式，完整行为日志', icon: Download },
          ].map(d => (
            <div key={d.label} className="flex items-center justify-between py-2 px-3 bg-surface-container-low rounded-lg">
              <div><p className="text-sm font-medium">{d.label}</p><p className="text-[10px] text-secondary">{d.desc}</p></div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-outline-variant/30 rounded-lg text-xs font-semibold hover:border-primary transition-colors">
                <d.icon size={12} /> 导出
              </button>
            </div>
          ))}
        </div>
      </SettingCard>

      <SettingCard title="危险操作" desc="这些操作不可撤销，请谨慎操作">
        <div className="space-y-3 max-w-sm">
          <div className="flex items-center justify-between py-2 px-3 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center gap-3">
              <Trash2 size={16} className="text-error" />
              <div><p className="text-sm font-semibold text-error">删除所有用户数据</p><p className="text-[10px] text-error/70">永久删除所有用户数据，不可恢复</p></div>
            </div>
            <button className="px-3 py-1.5 bg-error text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">删除</button>
          </div>
          <div className="flex items-center justify-between py-2 px-3 bg-red-50 rounded-lg border border-red-100">
            <div className="flex items-center gap-3">
              <HardDrive size={16} className="text-error" />
              <div><p className="text-sm font-semibold text-error">重置平台数据</p><p className="text-[10px] text-error/70">清空所有数据恢复出厂设置</p></div>
            </div>
            <button className="px-3 py-1.5 bg-error text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity">重置</button>
          </div>
        </div>
      </SettingCard>
    </div>
  )
}

import { useState } from 'react'
import { useAdmin } from '../store/AdminContext'

export default function LoginPage() {
  const { state, dispatch } = useAdmin()
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    dispatch({ type: 'LOGIN', username, password })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-low">
      <div className="w-full max-w-sm bg-surface rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-extrabold text-center mb-2">
          <span className="bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
            逛逛AI
          </span>
        </h1>
        <p className="text-sm text-on-surface-variant text-center mb-8">后台管理系统</p>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">用户名</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container rounded-xl border border-outline-variant focus:border-primary focus:outline-none transition-colors"
              placeholder="请输入用户名"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">密码</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-surface-container rounded-xl border border-outline-variant focus:border-primary focus:outline-none transition-colors"
              placeholder="请输入密码"
            />
          </div>

          {state.loginError && (
            <p className="text-error text-sm text-center mb-4">{state.loginError}</p>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-primary text-on-primary rounded-xl font-semibold active:scale-95 transition-transform"
          >
            登录
          </button>
        </form>
      </div>
    </div>
  )
}

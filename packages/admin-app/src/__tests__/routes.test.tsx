import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { AdminProvider } from '../store/AdminContext'

function renderAdmin() {
  render(
    <MemoryRouter>
      <AdminProvider>
        <App />
      </AdminProvider>
    </MemoryRouter>,
  )
}

describe('Admin App Routes', () => {
  it('shows login page by default', () => {
    renderAdmin()
    expect(screen.getByText('后台管理系统')).toBeDefined()
    expect(screen.getByText('登录')).toBeDefined()
  })

  it('shows login error for wrong credentials', () => {
    renderAdmin()
    const passwordInput = screen.getByPlaceholderText('请输入密码')
    fireEvent.change(passwordInput, { target: { value: 'wrong' } })
    fireEvent.click(screen.getByText('登录'))
    expect(screen.getByText('密码错误')).toBeDefined()
  })

  it('logs in with correct credentials and shows dashboard', async () => {
    renderAdmin()
    const passwordInput = screen.getByPlaceholderText('请输入密码')
    fireEvent.change(passwordInput, { target: { value: '888888' } })
    fireEvent.click(screen.getByText('登录'))
    const headings = await screen.findAllByText('数据看板')
    expect(headings.length).toBeGreaterThanOrEqual(1)
  })
})

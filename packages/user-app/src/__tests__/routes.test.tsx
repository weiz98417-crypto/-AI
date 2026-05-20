import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { AppProvider } from '../store/AppContext'

function renderWithRouter(initialRoute = '/') {
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <AppProvider>
        <App />
      </AppProvider>
    </MemoryRouter>,
  )
}

describe('User App Routes', () => {
  it('renders home page at /', async () => {
    renderWithRouter('/')
    const headings = await screen.findAllByText('逛逛AI')
    expect(headings.length).toBeGreaterThanOrEqual(1)
  })

  it('renders recommend page at /recommend/:occasion', async () => {
    renderWithRouter('/recommend/work-commute')
    const matches = await screen.findAllByText('上班通勤')
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('renders preferences page at /preferences', async () => {
    renderWithRouter('/preferences')
    expect(await screen.findByText('风格偏好')).toBeDefined()
  })

  it('renders favorites page at /favorites', async () => {
    renderWithRouter('/favorites')
    const matches = await screen.findAllByText('我的收藏')
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('renders share page at /share/:outfitId', async () => {
    renderWithRouter('/share/work-commute-1')
    const el = await screen.findByText(/分享|生成|未找到/i)
    expect(el).toBeDefined()
  })
})

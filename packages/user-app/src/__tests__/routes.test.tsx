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
    // After loading, should show "逛逛AI"
    expect(await screen.findByText('逛逛AI')).toBeDefined()
  })

  it('renders recommend page at /recommend/:occasion', async () => {
    renderWithRouter('/recommend/work-commute')
    expect(await screen.findByText('穿搭推荐')).toBeDefined()
  })

  it('renders preferences page at /preferences', async () => {
    renderWithRouter('/preferences')
    expect(await screen.findByText('风格偏好')).toBeDefined()
  })

  it('renders favorites page at /favorites', async () => {
    renderWithRouter('/favorites')
    expect(await screen.findByText('收藏与历史')).toBeDefined()
  })

  it('renders share page at /share/:outfitId', async () => {
    renderWithRouter('/share/work-commute-1')
    // Should show either generating, error, or the share page
    expect(await screen.findByText('分享穿搭')).toBeDefined()
  })
})

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
    const headings = await screen.findAllByText('GuangGuangAI')
    expect(headings.length).toBeGreaterThanOrEqual(1)
    expect(await screen.findByText('Occasion Quick Pick')).toBeDefined()
  })

  it('renders recommend page at /recommend/:occasion', async () => {
    renderWithRouter('/recommend/work-commute')
    const matches = await screen.findAllByText('上班通勤')
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('renders preferences page at /preferences', async () => {
    renderWithRouter('/preferences')
    expect(await screen.findByText('Style Preferences')).toBeDefined()
    expect(await screen.findByText('Color Palette')).toBeDefined()
  })

  it('renders favorites page at /favorites', async () => {
    renderWithRouter('/favorites')
    const matches = await screen.findAllByText('Favorites')
    expect(matches.length).toBeGreaterThanOrEqual(1)
  })

  it('renders share page at /share/:outfitId', async () => {
    renderWithRouter('/share/work-commute-1')
    expect(await screen.findByText('GuangGuangAI')).toBeDefined()
  })
})

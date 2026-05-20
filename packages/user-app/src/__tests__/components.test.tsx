import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import OccasionCard from '../components/OccasionCard'
import OutfitCard from '../components/OutfitCard'
import type { Occasion, Outfit } from '@ggai/shared/types'

const mockOccasion: Occasion = {
  id: 'work-commute',
  name: '上班通勤',
  icon: '🏢',
  description: '适合日常办公室通勤穿搭',
}

const mockOutfit: Outfit = {
  id: 'test-1',
  occasion: 'work-commute',
  name: '知性通勤套装',
  items: [
    { name: '阔腿裤', brand: 'ZARA', price: 299, category: 'bottom', image: '/test.jpg' },
  ],
  totalPrice: 767,
  priceRange: 'mid',
  styleTags: ['简约通勤', '优雅知性'],
  coverImage: '/test.jpg',
  brandSummary: 'ZARA',
}

describe('OccasionCard', () => {
  it('renders occasion name and description', () => {
    render(<OccasionCard occasion={mockOccasion} onClick={() => {}} />)
    expect(screen.getByText('上班通勤')).toBeDefined()
    expect(screen.getByText('适合日常办公室通勤穿搭')).toBeDefined()
  })

  it('shows active styles when active prop is true', () => {
    const { container } = render(<OccasionCard occasion={mockOccasion} onClick={() => {}} active />)
    const btn = container.querySelector('button')
    expect(btn?.className).toContain('bg-primary')
  })
})

describe('OutfitCard', () => {
  it('renders outfit name and price', () => {
    render(
      <MemoryRouter>
        <OutfitCard
          outfit={mockOutfit}
          isFavorited={false}
          isExpanded={false}
          onClick={() => {}}
          onFavorite={() => {}}
          onShare={() => {}}
        />
      </MemoryRouter>,
    )
    expect(screen.getByText('知性通勤套装')).toBeDefined()
    expect(screen.getByText('¥767')).toBeDefined()
    expect(screen.getByText('ZARA')).toBeDefined()
  })

  it('shows filled favorite icon when favorited', () => {
    render(
      <MemoryRouter>
        <OutfitCard
          outfit={mockOutfit}
          isFavorited
          isExpanded={false}
          onClick={() => {}}
          onFavorite={() => {}}
          onShare={() => {}}
        />
      </MemoryRouter>,
    )
    const favBtn = screen.getByText('favorite')
    expect(favBtn).toBeDefined()
  })

  it('expands to show items when isExpanded is true', () => {
    render(
      <MemoryRouter>
        <OutfitCard
          outfit={mockOutfit}
          isFavorited={false}
          isExpanded
          onClick={() => {}}
          onFavorite={() => {}}
          onShare={() => {}}
        />
      </MemoryRouter>,
    )
    expect(screen.getByText('搭配单品')).toBeDefined()
    expect(screen.getByText('阔腿裤')).toBeDefined()
  })
})

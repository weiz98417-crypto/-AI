import type { DashboardMetrics, ManagedOutfit } from '@ggai/shared/types'

export const seedMetrics: DashboardMetrics = {
  todayRevenue: 12580,
  activeUsers: 342,
  orderCount: 89,
  favoriteCount: 156,
  topOccasions: [
    { name: '上班通勤', count: 42 },
    { name: '周末约会', count: 31 },
    { name: '闺蜜聚会', count: 18 },
  ],
}

export const seedAnalytics = {
  styleDistribution: [
    { name: '简约通勤', value: 38 },
    { name: '优雅知性', value: 29 },
    { name: '潮流街头', value: 18 },
    { name: '温柔甜美', value: 15 },
  ],
  colorPreferences: [
    { name: '粉色', count: 89 },
    { name: '白色', count: 72 },
    { name: '黑色', count: 65 },
    { name: '米色', count: 48 },
    { name: '蓝色', count: 35 },
    { name: '灰色', count: 28 },
  ],
}

export const seedManagedOutfits: ManagedOutfit[] = [
  { id: 'work-commute-1', occasion: 'work-commute', name: '知性通勤套装', items: [], totalPrice: 767, priceRange: 'mid', styleTags: ['简约通勤', '优雅知性'], coverImage: '/assets/outfits/work-commute-1-main.svg', brandSummary: 'ANGEL CHEN + ZARA + Charles & Keith', active: true },
  { id: 'work-commute-2', occasion: 'work-commute', name: '优雅西装look', items: [], totalPrice: 1147, priceRange: 'premium', styleTags: ['简约通勤', '职业精英'], coverImage: '/assets/outfits/work-commute-2-main.svg', brandSummary: 'MASSIMO DUTTI + UNIQLO + COS', active: true },
  { id: 'work-commute-3', occasion: 'work-commute', name: '清爽衬衫裙', items: [], totalPrice: 808, priceRange: 'mid', styleTags: ['简约通勤', '温柔甜美'], coverImage: '/assets/outfits/work-commute-3-main.svg', brandSummary: '& Other Stories + Sam Edelman', active: true },
  { id: 'work-commute-4', occasion: 'work-commute', name: '轻松休闲办公', items: [], totalPrice: 677, priceRange: 'mid', styleTags: ['简约通勤', '休闲舒适'], coverImage: '/assets/outfits/work-commute-4-main.svg', brandSummary: 'Everlane + JNBY + UNIQLO', active: true },
  { id: 'client-meeting-1', occasion: 'client-meeting', name: '气场西装套装', items: [], totalPrice: 2897, priceRange: 'luxury', styleTags: ['职业精英', '优雅知性'], coverImage: '/assets/outfits/client-meeting-1-main.svg', brandSummary: 'Theory + Equipment + Stuart Weitzman', active: true },
  { id: 'client-meeting-2', occasion: 'client-meeting', name: '高级感连衣裙', items: [], totalPrice: 1827, priceRange: 'luxury', styleTags: ['优雅知性', '简约通勤'], coverImage: '/assets/outfits/client-meeting-2-main.svg', brandSummary: 'Vince + Mango + Polène', active: true },
  { id: 'client-meeting-3', occasion: 'client-meeting', name: '干练知性风', items: [], totalPrice: 2047, priceRange: 'premium', styleTags: ['简约通勤', '职业精英'], coverImage: '/assets/outfits/client-meeting-3-main.svg', brandSummary: 'COS + Maje + Tod\'s', active: true },
  { id: 'weekend-date-1', occasion: 'weekend-date', name: '碎花浪漫约会', items: [], totalPrice: 1627, priceRange: 'premium', styleTags: ['温柔甜美', '潮流街头'], coverImage: '/assets/outfits/weekend-date-1-main.svg', brandSummary: 'Réalisation Par + Cult Gaia + By Far', active: true },
  { id: 'weekend-date-2', occasion: 'weekend-date', name: '法式少女风', items: [], totalPrice: 1277, priceRange: 'premium', styleTags: ['温柔甜美', '优雅知性'], coverImage: '/assets/outfits/weekend-date-2-main.svg', brandSummary: 'Sézane + ZARA + Carel', active: true },
  { id: 'weekend-date-3', occasion: 'weekend-date', name: '甜酷休闲约会', items: [], totalPrice: 848, priceRange: 'mid', styleTags: ['潮流街头', '温柔甜美'], coverImage: '/assets/outfits/weekend-date-3-main.svg', brandSummary: 'For Love & Lemons + Levi\'s', active: true },
  { id: 'girls-gathering-1', occasion: 'girls-gathering', name: '派对亮片裙', items: [], totalPrice: 2198, priceRange: 'luxury', styleTags: ['潮流街头', '温柔甜美'], coverImage: '/assets/outfits/girls-gathering-1-main.svg', brandSummary: 'The Attico + Jacquemus', active: true },
  { id: 'girls-gathering-2', occasion: 'girls-gathering', name: '街头酷女孩', items: [], totalPrice: 1677, priceRange: 'premium', styleTags: ['潮流街头', '休闲舒适'], coverImage: '/assets/outfits/girls-gathering-2-main.svg', brandSummary: 'Acne Studios + Stüssy + Dickies', active: true },
  { id: 'girls-gathering-3', occasion: 'girls-gathering', name: '甜酷缎面look', items: [], totalPrice: 1298, priceRange: 'premium', styleTags: ['温柔甜美', '潮流街头'], coverImage: '/assets/outfits/girls-gathering-3-main.svg', brandSummary: 'Ganni + Dr. Martens', active: true },
]

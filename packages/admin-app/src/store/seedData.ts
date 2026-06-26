import type { DashboardMetrics, ManagedOutfit } from '../shared/types'

export const seedMetrics: DashboardMetrics = {
  todayRevenue: 125800,
  activeUsers: 3420,
  orderCount: 1289,
  favoriteCount: 8156,
  topOccasions: [
    { name: '上班通勤', count: 42156 },
    { name: '周末约会', count: 31890 },
    { name: '闺蜜聚会', count: 18234 },
  ],
}

export interface Activity {
  name: string
  action: string
  time: string
}

export const seedActivities: Activity[] = [
  { name: 'Sophie Chen', action: 'Saved "Pink Pastel Bliss" outfit', time: '2m ago' },
  { name: 'Marco Rossi', action: 'Applied for premium membership', time: '15m ago' },
  { name: 'Julia Zhang', action: 'Shared a recommendation via WeChat', time: '32m ago' },
  { name: 'Leo Kim', action: 'Updated profile measurement data', time: '1h ago' },
  { name: 'Emma Watson', action: 'Purchased through "Office Chic" link', time: '2h ago' },
  { name: 'Lily Wang', action: 'Saved "Spring Minimalist" outfit', time: '3h ago' },
  { name: 'Tom Huang', action: 'Viewed "Urban Silk Path" 5 times', time: '4h ago' },
]

export interface StyleBar {
  name: string
  pct: number
  color: string
}

export const seedStyleBars: StyleBar[] = [
  { name: '简约通勤', pct: 42, color: 'bg-primary-container' },
  { name: '优雅知性', pct: 28, color: 'bg-primary' },
  { name: '波西米亚', pct: 18, color: 'bg-tertiary-container' },
  { name: '街头轻奢', pct: 12, color: 'bg-secondary-container' },
]

export interface ColorPref {
  name: string
  hex: string
  pct: number
}

export const seedColorPrefs: ColorPref[] = [
  { name: '珊瑚粉', hex: '#E8A0B9', pct: 35 },
  { name: '天蓝色', hex: '#A0BEE8', pct: 24 },
  { name: '灰绿色', hex: '#D4E2D4', pct: 19 },
  { name: '午夜黑', hex: '#342F30', pct: 15 },
]

export interface Cohort {
  label: string
  values: (number | null)[]
}

export const seedCohorts: Cohort[] = [
  { label: '8月1日', values: [100, 82, 75, 68, 52, 48, 41, 35] },
  { label: '8月8日', values: [100, 85, 78, 72, 64, 59, 55, null] },
  { label: '8月15日', values: [100, 88, 81, 76, 69, 65, null, null] },
]

export interface InsightCard {
  title: string
  value: string
  change: string
  up: boolean
  color: string
}

export const seedInsightCards: InsightCard[] = [
  { title: '转化率', value: '12.4%', change: '+2.4% 较上周', up: true, color: 'bg-primary/10' },
  { title: '活跃用户', value: '1,842', change: '12分钟前更新', up: true, color: 'bg-tertiary/10' },
  { title: '用户满意度', value: '88%', change: '', up: true, color: 'bg-secondary/10' },
]

export interface TrendingItem {
  label: string
  name: string
  subtitle: string
}

export const seedTrending: TrendingItem[] = [
  { label: 'Trending Now', name: 'Spring Minimalist', subtitle: '2.4k saves this hour' },
  { label: 'Rising Star', name: 'Urban Silk Path', subtitle: '1.1k saves this hour' },
]

export const seedChartDaily = [60, 75, 55, 80, 70, 90, 65]
export const seedChartWeekly = [420, 510, 480, 560, 530, 610, 580]
export const seedChartDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

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
  { id: 'work-commute-1', occasion: 'work-commute', name: '知性通勤套装', items: [], totalPrice: 767, priceRange: 'mid', styleTags: ['简约通勤', '优雅知性'], coverImage: '/assets/outfits/work-commute-1-main.jpg', brandSummary: 'ANGEL CHEN + ZARA + Charles & Keith', active: true },
  { id: 'work-commute-2', occasion: 'work-commute', name: '优雅西装look', items: [], totalPrice: 1147, priceRange: 'premium', styleTags: ['简约通勤', '职业精英'], coverImage: '/assets/outfits/work-commute-2-main.jpg', brandSummary: 'MASSIMO DUTTI + UNIQLO + COS', active: true },
  { id: 'work-commute-3', occasion: 'work-commute', name: '清爽衬衫裙', items: [], totalPrice: 808, priceRange: 'mid', styleTags: ['简约通勤', '温柔甜美'], coverImage: '/assets/outfits/work-commute-3-main.jpg', brandSummary: '& Other Stories + Sam Edelman', active: true },
  { id: 'work-commute-4', occasion: 'work-commute', name: '轻松休闲办公', items: [], totalPrice: 677, priceRange: 'mid', styleTags: ['简约通勤', '休闲舒适'], coverImage: '/assets/outfits/work-commute-4-main.jpg', brandSummary: 'Everlane + JNBY + UNIQLO', active: true },
  { id: 'client-meeting-1', occasion: 'client-meeting', name: '气场西装套装', items: [], totalPrice: 2897, priceRange: 'luxury', styleTags: ['职业精英', '优雅知性'], coverImage: '/assets/outfits/client-meeting-1-main.jpg', brandSummary: 'Theory + Equipment + Stuart Weitzman', active: true },
  { id: 'client-meeting-2', occasion: 'client-meeting', name: '高级感连衣裙', items: [], totalPrice: 1827, priceRange: 'luxury', styleTags: ['优雅知性', '简约通勤'], coverImage: '/assets/outfits/client-meeting-2-main.jpg', brandSummary: 'Vince + Mango + Polène', active: true },
  { id: 'client-meeting-3', occasion: 'client-meeting', name: '干练知性风', items: [], totalPrice: 2047, priceRange: 'premium', styleTags: ['简约通勤', '职业精英'], coverImage: '/assets/outfits/client-meeting-3-main.jpg', brandSummary: 'COS + Maje + Tod\'s', active: true },
  { id: 'weekend-date-1', occasion: 'weekend-date', name: '碎花浪漫约会', items: [], totalPrice: 1627, priceRange: 'premium', styleTags: ['温柔甜美', '潮流街头'], coverImage: '/assets/outfits/weekend-date-1-main.jpg', brandSummary: 'Réalisation Par + Cult Gaia + By Far', active: true },
  { id: 'weekend-date-2', occasion: 'weekend-date', name: '法式少女风', items: [], totalPrice: 1277, priceRange: 'premium', styleTags: ['温柔甜美', '优雅知性'], coverImage: '/assets/outfits/weekend-date-2-main.jpg', brandSummary: 'Sézane + ZARA + Carel', active: true },
  { id: 'weekend-date-3', occasion: 'weekend-date', name: '甜酷休闲约会', items: [], totalPrice: 848, priceRange: 'mid', styleTags: ['潮流街头', '温柔甜美'], coverImage: '/assets/outfits/weekend-date-3-main.jpg', brandSummary: 'For Love & Lemons + Levi\'s', active: true },
  { id: 'girls-gathering-1', occasion: 'girls-gathering', name: '派对亮片裙', items: [], totalPrice: 2198, priceRange: 'luxury', styleTags: ['潮流街头', '温柔甜美'], coverImage: '/assets/outfits/girls-gathering-1-main.jpg', brandSummary: 'The Attico + Jacquemus', active: true },
  { id: 'girls-gathering-2', occasion: 'girls-gathering', name: '街头酷女孩', items: [], totalPrice: 1677, priceRange: 'premium', styleTags: ['潮流街头', '休闲舒适'], coverImage: '/assets/outfits/girls-gathering-2-main.jpg', brandSummary: 'Acne Studios + Stüssy + Dickies', active: true },
  { id: 'girls-gathering-3', occasion: 'girls-gathering', name: '甜酷缎面look', items: [], totalPrice: 1298, priceRange: 'premium', styleTags: ['温柔甜美', '潮流街头'], coverImage: '/assets/outfits/girls-gathering-3-main.jpg', brandSummary: 'Ganni + Dr. Martens', active: true },
  { id: 'work-commute-5', occasion: 'work-commute', name: '知性风衣通勤', items: [], totalPrice: 2047, priceRange: 'premium', styleTags: ['简约通勤', '优雅知性'], coverImage: '/assets/outfits/work-commute-5-main.jpg', brandSummary: 'Burberry + Everlane + JNBY', active: true },
  { id: 'work-commute-6', occasion: 'work-commute', name: '高级极简通勤', items: [], totalPrice: 3047, priceRange: 'luxury', styleTags: ['简约通勤', '职业精英'], coverImage: '/assets/outfits/work-commute-6-main.jpg', brandSummary: 'Max Mara + Theory + Uniqlo', active: true },
  { id: 'client-meeting-4', occasion: 'client-meeting', name: '格纹精英套装', items: [], totalPrice: 5297, priceRange: 'luxury', styleTags: ['职业精英', '优雅知性'], coverImage: '/assets/outfits/client-meeting-4-main.jpg', brandSummary: 'Burberry + Totême + YSL', active: true },
  { id: 'client-meeting-5', occasion: 'client-meeting', name: '奢华商务会面', items: [], totalPrice: 6197, priceRange: 'luxury', styleTags: ['职业精英', '优雅知性'], coverImage: '/assets/outfits/client-meeting-5-main.jpg', brandSummary: 'The Row + Brunello Cucinelli + Prada', active: true },
  { id: 'weekend-date-4', occasion: 'weekend-date', name: '春季约会针织', items: [], totalPrice: 3097, priceRange: 'luxury', styleTags: ['温柔甜美', '优雅知性'], coverImage: '/assets/outfits/weekend-date-4-main.jpg', brandSummary: 'GANNI + Maje + Loewe', active: true },
  { id: 'weekend-date-5', occasion: 'weekend-date', name: '法式田园约会', items: [], totalPrice: 1677, priceRange: 'premium', styleTags: ['优雅知性', '温柔甜美'], coverImage: '/assets/outfits/weekend-date-5-main.jpg', brandSummary: 'Rixo + Levi\'s + Castaner', active: true },
  { id: 'weekend-date-6', occasion: 'weekend-date', name: '波西米亚晚霞', items: [], totalPrice: 4797, priceRange: 'luxury', styleTags: ['潮流街头', '优雅知性'], coverImage: '/assets/outfits/weekend-date-6-main.jpg', brandSummary: 'Isabel Marant + Chloé + Chloé', active: true },
  { id: 'girls-gathering-4', occasion: 'girls-gathering', name: '酷感闺蜜派对', items: [], totalPrice: 2597, priceRange: 'luxury', styleTags: ['潮流街头', '休闲舒适'], coverImage: '/assets/outfits/girls-gathering-4-main.jpg', brandSummary: 'Balenciaga + Urban Outfitters + COS', active: true },
  { id: 'girls-gathering-5', occasion: 'girls-gathering', name: '精致蕾丝晚宴', items: [], totalPrice: 4397, priceRange: 'luxury', styleTags: ['温柔甜美', '优雅知性'], coverImage: '/assets/outfits/girls-gathering-5-main.jpg', brandSummary: 'Self-Portrait + Jimmy Choo + Shrimps', active: true },
]

import type { AdminUser, AdminOrder } from '../shared/types'

export const seedUsers: AdminUser[] = [
  { id: 'u1', name: 'Sophie Chen', avatar: 'SC', email: 'sophie@example.com', joinDate: '2026-05-12', orderCount: 8, totalSpent: 4260, status: 'active' },
  { id: 'u2', name: 'Marco Rossi', avatar: 'MR', email: 'marco@example.com', joinDate: '2026-05-15', orderCount: 3, totalSpent: 1820, status: 'active' },
  { id: 'u3', name: 'Julia Zhang', avatar: 'JZ', email: 'julia@example.com', joinDate: '2026-05-18', orderCount: 12, totalSpent: 8900, status: 'active' },
  { id: 'u4', name: 'Leo Kim', avatar: 'LK', email: 'leo@example.com', joinDate: '2026-05-20', orderCount: 1, totalSpent: 450, status: 'active' },
  { id: 'u5', name: 'Emma Watson', avatar: 'EW', email: 'emma@example.com', joinDate: '2026-05-22', orderCount: 5, totalSpent: 3200, status: 'active' },
  { id: 'u6', name: 'Lily Wang', avatar: 'LW', email: 'lily@example.com', joinDate: '2026-05-25', orderCount: 2, totalSpent: 980, status: 'active' },
  { id: 'u7', name: 'Tom Huang', avatar: 'TH', email: 'tom@example.com', joinDate: '2026-05-28', orderCount: 0, totalSpent: 0, status: 'banned' },
  { id: 'u8', name: 'Anna Li', avatar: 'AL', email: 'anna@example.com', joinDate: '2026-06-01', orderCount: 4, totalSpent: 2100, status: 'active' },
  { id: 'u9', name: 'David Wu', avatar: 'DW', email: 'david@example.com', joinDate: '2026-06-03', orderCount: 6, totalSpent: 4500, status: 'active' },
  { id: 'u10', name: 'Grace Zhou', avatar: 'GZ', email: 'grace@example.com', joinDate: '2026-06-05', orderCount: 1, totalSpent: 670, status: 'active' },
  { id: 'u11', name: 'Mike Yang', avatar: 'MY', email: 'mike@example.com', joinDate: '2026-06-08', orderCount: 0, totalSpent: 0, status: 'banned' },
  { id: 'u12', name: 'Cathy Sun', avatar: 'CS', email: 'cathy@example.com', joinDate: '2026-06-10', orderCount: 3, totalSpent: 1680, status: 'active' },
  { id: 'u13', name: 'Ryan Deng', avatar: 'RD', email: 'ryan@example.com', joinDate: '2026-06-12', orderCount: 7, totalSpent: 5600, status: 'active' },
  { id: 'u14', name: 'Vivian He', avatar: 'VH', email: 'vivian@example.com', joinDate: '2026-06-15', orderCount: 2, totalSpent: 1200, status: 'active' },
  { id: 'u15', name: 'Jack Feng', avatar: 'JF', email: 'jack@example.com', joinDate: '2026-06-18', orderCount: 0, totalSpent: 0, status: 'active' },
  { id: 'u16', name: 'Iris Tao', avatar: 'IT', email: 'iris@example.com', joinDate: '2026-06-20', orderCount: 9, totalSpent: 7200, status: 'active' },
]

export const seedOrders: AdminOrder[] = [
  { id: 'ord1', userId: 'u1', userName: 'Sophie Chen', items: '知性通勤套装', amount: 767, status: 'delivered', date: '2026-06-20' },
  { id: 'ord2', userId: 'u3', userName: 'Julia Zhang', items: '气场西装套装', amount: 2897, status: 'delivered', date: '2026-06-19' },
  { id: 'ord3', userId: 'u2', userName: 'Marco Rossi', items: '优雅西装look', amount: 1147, status: 'shipped', date: '2026-06-21' },
  { id: 'ord4', userId: 'u5', userName: 'Emma Watson', items: '碎花浪漫约会', amount: 1627, status: 'delivered', date: '2026-06-18' },
  { id: 'ord5', userId: 'u1', userName: 'Sophie Chen', items: '派对亮片裙', amount: 2198, status: 'pending', date: '2026-06-22' },
  { id: 'ord6', userId: 'u6', userName: 'Lily Wang', items: '清爽衬衫裙', amount: 808, status: 'shipped', date: '2026-06-20' },
  { id: 'ord7', userId: 'u9', userName: 'David Wu', items: '高级感连衣裙', amount: 1827, status: 'delivered', date: '2026-06-17' },
  { id: 'ord8', userId: 'u4', userName: 'Leo Kim', items: '轻松休闲办公', amount: 677, status: 'cancelled', date: '2026-06-16' },
  { id: 'ord9', userId: 'u8', userName: 'Anna Li', items: '法式少女风', amount: 1277, status: 'pending', date: '2026-06-22' },
  { id: 'ord10', userId: 'u3', userName: 'Julia Zhang', items: '干练知性风', amount: 2047, status: 'delivered', date: '2026-06-15' },
  { id: 'ord11', userId: 'u13', userName: 'Ryan Deng', items: '街头酷女孩', amount: 1677, status: 'shipped', date: '2026-06-21' },
  { id: 'ord12', userId: 'u12', userName: 'Cathy Sun', items: '甜酷休闲约会', amount: 848, status: 'delivered', date: '2026-06-14' },
  { id: 'ord13', userId: 'u3', userName: 'Julia Zhang', items: '甜酷缎面look', amount: 1298, status: 'pending', date: '2026-06-22' },
  { id: 'ord14', userId: 'u10', userName: 'Grace Zhou', items: '知性通勤套装', amount: 767, status: 'shipped', date: '2026-06-20' },
  { id: 'ord15', userId: 'u14', userName: 'Vivian He', items: '优雅西装look', amount: 1147, status: 'delivered', date: '2026-06-13' },
  { id: 'ord16', userId: 'u5', userName: 'Emma Watson', items: '派对亮片裙', amount: 2198, status: 'pending', date: '2026-06-23' },
  { id: 'ord17', userId: 'u16', userName: 'Iris Tao', items: '气场西装套装', amount: 2897, status: 'delivered', date: '2026-06-12' },
  { id: 'ord18', userId: 'u9', userName: 'David Wu', items: '碎花浪漫约会', amount: 1627, status: 'shipped', date: '2026-06-21' },
  { id: 'ord19', userId: 'u13', userName: 'Ryan Deng', items: '高级感连衣裙', amount: 1827, status: 'delivered', date: '2026-06-11' },
  { id: 'ord20', userId: 'u1', userName: 'Sophie Chen', items: '法式少女风', amount: 1277, status: 'cancelled', date: '2026-06-10' },
]

export const seedAllActivities = [
  ...seedActivities,
  { name: 'Anna Li', action: 'Purchased "知性通勤套装"', time: '5h ago' },
  { name: 'David Wu', action: 'Shared "碎花浪漫约会" to WeChat', time: '6h ago' },
  { name: 'Cathy Sun', action: 'Favorited 3 outfits', time: '7h ago' },
  { name: 'Ryan Deng', action: 'Completed style preference survey', time: '8h ago' },
  { name: 'Grace Zhou', action: 'Viewed "高级感连衣裙" detail', time: '9h ago' },
  { name: 'Iris Tao', action: 'Purchased "气场西装套装"', time: '10h ago' },
  { name: 'Vivian He', action: 'Applied promo code GGAI20', time: '11h ago' },
  { name: 'Mike Yang', action: 'Account suspended', time: '12h ago' },
  { name: 'Jack Feng', action: 'Registered new account', time: '1d ago' },
  { name: 'Sophie Chen', action: 'Purchased "法式少女风"', time: '1d ago' },
  { name: 'Marco Rossi', action: 'Left a 5-star review', time: '1d ago' },
  { name: 'Julia Zhang', action: 'Referred a friend', time: '1d ago' },
  { name: 'Leo Kim', action: 'Updated shipping address', time: '2d ago' },
  { name: 'Emma Watson', action: 'Purchased "派对亮片裙"', time: '2d ago' },
  { name: 'Lily Wang', action: 'Browsed weekend-date outfits', time: '2d ago' },
  { name: 'Tom Huang', action: 'Account reinstated', time: '2d ago' },
  { name: 'Anna Li', action: 'Saved "甜酷缎面look" to wishlist', time: '3d ago' },
  { name: 'David Wu', action: 'Purchased "碎花浪漫约会"', time: '3d ago' },
  { name: 'Cathy Sun', action: 'Shared "街头酷女孩" via Moments', time: '3d ago' },
  { name: 'Ryan Deng', action: 'Completed first purchase', time: '3d ago' },
]

export const OUTFIT_IMAGE_POOL: Record<string, string[]> = {
  'work-commute': [
    '/assets/outfits/work-commute-1-main.jpg',
    '/assets/outfits/work-commute-2-main.jpg',
    '/assets/outfits/work-commute-3-main.jpg',
    '/assets/outfits/work-commute-4-main.jpg',
    '/assets/outfits/work-commute-5-main.jpg',
    '/assets/outfits/work-commute-6-main.jpg',
  ],
  'client-meeting': [
    '/assets/outfits/client-meeting-1-main.jpg',
    '/assets/outfits/client-meeting-2-main.jpg',
    '/assets/outfits/client-meeting-3-main.jpg',
    '/assets/outfits/client-meeting-4-main.jpg',
    '/assets/outfits/client-meeting-5-main.jpg',
  ],
  'weekend-date': [
    '/assets/outfits/weekend-date-1-main.jpg',
    '/assets/outfits/weekend-date-2-main.jpg',
    '/assets/outfits/weekend-date-3-main.jpg',
    '/assets/outfits/weekend-date-4-main.jpg',
    '/assets/outfits/weekend-date-5-main.jpg',
    '/assets/outfits/weekend-date-6-main.jpg',
  ],
  'girls-gathering': [
    '/assets/outfits/girls-gathering-1-main.jpg',
    '/assets/outfits/girls-gathering-2-main.jpg',
    '/assets/outfits/girls-gathering-3-main.jpg',
    '/assets/outfits/girls-gathering-4-main.jpg',
    '/assets/outfits/girls-gathering-5-main.jpg',
  ],
}

// ---- Bulk data generators (1000+ records) ----

const FIRST_NAMES = ['Sophie','Marco','Julia','Leo','Emma','Lily','Tom','Anna','David','Grace','Mike','Cathy','Ryan','Vivian','Jack','Iris','Olivia','Ethan','Mia','Noah','Ava','Liam','Isabella','Lucas','Zoe','Elijah','Harper','James','Ella','Logan','Scarlett','Mason','Chloe','Ben','Luna','Henry','Riley','Alex','Nora','Seb','Maya','Dan','Aria','Chris','Emily','Nick','Eva','Owen','Aiden']
const LAST_NAMES = ['Chen','Rossi','Zhang','Kim','Wang','Huang','Li','Wu','Zhou','Yang','Sun','Deng','He','Feng','Tao','Liu','Xu','Shen','Cao','Ma','Lin','Guo','Xie','Peng','Jin','Ren','Su','Fang','Jiang','Tan','Wen','Dai','Shi','Du','Pan','Yuan','Cheng','Bao','Song','Xiang','Tang','Zeng','Lei','Bai','Wei','Long','Shao','Hong']

const ACTIONS = [
  'Saved {outfit} outfit','Purchased {outfit}','Shared {outfit} via WeChat',
  'Viewed {outfit} detail','Favorited {outfit}','Added {outfit} to cart',
  'Applied promo code GGAI20','Updated profile photo','Completed style survey',
  'Left a 5-star review','Referred a friend','Updated shipping address',
  'Browsed {occasion} outfits','Registered new account','Reset password',
  'Uploaded outfit photo','Left a comment on {outfit}','Unfavorited {outfit}',
]

const OUTFIT_NAMES = ['知性通勤套装','优雅西装look','清爽衬衫裙','轻松休闲办公','知性风衣通勤','高级极简通勤','气场西装套装','高级感连衣裙','干练知性风','格纹精英套装','奢华商务会面','碎花浪漫约会','法式少女风','甜酷休闲约会','春季约会针织','法式田园约会','波西米亚晚霞','派对亮片裙','街头酷女孩','甜酷缎面look','酷感闺蜜派对','精致蕾丝晚宴']
const OCCASIONS = ['work-commute','client-meeting','weekend-date','girls-gathering']
const ORDER_STATUSES: AdminOrder['status'][] = ['pending','shipped','delivered','cancelled']

function rand(min: number, max: number) { return Math.floor(Math.random() * (max - min + 1)) + min }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)] }
function genDate(daysBack: number) {
  const d = new Date(); d.setDate(d.getDate() - daysBack)
  return d.toISOString().slice(0, 10)
}
function genTime() {
  const units = ['m ago','h ago','h ago','h ago','h ago','1d ago','1d ago','2d ago','3d ago','1w ago']
  return pick(units).replace('m', String(rand(1, 59))).replace('h', String(rand(1, 23)))
}

export function generateBulkUsers(count: number): import('../shared/types').AdminUser[] {
  const users: import('../shared/types').AdminUser[] = []
  for (let i = 0; i < count; i++) {
    const fn = pick(FIRST_NAMES); const ln = pick(LAST_NAMES)
    users.push({
      id: `u${i + 100}`,
      name: `${fn} ${ln}`,
      avatar: (fn[0] + ln[0]).toUpperCase(),
      email: `${fn.toLowerCase()}.${ln.toLowerCase()}${rand(1,999)}@example.com`,
      joinDate: genDate(rand(5, 365)),
      orderCount: rand(0, 25),
      totalSpent: rand(0, 15000),
      status: Math.random() > 0.05 ? 'active' : 'banned',
    })
  }
  return users
}

export function generateBulkOrders(count: number): import('../shared/types').AdminOrder[] {
  const orders: import('../shared/types').AdminOrder[] = []
  for (let i = 0; i < count; i++) {
    const fn = pick(FIRST_NAMES); const ln = pick(LAST_NAMES)
    orders.push({
      id: `ord${i + 100}`,
      userId: `u${rand(0, 1499)}`,
      userName: `${fn} ${ln}`,
      items: pick(OUTFIT_NAMES),
      amount: rand(299, 6197),
      status: pick(ORDER_STATUSES),
      date: genDate(rand(1, 90)),
    })
  }
  return orders.sort((a, b) => b.date.localeCompare(a.date))
}

export function generateBulkActivities(count: number) {
  const acts: { name: string; action: string; time: string }[] = []
  for (let i = 0; i < count; i++) {
    const fn = pick(FIRST_NAMES); const ln = pick(LAST_NAMES)
    const action = pick(ACTIONS).replace('{outfit}', pick(OUTFIT_NAMES)).replace('{occasion}', pick(OCCASIONS))
    acts.push({ name: `${fn} ${ln}`, action, time: genTime() })
  }
  return acts
}

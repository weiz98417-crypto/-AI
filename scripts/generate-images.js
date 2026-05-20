const fs = require('fs')
const path = require('path')

// Fashion color palette for each occasion
const occasionColors = {
  'work-commute': { bg: '#f0eded', accent: '#874c63', text: '#1b1c1c', label: '上班通勤' },
  'client-meeting': { bg: '#e4e2e1', accent: '#605e5e', text: '#1b1c1c', label: '客户会议' },
  'weekend-date': { bg: '#ffd9e4', accent: '#874c63', text: '#1b1c1c', label: '周末约会' },
  'girls-gathering': { bg: '#fcb2cb', accent: '#6c354b', text: '#1b1c1c', label: '闺蜜聚会' },
}

const outfits = [
  { id: 'work-commute-1', name: '知性通勤套装', occasion: 'work-commute', price: 767, priceRange: 'mid' },
  { id: 'work-commute-2', name: '优雅西装look', occasion: 'work-commute', price: 1147, priceRange: 'premium' },
  { id: 'work-commute-3', name: '清爽衬衫裙', occasion: 'work-commute', price: 808, priceRange: 'mid' },
  { id: 'work-commute-4', name: '轻松休闲办公', occasion: 'work-commute', price: 677, priceRange: 'mid' },
  { id: 'client-meeting-1', name: '气场西装套装', occasion: 'client-meeting', price: 2897, priceRange: 'luxury' },
  { id: 'client-meeting-2', name: '高级感连衣裙', occasion: 'client-meeting', price: 1827, priceRange: 'luxury' },
  { id: 'client-meeting-3', name: '干练知性风', occasion: 'client-meeting', price: 2047, priceRange: 'premium' },
  { id: 'weekend-date-1', name: '碎花浪漫约会', occasion: 'weekend-date', price: 1627, priceRange: 'premium' },
  { id: 'weekend-date-2', name: '法式少女风', occasion: 'weekend-date', price: 1277, priceRange: 'premium' },
  { id: 'weekend-date-3', name: '甜酷休闲约会', occasion: 'weekend-date', price: 848, priceRange: 'mid' },
  { id: 'girls-gathering-1', name: '派对亮片裙', occasion: 'girls-gathering', price: 2198, priceRange: 'luxury' },
  { id: 'girls-gathering-2', name: '街头酷女孩', occasion: 'girls-gathering', price: 1677, priceRange: 'premium' },
  { id: 'girls-gathering-3', name: '甜酷缎面look', occasion: 'girls-gathering', price: 1298, priceRange: 'premium' },
]

// Item types with emoji-like simple icons
const itemIcons = {
  top: '👚', bottom: '👖', outerwear: '🧥', dress: '👗', shoes: '👠', accessory: '👜'
}

function generateMainSVG(outfit) {
  const colors = occasionColors[outfit.occasion]
  return `<svg xmlns="http://www.w3.org/2000/svg" width="750" height="1000" viewBox="0 0 750 1000">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${colors.bg}"/>
      <stop offset="100%" stop-color="${colors.accent}" stop-opacity="0.15"/>
    </linearGradient>
  </defs>
  <rect width="750" height="1000" fill="url(#bg)"/>
  <!-- Decorative circles -->
  <circle cx="150" cy="180" r="120" fill="${colors.accent}" opacity="0.08"/>
  <circle cx="600" cy="800" r="200" fill="${colors.accent}" opacity="0.06"/>
  <circle cx="580" cy="200" r="60" fill="${colors.accent}" opacity="0.1"/>
  <!-- Mannequin silhouette -->
  <g transform="translate(375,340)" fill="${colors.accent}" opacity="0.25">
    <ellipse cx="0" cy="-60" rx="70" ry="80"/>
    <rect x="-50" y="20" width="100" height="180" rx="20"/>
  </g>
  <!-- Style dots -->
  <g fill="${colors.accent}" opacity="0.3">
    <circle cx="320" cy="250" r="4"/>
    <circle cx="340" cy="250" r="4"/>
    <circle cx="330" cy="270" r="4"/>
  </g>
  <!-- Bottom info bar -->
  <rect x="40" y="780" width="670" height="180" rx="24" fill="#ffffff" opacity="0.9"/>
  <!-- Outfit name -->
  <text x="80" y="840" font-family="Plus Jakarta Sans, sans-serif" font-size="36" font-weight="700" fill="${colors.text}">${outfit.name}</text>
  <!-- Occasion badge -->
  <rect x="80" y="865" width="110" height="36" rx="18" fill="${colors.accent}" opacity="0.15"/>
  <text x="135" y="890" font-family="Plus Jakarta Sans, sans-serif" font-size="20" fill="${colors.accent}" text-anchor="middle" font-weight="600">${colors.label}</text>
  <!-- Price -->
  <text x="630" y="900" font-family="Plus Jakarta Sans, sans-serif" font-size="42" font-weight="800" fill="${colors.accent}" text-anchor="end">¥${outfit.price}</text>
  <!-- Brand line -->
  <text x="650" y="940" font-family="Plus Jakarta Sans, sans-serif" font-size="18" fill="#837377" text-anchor="end">逛逛AI · AI穿搭推荐</text>
</svg>`
}

function generateItemSVG(itemName, category, idx) {
  const colorPairs = [
    ['#ffd9e4', '#6c354b'], ['#e6e1e1', '#484647'], ['#ffd9e4', '#874c63'],
    ['#e8a0b9', '#ffffff'], ['#fcb2cb', '#370a1f'], ['#f0eded', '#874c63'],
  ]
  const [bg, accent] = colorPairs[idx % colorPairs.length]
  const icon = itemIcons[category] || '👗'

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <rect width="400" height="400" rx="20" fill="${bg}"/>
  <text x="200" y="200" font-family="Arial, sans-serif" font-size="80" text-anchor="middle" dominant-baseline="central">${icon}</text>
  <rect x="20" y="320" width="360" height="60" rx="12" fill="${accent}" opacity="0.12"/>
  <text x="200" y="358" font-family="Plus Jakarta Sans, sans-serif" font-size="22" font-weight="600" fill="${accent}" text-anchor="middle">${itemName}</text>
</svg>`
}

// Generate all images
const outDir = path.join(__dirname, 'assets', 'outfits')
fs.mkdirSync(outDir, { recursive: true })

for (const o of outfits) {
  // Main image
  const mainSvg = generateMainSVG(o)
  fs.writeFileSync(path.join(outDir, `${o.id}-main.svg`), mainSvg)
  console.log(`Created ${o.id}-main.svg`)

  // Item images (3 items each - top, bottom, shoes)
  const categories = ['top', 'bottom', 'shoes']
  const itemNames = ['上衣', '下装', '鞋子']
  for (let i = 0; i < 3; i++) {
    const itemSvg = generateItemSVG(itemNames[i], categories[i], i)
    fs.writeFileSync(path.join(outDir, `${o.id}-item${i + 1}.svg`), itemSvg)
    console.log(`Created ${o.id}-item${i + 1}.svg`)
  }
}

console.log('\nDone! Generated', outfits.length, 'main images +', outfits.length * 3, 'item images')

const fs = require('fs')
const path = require('path')

const softColors = [
  ['#D4A8B5', '#8B5E6B'], ['#C9B8C4', '#7A6B78'], ['#E8D5C4', '#B8956E'],
  ['#D5C2C6', '#9B858A'], ['#E6E1E1', '#8A8585'], ['#FFD9E4', '#C9809A'],
  ['#F5F0F0', '#B8AEAE'], ['#E4D5D0', '#A8938D'], ['#F0E8E0', '#C4B5A8'],
  ['#E8A0B9', '#B8708C'], ['#DCC8C4', '#A8908C'], ['#FCE4E4', '#D4A0A0'],
  ['#EDE0D4', '#C4B0A0'],
]

const occasionLabels = {
  'work-commute': 'Office Look',
  'client-meeting': 'Meeting Style',
  'weekend-date': 'Date Outfit',
  'girls-gathering': 'Brunch Vibes',
}

const outfits = [
  { id: 'work-commute-1', name: '知性通勤套装', occasion: 'work-commute', colors: 0 },
  { id: 'work-commute-2', name: '优雅西装look', occasion: 'work-commute', colors: 1 },
  { id: 'work-commute-3', name: '清爽衬衫裙', occasion: 'work-commute', colors: 2 },
  { id: 'work-commute-4', name: '轻松休闲办公', occasion: 'work-commute', colors: 3 },
  { id: 'client-meeting-1', name: '气场西装套装', occasion: 'client-meeting', colors: 4 },
  { id: 'client-meeting-2', name: '高级感连衣裙', occasion: 'client-meeting', colors: 5 },
  { id: 'client-meeting-3', name: '干练知性风', occasion: 'client-meeting', colors: 6 },
  { id: 'weekend-date-1', name: '碎花浪漫约会', occasion: 'weekend-date', colors: 7 },
  { id: 'weekend-date-2', name: '法式少女风', occasion: 'weekend-date', colors: 8 },
  { id: 'weekend-date-3', name: '甜酷休闲约会', occasion: 'weekend-date', colors: 9 },
  { id: 'girls-gathering-1', name: '派对亮片裙', occasion: 'girls-gathering', colors: 10 },
  { id: 'girls-gathering-2', name: '街头酷女孩', occasion: 'girls-gathering', colors: 11 },
  { id: 'girls-gathering-3', name: '甜酷缎面look', occasion: 'girls-gathering', colors: 12 },
]

function generateMainSVG(outfit) {
  const [c1, c2] = softColors[outfit.colors]
  const occasionLabel = occasionLabels[outfit.occasion] || 'Style'

  return `<svg xmlns="http://www.w3.org/2000/svg" width="750" height="1000" viewBox="0 0 750 1000">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/><stop offset="50%" stop-color="${c1}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="${c2}" stop-opacity="0.6"/>
    </linearGradient>
    <linearGradient id="shine" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.25"/>
      <stop offset="40%" stop-color="#ffffff" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.08"/>
    </linearGradient>
  </defs>
  <!-- Base -->
  <rect width="750" height="1000" fill="url(#bg)"/>
  <rect width="750" height="1000" fill="url(#shine)"/>
  <!-- Subtle pattern -->
  <g opacity="0.06" fill="${c2}">
    <circle cx="100" cy="150" r="80"/>
    <circle cx="650" cy="300" r="120"/>
    <circle cx="200" cy="700" r="90"/>
    <circle cx="600" cy="800" r="60"/>
  </g>
  <!-- Fashion silhouette -->
  <g transform="translate(375,340)" opacity="0.3" fill="${c2}">
    <ellipse cx="0" cy="-70" rx="75" ry="85"/>
    <rect x="-55" y="20" width="110" height="200" rx="25"/>
    <path d="M-55,220 L-55,280 L-30,280 L-30,220 M30,220 L30,280 L55,280 L55,220" fill="${c2}" opacity="0.5"/>
  </g>
  <!-- Bottom card -->
  <rect x="30" y="800" width="690" height="170" rx="20" fill="#ffffff" opacity="0.92"/>
  <text x="70" y="850" font-family="Plus Jakarta Sans, sans-serif" font-size="34" font-weight="800" fill="#1b1c1c">${outfit.name}</text>
  <!-- Occasion tag -->
  <rect x="70" y="870" width="120" height="32" rx="16" fill="${c2}" opacity="0.15"/>
  <text x="130" y="893" font-family="Plus Jakarta Sans, sans-serif" font-size="18" font-weight="600" fill="${c2}" text-anchor="middle">${occasionLabel}</text>
  <!-- Price -->
  <text x="680" y="910" font-family="Plus Jakarta Sans, sans-serif" font-size="38" font-weight="800" fill="${c2}" text-anchor="end">¥${outfit.price}</text>
  <!-- Brand -->
  <text x="680" y="945" font-family="Plus Jakarta Sans, sans-serif" font-size="16" fill="#837377" text-anchor="end">逛逛AI · AI Fashion Curator</text>
</svg>`
}

function generateItemSVG(itemName, idx) {
  const [c1, c2] = softColors[idx % softColors.length]
  const iconMap = {'top': '👚','bottom': '👖','outerwear': '🧥','dress': '👗','shoes': '👠','accessory': '👜'}
  const cat = idx < 3 ? ['top','bottom','shoes'][idx] : 'accessory'
  const icon = iconMap[cat] || '✨'

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
  <defs>
    <linearGradient id="bg${idx}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${c1}"/><stop offset="100%" stop-color="${c2}" stop-opacity="0.7"/>
    </linearGradient>
  </defs>
  <rect width="400" height="400" rx="16" fill="url(#bg${idx})"/>
  <text x="200" y="190" font-family="Arial, sans-serif" font-size="72" text-anchor="middle">${icon}</text>
  <rect x="30" y="310" width="340" height="54" rx="12" fill="#ffffff" opacity="0.85"/>
  <text x="200" y="343" font-family="Plus Jakarta Sans, sans-serif" font-size="20" font-weight="600" fill="${c2}" text-anchor="middle">${itemName}</text>
</svg>`
}

const outDir = path.join(__dirname, '..', 'assets', 'outfits')
fs.mkdirSync(outDir, { recursive: true })

for (const o of outfits) {
  const mainSvg = generateMainSVG(o)
  fs.writeFileSync(path.join(outDir, `${o.id}-main.svg`), mainSvg)
  console.log(`Created ${o.id}-main.svg`)

  const itemNames = ['上衣', '下装', '鞋子']
  for (let i = 0; i < 3; i++) {
    const itemSvg = generateItemSVG(itemNames[i], o.colors * 3 + i)
    fs.writeFileSync(path.join(outDir, `${o.id}-item${i + 1}.svg`), itemSvg)
    console.log(`Created ${o.id}-item${i + 1}.svg`)
  }
}

console.log('\nDone!', outfits.length, 'main +', outfits.length * 3, 'items')

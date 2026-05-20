import type { Outfit, UserPreferences } from '@ggai/shared/types'
import { PRICE_RANGE_MAP } from '@ggai/shared/types'

const AI_THINKING_PHRASES = [
  'Analyzing your style preferences...',
  'Matching color palette...',
  'Scanning latest trends...',
  'Curating outfit combinations...',
  'Calculating style scores...',
  'Generating personalized picks...',
]

export function getAiThinkingPhrases(): string[] {
  return AI_THINKING_PHRASES
}

// Deterministic hash from string — same outfit always gets same base score
function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h) + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export function calculateAiScore(outfit: Outfit, preferences: UserPreferences): number {
  // Base score from outfit's intrinsic quality (deterministic per outfit)
  const baseFromId = 65 + (hashString(outfit.id) % 30) // 65-94 range

  // Item count bonus: more complete outfits score higher
  const itemBonus = Math.min(8, (outfit.items.length - 1) * 3)

  // Brand prestige bonus (expensive brands get slight boost)
  const brandBonus = outfit.totalPrice > 2000 ? 3 : outfit.totalPrice > 1000 ? 2 : outfit.totalPrice > 500 ? 1 : 0

  // Style tag diversity
  const tagBonus = outfit.styleTags.length >= 2 ? 2 : 0

  let score = Math.min(96, baseFromId + itemBonus + brandBonus + tagBonus) // capped at 96 without preferences

  // --- Preference matching (can push score to 99) ---

  // Price tier match
  if (preferences.priceTier !== 'all') {
    const prefRange = PRICE_RANGE_MAP[preferences.priceTier]
    if (prefRange && outfit.totalPrice >= prefRange.range[0] && outfit.totalPrice <= prefRange.range[1]) {
      score = Math.min(99, score + 8)
    } else {
      score = Math.max(50, score - 12)
    }
  }

  // Style tag match
  if (preferences.styleTags.length > 0) {
    const tagOverlap = outfit.styleTags.filter((t) =>
      preferences.styleTags.some((pt) =>
        t.includes(pt) || pt.includes(t) ||
        t.split('').some((c) => pt.includes(c))
      )
    ).length
    score = Math.min(99, score + tagOverlap * 4)
  }

  // Color preference match
  if (preferences.colors.length > 0) {
    const hasMatch = preferences.colors.length >= 2
    score += hasMatch ? 2 : 0
  }

  return Math.min(99, Math.max(50, score))
}

export function aiRecommend(
  outfits: Outfit[],
  occasion: string,
  preferences: UserPreferences,
  count: number = 3,
): { outfit: Outfit; score: number }[] {
  const candidates = outfits
    .filter((o) => o.occasion === occasion)
    .map((o) => ({ outfit: o, score: calculateAiScore(o, preferences) }))
    .sort((a, b) => b.score - a.score)

  return candidates.slice(0, count)
}

export function generateAiOutfitDescription(outfit: Outfit, preferences: UserPreferences): string {
  const score = calculateAiScore(outfit, preferences)
  const items = outfit.items.map((i) => i.name).join('、')
  const priceLabel = PRICE_RANGE_MAP[outfit.priceRange]?.label || ''

  if (score >= 90) {
    return `✨ 逛逛AI 强烈推荐！${outfit.name}完美匹配你的风格。${items}，总价¥${outfit.totalPrice}（${priceLabel}），今天最佳选择。`
  } else if (score >= 80) {
    return `👍 逛逛AI 认为${outfit.name}很适合你。${items}的组合在颜色和风格上高度一致。总价¥${outfit.totalPrice}。`
  } else if (score >= 70) {
    return `💡 逛逛AI 推荐${outfit.name}。${items}的搭配当下很流行。总价¥${outfit.totalPrice}。`
  }
  return `🤔 逛逛AI 觉得${outfit.name}可以尝试。${items}，总价¥${outfit.totalPrice}。值得探索新风格。`
}
